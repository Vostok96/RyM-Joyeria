import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { catalogDefaults, normalizeInventory } from "./_shared/catalog-defaults.mjs";

const ADMIN_PASSWORD_HASH = "f4cbc51239b7a1fd4925049d54cfa2319b263dd301cff5a07d40fff7f455b5fc";
const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function isAuthorized(request) {
  const authorization = request.headers.get("authorization") || "";
  const password = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  const received = Buffer.from(createHash("sha256").update(password).digest("hex"));
  const expected = Buffer.from(ADMIN_PASSWORD_HASH);
  return received.length === expected.length && timingSafeEqual(received, expected);
}

async function readInventory() {
  const store = getStore({ name: "rym-inventory", consistency: "strong" });
  const saved = await store.get("current", { type: "json" });
  return {
    products: normalizeInventory(saved?.products || catalogDefaults),
    updatedAt: saved?.updatedAt || null
  };
}

function emptyDashboard() {
  return {
    totals: { pageViews: 0, sessions: 0, productViews: 0, whatsappClicks: 0, pdfDownloads: 0, cartAdds: 0 },
    topProducts: [],
    daily: [],
    devices: [],
    sources: [],
    rangeDays: 30
  };
}

async function readDashboard() {
  const store = getStore("rym-analytics");
  const { blobs } = await store.list({ prefix: "events/" });
  if (!blobs.length) return emptyDashboard();

  const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const recentKeys = blobs.map((entry) => entry.key).slice(-5000);
  const events = [];

  for (let offset = 0; offset < recentKeys.length; offset += 100) {
    const batch = await Promise.all(recentKeys.slice(offset, offset + 100).map((key) => store.get(key, { type: "json" })));
    batch.forEach((event) => {
      if (event && new Date(event.occurredAt).getTime() >= cutoff) events.push(event);
    });
  }

  const totals = { pageViews: 0, sessions: 0, productViews: 0, whatsappClicks: 0, pdfDownloads: 0, cartAdds: 0 };
  const sessions = new Set();
  const productCounts = new Map();
  const dayCounts = new Map();
  const deviceCounts = new Map();
  const sourceCounts = new Map();

  for (const event of events) {
    if (event.sessionId) sessions.add(event.sessionId);
    if (event.event === "page_view") {
      totals.pageViews += 1;
      const day = event.occurredAt.slice(0, 10);
      dayCounts.set(day, (dayCounts.get(day) || 0) + 1);
      deviceCounts.set(event.device || "unknown", (deviceCounts.get(event.device || "unknown") || 0) + 1);
      const source = event.referrer || "Directo";
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    }
    if (event.event === "view_item" && event.productId) {
      totals.productViews += 1;
      const current = productCounts.get(event.productId) || { id: event.productId, name: event.productName, views: 0 };
      current.views += 1;
      productCounts.set(event.productId, current);
    }
    if (event.event === "whatsapp_click") totals.whatsappClicks += 1;
    if (event.event === "file_download") totals.pdfDownloads += 1;
    if (event.event === "add_to_cart") totals.cartAdds += 1;
  }

  totals.sessions = sessions.size;
  return {
    totals,
    topProducts: [...productCounts.values()].sort((a, b) => b.views - a.views).slice(0, 10),
    daily: [...dayCounts].sort(([a], [b]) => a.localeCompare(b)).map(([date, views]) => ({ date, views })),
    devices: [...deviceCounts].sort((a, b) => b[1] - a[1]).map(([name, views]) => ({ name, views })),
    sources: [...sourceCounts].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, views]) => ({ name, views })),
    rangeDays: 30
  };
}

export default async (request) => {
  if (!isAuthorized(request)) {
    return Response.json({ error: "Acceso no autorizado" }, { status: 401, headers: jsonHeaders });
  }

  try {
    if (request.method === "GET") {
      const url = new URL(request.url);
      const section = url.searchParams.get("section") || "all";
      const response = {};
      if (section === "all" || section === "inventory") response.inventory = await readInventory();
      if (section === "all" || section === "dashboard") response.dashboard = await readDashboard();
      return Response.json(response, { headers: jsonHeaders });
    }

    if (request.method === "PUT") {
      const body = await request.json();
      if (!Array.isArray(body.products)) return Response.json({ error: "Inventario inválido" }, { status: 400, headers: jsonHeaders });
      const products = normalizeInventory(body.products);
      const updatedAt = new Date().toISOString();
      const store = getStore({ name: "rym-inventory", consistency: "strong" });
      await store.setJSON("current", { products, updatedAt });
      return Response.json({ inventory: { products, updatedAt } }, { headers: jsonHeaders });
    }

    return Response.json({ error: "Método no permitido" }, { status: 405, headers: jsonHeaders });
  } catch (error) {
    console.error("admin", error);
    return Response.json({ error: "No se pudo completar la operación" }, { status: 500, headers: jsonHeaders });
  }
};
