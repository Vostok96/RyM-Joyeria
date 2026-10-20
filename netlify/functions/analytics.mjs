import { getStore } from "@netlify/blobs";
import { catalogDefaults } from "./_shared/catalog-defaults.mjs";

const allowedEvents = new Set([
  "page_view",
  "view_item",
  "select_item",
  "add_to_cart",
  "remove_from_cart",
  "whatsapp_click",
  "file_download",
  "filter_category"
]);
const productsById = new Map(catalogDefaults.map((product) => [product.id, product]));

function cleanText(value, maxLength = 120) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export default async (request) => {
  if (request.method !== "POST") {
    return new Response(null, { status: 405, headers: { Allow: "POST" } });
  }

  try {
    const body = await request.json();
    const event = cleanText(body.event, 40);
    if (!allowedEvents.has(event)) return Response.json({ error: "Evento inválido" }, { status: 400 });

    const productId = Number(body.productId) || null;
    const product = productId ? productsById.get(productId) : null;
    const occurredAt = new Date().toISOString();
    const day = occurredAt.slice(0, 10);
    const record = {
      event,
      occurredAt,
      sessionId: cleanText(body.sessionId, 80),
      path: cleanText(body.path, 160),
      productId: product?.id || null,
      productName: product?.name || null,
      category: product?.category || cleanText(body.category, 60) || null,
      label: cleanText(body.label, 80) || null,
      referrer: cleanText(body.referrer, 120) || null,
      device: ["mobile", "tablet", "desktop"].includes(body.device) ? body.device : "unknown"
    };

    const store = getStore("rym-analytics");
    await store.setJSON(`events/${day}/${Date.now()}-${crypto.randomUUID()}`, record, { onlyIfNew: true });
    return new Response(null, { status: 202, headers: { "cache-control": "no-store" } });
  } catch (error) {
    console.error("analytics", error);
    return Response.json({ error: "No se pudo registrar" }, { status: 400 });
  }
};
