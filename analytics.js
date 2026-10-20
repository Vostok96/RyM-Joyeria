(() => {
  const endpoint = "/api/analytics";
  const sessionKey = "rym-analytics-session";

  function getSessionId() {
    try {
      let sessionId = sessionStorage.getItem(sessionKey);
      if (!sessionId) {
        sessionId = crypto.randomUUID();
        sessionStorage.setItem(sessionKey, sessionId);
      }
      return sessionId;
    } catch {
      return crypto.randomUUID();
    }
  }

  function deviceType() {
    if (window.innerWidth < 680) return "mobile";
    if (window.innerWidth < 1024) return "tablet";
    return "desktop";
  }

  function referrerHost() {
    if (!document.referrer) return "";
    try {
      const host = new URL(document.referrer).hostname;
      return host === window.location.hostname ? "Interno" : host;
    } catch {
      return "";
    }
  }

  function send(event, details = {}) {
    const payload = JSON.stringify({
      event,
      sessionId: getSessionId(),
      path: `${window.location.pathname}${window.location.search}`,
      referrer: referrerHost(),
      device: deviceType(),
      ...details,
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
  }

  window.RYM_ANALYTICS = { track: send };
  send("page_view");

  const productId = Number(new URLSearchParams(window.location.search).get("id"));
  if (window.location.pathname.endsWith("producto.html") && productId) {
    (window.RYM_CATALOG_READY || Promise.resolve()).then(() => {
      const product = (window.RYM_PRODUCTS || []).find((item) => item.id === productId);
      if (product) send("view_item", { productId, category: product.category });
    });
  }

  document.addEventListener("click", (event) => {
    const target = event.target.closest("a, button");
    if (!target) return;

    const detailLink = target.closest('a[href*="producto.html?id="]');
    if (detailLink) {
      const id = Number(new URL(detailLink.href, window.location.href).searchParams.get("id"));
      send("select_item", { productId: id });
      return;
    }

    const addButton = target.closest("[data-add-product-id]");
    if (addButton) {
      const productIdValue = Number(addButton.dataset.addProductId);
      const removing = addButton.classList.contains("is-selected");
      send(removing ? "remove_from_cart" : "add_to_cart", { productId: productIdValue });
      return;
    }

    const removeButton = target.closest("[data-remove-product-id]");
    if (removeButton) {
      send("remove_from_cart", { productId: Number(removeButton.dataset.removeProductId) });
      return;
    }

    if (target.closest("[data-catalog-download]")) {
      send("file_download", { label: "catalogo_pdf" });
      return;
    }

    const filter = target.closest("[data-filter]");
    if (filter) {
      send("filter_category", { category: filter.dataset.filter });
      return;
    }

    const whatsapp = target.closest('a[href*="wa.me"], [data-product-id]');
    if (whatsapp) {
      const card = whatsapp.closest(".product-card");
      const detailId = Number(new URLSearchParams(window.location.search).get("id"));
      const cardButtonId = Number(whatsapp.dataset.productId);
      const cardLinkId = Number(new URL(card?.querySelector('a[href*="producto.html?id="]')?.href || window.location.href).searchParams.get("id"));
      send("whatsapp_click", { productId: detailId || cardButtonId || cardLinkId || null });
    }
  });
})();
