import { getStore } from "@netlify/blobs";
import { catalogDefaults, normalizeInventory } from "./_shared/catalog-defaults.mjs";

const jsonHeaders = {
  "content-type": "application/json; charset=utf-8",
  "cache-control": "no-store, max-age=0"
};

export default async (request) => {
  if (request.method !== "GET") {
    return Response.json({ error: "Método no permitido" }, { status: 405, headers: jsonHeaders });
  }

  try {
    const store = getStore({ name: "rym-inventory", consistency: "strong" });
    const saved = await store.get("current", { type: "json" });
    return Response.json({
      products: normalizeInventory(saved?.products || catalogDefaults),
      updatedAt: saved?.updatedAt || null,
      source: saved ? "live" : "defaults"
    }, { headers: jsonHeaders });
  } catch (error) {
    console.error("catalog", error);
    return Response.json({ products: catalogDefaults, updatedAt: null, source: "fallback" }, { headers: jsonHeaders });
  }
};
