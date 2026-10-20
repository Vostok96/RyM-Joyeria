(() => {
  const endpoint = "/api/analytics";
  const sessionKey = "rym-analytics-session";
  const gaId = (window.RYM_GA_ID || document.querySelector('meta[name="rym-ga-id"]')?.content || "").trim();

  function initGA4() {
    if (!gaId || window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    function gtag() { window.dataLayer.push(arguments); }
    window.gtag = gtag;

    gtag("consent", "default", {
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });

    gtag("js", new Date());
    gtag("config", gaId, { send_page_view: false });

    const script = document.createElement("script");
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`;
    document.head.appendChild(script);
  }

  initGA4();

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

  function getProduct(productId) {
    if (!productId || !window.RYM_PRODUCTS) return null;
    return window.RYM_PRODUCTS.find((item) => item.id === Number(productId)) || null;
  }

  function sendToGA4(event, details) {
    if (typeof window.gtag !== "function") return;

    const product = getProduct(details.productId);
    const itemPayload = product ? {
      item_id: String(product.id),
      item_name: product.name,
      item_category: product.category,
      price: product.price,
    } : (details.productId ? { item_id: String(details.productId) } : null);

    switch (event) {
      case "page_view":
        window.gtag("event", "page_view", {
          page_path: `${window.location.pathname}${window.location.search}`,
          page_title: document.title,
        });
        break;
      case "view_item":
        if (itemPayload) {
          window.gtag("event", "view_item", {
            currency: "PEN",
            value: product?.price || 0,
            items: [itemPayload],
          });
        }
        break;
      case "select_item":
        if (itemPayload) {
          window.gtag("event", "select_item", {
            item_list_name: "Catálogo RyM",
            items: [itemPayload],
          });
        }
        break;
      case "add_to_cart":
        if (itemPayload) {
          window.gtag("event", "add_to_cart", {
            currency: "PEN",
            value: product?.price || 0,
            items: [{ ...itemPayload, quantity: 1 }],
          });
        }
        break;
      case "remove_from_cart":
        if (itemPayload) {
          window.gtag("event", "remove_from_cart", {
            currency: "PEN",
            value: product?.price || 0,
            items: [{ ...itemPayload, quantity: 1 }],
          });
        }
        break;
      case "whatsapp_click":
        window.gtag("event", "whatsapp_click", {
          item_id: itemPayload?.item_id || undefined,
          item_name: itemPayload?.item_name || undefined,
          item_category: itemPayload?.item_category || undefined,
          currency: "PEN",
          value: product?.price || undefined,
        });
        break;
      case "file_download":
        window.gtag("event", "file_download", {
          file_name: "catalogo-rym.pdf",
          file_extension: "pdf",
          label: details.label || "catalogo_pdf",
        });
        break;
      case "filter_category":
        window.gtag("event", "view_item_list", {
          item_list_name: details.category || "Todas",
        });
        break;
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
    } else {
      fetch(endpoint, { method: "POST", headers: { "content-type": "application/json" }, body: payload, keepalive: true }).catch(() => {});
    }

    sendToGA4(event, details);
  }

  window.RYM_ANALYTICS = {
    track: send,
    setConsent: (consent = {}) => {
      if (typeof window.gtag === "function") {
        window.gtag("consent", "update", {
          analytics_storage: consent.analytics ? "granted" : "denied",
          ad_storage: consent.ads ? "granted" : "denied",
          ad_user_data: consent.ads ? "granted" : "denied",
          ad_personalization: consent.ads ? "granted" : "denied",
        });
      }
    },
  };

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