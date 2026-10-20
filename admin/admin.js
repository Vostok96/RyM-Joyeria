const apiUrl = "/api/admin";
const passwordKey = "rym-admin-password";

const loginSection = document.querySelector("[data-login]");
const dashboardSection = document.querySelector("[data-dashboard]");
const loginForm = document.querySelector("[data-login-form]");
const loginStatus = document.querySelector("[data-login-status]");
const saveStatus = document.querySelector("[data-save-status]");
const inventoryBody = document.querySelector("[data-inventory]");
let password = sessionStorage.getItem(passwordKey) || "";
let inventory = [];

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

async function api(path = "", options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    ...options,
    headers: { "content-type": "application/json", authorization: `Bearer ${password}`, ...(options.headers || {}) },
    cache: "no-store",
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.error || "No se pudo completar la operación");
  return payload;
}

function metricCard(label, value, note) {
  return `<article class="metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><small>${escapeHtml(note)}</small></article>`;
}

function renderDashboard(data) {
  const totals = data.totals;
  document.querySelector("[data-metrics]").innerHTML = [
    metricCard("Vistas de página", totals.pageViews, "Páginas cargadas"),
    metricCard("Sesiones", totals.sessions, "Visitas aproximadas"),
    metricCard("Productos vistos", totals.productViews, "Fichas abiertas"),
    metricCard("Clics en WhatsApp", totals.whatsappClicks, "Intención de compra"),
    metricCard("Descargas PDF", totals.pdfDownloads, "Catálogos generados"),
    metricCard("Agregados a cartera", totals.cartAdds, "Productos guardados"),
  ].join("");

  const top = data.topProducts;
  document.querySelector("[data-top-products]").innerHTML = top.length ? top.map((item, index) => `
    <div class="rank-row"><span>${index + 1}</span><strong>${escapeHtml(item.name)}</strong><b>${item.views}</b></div>
  `).join("") : '<p class="empty">Las visualizaciones aparecerán desde ahora.</p>';

  const maxViews = Math.max(1, ...data.daily.map((item) => item.views));
  document.querySelector("[data-daily]").innerHTML = data.daily.length ? data.daily.map((item) => `
    <div class="bar" title="${escapeHtml(item.date)}: ${item.views} vistas"><i style="--height:${Math.max(8, (item.views / maxViews) * 100)}%"></i><span>${escapeHtml(item.date.slice(5))}</span></div>
  `).join("") : '<p class="empty">Aún no hay datos registrados.</p>';

  const labels = { mobile: "Móvil", tablet: "Tablet", desktop: "Computadora", unknown: "Otro" };
  document.querySelector("[data-devices]").innerHTML = data.devices.length ? data.devices.map((item) => `<div><span>${labels[item.name] || escapeHtml(item.name)}</span><strong>${item.views}</strong></div>`).join("") : '<p class="empty">Sin datos todavía.</p>';
  document.querySelector("[data-sources]").innerHTML = data.sources.length ? data.sources.map((item) => `<div><span>${escapeHtml(item.name)}</span><strong>${item.views}</strong></div>`).join("") : '<p class="empty">Sin datos todavía.</p>';
}

function stockLabel(quantity) {
  if (quantity <= 0) return "Agotado";
  if (quantity === 1) return "Última pieza";
  return "Disponible";
}

function renderInventory(data) {
  inventory = data.products;
  inventoryBody.innerHTML = inventory.map((product) => `
    <tr data-id="${product.id}">
      <td><strong>${escapeHtml(product.name)}</strong><small>RYM-${String(product.id).padStart(3, "0")}</small></td>
      <td>${escapeHtml(product.category)}</td>
      <td><input class="number-input" data-field="price" type="number" min="0" step="0.50" value="${product.price.toFixed(2)}" aria-label="Precio de ${escapeHtml(product.name)}"></td>
      <td><input class="number-input number-input--quantity" data-field="quantity" type="number" min="0" step="1" value="${product.quantity}" aria-label="Unidades de ${escapeHtml(product.name)}"></td>
      <td><span class="stock stock--${product.quantity === 0 ? "out" : product.quantity === 1 ? "last" : "ok"}" data-stock>${escapeHtml(stockLabel(product.quantity))}</span></td>
      <td><label class="switch"><input data-field="visible" type="checkbox" ${product.visible ? "checked" : ""} aria-label="Mostrar ${escapeHtml(product.name)}"><span></span></label></td>
    </tr>
  `).join("");
  document.querySelector("[data-updated]").textContent = data.updatedAt ? `Última actualización: ${new Date(data.updatedAt).toLocaleString("es-PE")}` : "Inventario inicial del catálogo.";
}

async function loadPanel() {
  loginStatus.textContent = "Comprobando acceso...";
  const payload = await api("?section=all");
  loginSection.hidden = true;
  dashboardSection.hidden = false;
  loginStatus.textContent = "";
  renderDashboard(payload.dashboard);
  renderInventory(payload.inventory);
}

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  password = new FormData(loginForm).get("password").trim();
  loginStatus.textContent = "Ingresando...";
  try {
    await loadPanel();
    sessionStorage.setItem(passwordKey, password);
    loginForm.reset();
  } catch (error) {
    password = "";
    sessionStorage.removeItem(passwordKey);
    loginStatus.textContent = error.message;
  }
});

inventoryBody.addEventListener("input", (event) => {
  if (event.target.dataset.field !== "quantity") return;
  const row = event.target.closest("tr");
  const quantity = Math.max(0, Math.trunc(Number(event.target.value) || 0));
  const badge = row.querySelector("[data-stock]");
  badge.textContent = stockLabel(quantity);
  badge.className = `stock stock--${quantity === 0 ? "out" : quantity === 1 ? "last" : "ok"}`;
});

document.querySelector("[data-save]").addEventListener("click", async () => {
  const products = [...inventoryBody.querySelectorAll("tr")].map((row) => ({
    id: Number(row.dataset.id),
    price: Number(row.querySelector('[data-field="price"]').value),
    quantity: Math.max(0, Math.trunc(Number(row.querySelector('[data-field="quantity"]').value) || 0)),
    visible: row.querySelector('[data-field="visible"]').checked,
  }));
  saveStatus.textContent = "Guardando cambios...";
  try {
    const payload = await api("", { method: "PUT", body: JSON.stringify({ products }) });
    renderInventory(payload.inventory);
    saveStatus.textContent = "Cambios publicados correctamente.";
  } catch (error) {
    saveStatus.textContent = error.message;
  }
});

document.querySelector("[data-refresh]").addEventListener("click", async () => {
  try {
    const payload = await api("?section=dashboard");
    renderDashboard(payload.dashboard);
  } catch (error) {
    saveStatus.textContent = error.message;
  }
});

document.querySelector("[data-logout]").addEventListener("click", () => {
  password = "";
  sessionStorage.removeItem(passwordKey);
  dashboardSection.hidden = true;
  loginSection.hidden = false;
});

if (password) loadPanel().catch(() => {
  password = "";
  sessionStorage.removeItem(passwordKey);
  loginStatus.textContent = "La sesión venció. Ingresa nuevamente.";
});
