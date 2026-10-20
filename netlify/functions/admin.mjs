import { createHash, timingSafeEqual } from "node:crypto";
import { getStore } from "@netlify/blobs";
import { catalogDefaults, normalizeInventory } from "./_shared/catalog-defaults.mjs";

const DEFAULT_ADMIN_HASH = "d687620ec1b0fed6ca9af9a5f57399996b2d2b0c70e767ff05913529d638ce71";
const ADMIN_PASSWORD_HASH = (process.env.ADMIN_PASSWORD_HASH || DEFAULT_ADMIN_HASH).trim().toLowerCase();
const jsonHeaders = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };

function getClientIpKey(request) {
  const ip =
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("client-ip") ||
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";
  return ip === "unknown" ? "unknown" : createHash("sha256").update(ip).digest("hex").slice(0, 24);
}

async function isLockedOut(ipKey, secStore) {
  if (ipKey === "unknown") return false;
  try {
    const record = await secStore.get(`lockout/${ipKey}`, { type: "json" });
    if (record && record.lockedUntil && record.lockedUntil > Date.now()) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

async function recordFailure(ipKey, secStore) {
  if (ipKey === "unknown") return;
  try {
    const now = Date.now();
    const record = (await secStore.get(`lockout/${ipKey}`, { type: "json" })) || { attempts: 0, firstAttempt: now };
    if (now - (record.firstAttempt || now) > 10 * 60 * 1000) {
      record.attempts = 1;
      record.firstAttempt = now;
      record.lockedUntil = 0;
    } else {
      record.attempts = (record.attempts || 0) + 1;
    }
    if (record.attempts >= 5) {
      record.lockedUntil = now + 15 * 60 * 1000;
    }
    await secStore.setJSON(`lockout/${ipKey}`, record);
  } catch {}
}

async function resetFailure(ipKey, secStore) {
  if (ipKey === "unknown") return;
  try {
    await secStore.delete(`lockout/${ipKey}`);
  } catch {}
}

function isAuthorized(request) {
  const authorization = request.headers.get("authorization") || "";
  const password = authorization.startsWith("Bearer ") ? authorization.slice(7) : "";
  if (!password) return false;
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

function aggregateDayEvents(events, day) {
  const totals = { pageViews: 0, productViews: 0, whatsappClicks: 0, pdfDownloads: 0, cartAdds: 0 };
  const sessions = new Set();
  const productCounts = new Map();
  const deviceCounts = new Map();
  const sourceCounts = new Map();

  for (const event of events) {
    if (!event) continue;
    if (event.sessionId) sessions.add(event.sessionId);
    if (event.event === "page_view") {
      totals.pageViews += 1;
      deviceCounts.set(event.device || "unknown", (deviceCounts.get(event.device || "unknown") || 0) + 1);
      const source = event.referrer || "Directo";
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1);
    }
    if (event.event === "view_item" && event.productId) {
      totals.productViews += 1;
      const current = productCounts.get(event.productId) || { id: event.productId, name: event.productName, views: 0 };
      current.views += 1;
      if (!current.name && event.productName) current.name = event.productName;
      productCounts.set(event.productId, current);
    }
    if (event.event === "whatsapp_click") totals.whatsappClicks += 1;
    if (event.event === "file_download") totals.pdfDownloads += 1;
    if (event.event === "add_to_cart") totals.cartAdds += 1;
  }

  return {
    date: day,
    totals,
    sessions: [...sessions],
    productCounts: [...productCounts.values()],
    deviceCounts: [...deviceCounts.entries()],
    sourceCounts: [...sourceCounts.entries()]
  };
}

async function readDashboard() {
  const store = getStore("rym-analytics");
  const { blobs } = await store.list({ prefix: "events/" });
  if (!blobs.length) return emptyDashboard();

  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const cutoffMs = now.getTime() - 30 * 24 * 60 * 60 * 1000;
  const cutoffDate = new Date(cutoffMs).toISOString().slice(0, 10);

  const keysByDay = new Map();
  for (const { key } of blobs) {
    const parts = key.split("/");
    const day = parts[1];
    if (!day || day < cutoffDate) continue;
    if (!keysByDay.has(day)) keysByDay.set(day, []);
    keysByDay.get(day).push(key);
  }

  const days = [...keysByDay.keys()].sort();
  if (!days.length) return emptyDashboard();

  const dailySummaries = await Promise.all(
    days.map(async (day) => {
      const dayKeys = keysByDay.get(day) || [];
      if (day < today) {
        try {
          const cached = await store.get(`summaries/${day}`, { type: "json" });
          if (cached) return cached;
        } catch {}
      }

      const recentDayKeys = dayKeys.slice(-400);
      const events = await Promise.all(recentDayKeys.map((k) => store.get(k, { type: "json" }).catch(() => null)));
      const summary = aggregateDayEvents(events, day);

      if (day < today) {
        store.setJSON(`summaries/${day}`, summary).catch(() => {});
      }
      return summary;
    })
  );

  const totals = { pageViews: 0, sessions: 0, productViews: 0, whatsappClicks: 0, pdfDownloads: 0, cartAdds: 0 };
  const allSessions = new Set();
  const combinedProducts = new Map();
  const combinedDays = new Map();
  const combinedDevices = new Map();
  const combinedSources = new Map();

  for (const summary of dailySummaries) {
    if (!summary) continue;
    totals.pageViews += summary.totals.pageViews || 0;
    totals.productViews += summary.totals.productViews || 0;
    totals.whatsappClicks += summary.totals.whatsappClicks || 0;
    totals.pdfDownloads += summary.totals.pdfDownloads || 0;
    totals.cartAdds += summary.totals.cartAdds || 0;

    (summary.sessions || []).forEach((sessionId) => allSessions.add(sessionId));

    if (summary.totals.pageViews) {
      combinedDays.set(summary.date, (combinedDays.get(summary.date) || 0) + summary.totals.pageViews);
    }

    for (const item of summary.productCounts || []) {
      const current = combinedProducts.get(item.id) || { id: item.id, name: item.name, views: 0 };
      current.views += item.views;
      if (!current.name && item.name) current.name = item.name;
      combinedProducts.set(item.id, current);
    }

    for (const [device, count] of summary.deviceCounts || []) {
      combinedDevices.set(device, (combinedDevices.get(device) || 0) + count);
    }

    for (const [source, count] of summary.sourceCounts || []) {
      combinedSources.set(source, (combinedSources.get(source) || 0) + count);
    }
  }

  totals.sessions = allSessions.size;
  return {
    totals,
    topProducts: [...combinedProducts.values()].sort((a, b) => b.views - a.views).slice(0, 10),
    daily: [...combinedDays].sort(([a], [b]) => a.localeCompare(b)).map(([date, views]) => ({ date, views })),
    devices: [...combinedDevices].sort((a, b) => b[1] - a[1]).map(([name, views]) => ({ name, views })),
    sources: [...combinedSources].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([name, views]) => ({ name, views })),
    rangeDays: 30
  };
}

export default async (request) => {
  const secStore = getStore("rym-security");
  const ipKey = getClientIpKey(request);

  if (await isLockedOut(ipKey, secStore)) {
    return Response.json(
      { error: "Demasiados intentos fallidos. Acceso bloqueado temporalmente por 15 minutos." },
      { status: 429, headers: jsonHeaders }
    );
  }

  if (!isAuthorized(request)) {
    await recordFailure(ipKey, secStore);
    return Response.json({ error: "Clave de acceso incorrecta" }, { status: 401, headers: jsonHeaders });
  }

  resetFailure(ipKey, secStore).catch(() => {});

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
