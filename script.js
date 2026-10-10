const WHATSAPP_NUMBER = "51917578751";

// Catálogo demostrativo. Reemplaza estos objetos por tus productos reales.
// Para fotos finales usa WebP/AVIF de 1200–1600 px, fondo limpio y relación 4:5.
const products = [
  { id: 1, name: "Anillo Aurelia", category: "Anillos", detail: "Baño de oro 18k", price: 189, stock: "Última pieza", image: "assets/images/ring-solitaire.webp", imageAvif: "assets/images/ring-solitaire.avif", alt: "Anillo dorado Aurelia con piedra transparente", bg: "#f2eee9" },
  { id: 2, name: "Collar Celeste", category: "Collares", detail: "Madreperla y baño de oro", price: 239, stock: "Pocas unidades", image: "assets/images/necklace-pearl.webp", imageAvif: "assets/images/necklace-pearl.avif", alt: "Collar dorado Celeste con medallón de madreperla", bg: "#f3e8e7" },
  { id: 3, name: "Pulsera Alma", category: "Pulseras", detail: "Cadena fina y perla", price: 159, stock: "Bajo pedido", image: "assets/images/bracelet-pearl.webp", imageAvif: "assets/images/bracelet-pearl.avif", alt: "Pulsera dorada Alma con perla", bg: "#ece9e4" },
  { id: 4, name: "Anillo Éclat", category: "Anillos", detail: "Cristal rosa talla oval", price: 219, stock: "Agotado", image: "assets/images/ring-blush.webp", imageAvif: "assets/images/ring-blush.avif", alt: "Anillo dorado Éclat con cristal rosa ovalado", bg: "#f1e9e2" },
];

const artTemplates = {
  solitaire: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g1" x1="80" y1="90" x2="290" y2="340"><stop stop-color="#fff1ad"/><stop offset=".35" stop-color="#b77c24"/><stop offset=".63" stop-color="#f4d36e"/><stop offset="1" stop-color="#8b5819"/></linearGradient><linearGradient id="d1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#eadedf"/><stop offset="1" stop-color="#b9a3a7"/></linearGradient></defs><ellipse cx="180" cy="248" rx="105" ry="76" fill="none" stroke="url(#g1)" stroke-width="18"/><path d="M142 178l12-48h52l12 48-38 29z" fill="url(#d1)" stroke="#b77c24" stroke-width="7"/><path d="M154 130l26 77 26-77M142 178h76" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="3"/></svg>`,
  pendant: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g2" x1="60" y1="35" x2="285" y2="360"><stop stop-color="#ffe997"/><stop offset=".4" stop-color="#ad7320"/><stop offset=".65" stop-color="#efd06a"/><stop offset="1" stop-color="#85521a"/></linearGradient><radialGradient id="p2" cx=".35" cy=".25"><stop stop-color="#fff"/><stop offset=".55" stop-color="#f5e9e7"/><stop offset="1" stop-color="#c4abad"/></radialGradient></defs><path d="M62 74c24 118 59 176 118 211 59-35 94-93 118-211" fill="none" stroke="url(#g2)" stroke-width="5"/><circle cx="180" cy="281" r="54" fill="url(#p2)" stroke="url(#g2)" stroke-width="8"/><circle cx="180" cy="214" r="11" fill="#f4d06a" stroke="#9a631c" stroke-width="4"/></svg>`,
  bracelet: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g3" x1="50" y1="130" x2="310" y2="280"><stop stop-color="#8c5918"/><stop offset=".25" stop-color="#f7d977"/><stop offset=".5" stop-color="#b77922"/><stop offset=".8" stop-color="#ffeda1"/><stop offset="1" stop-color="#8c5918"/></linearGradient></defs><ellipse cx="180" cy="215" rx="127" ry="72" fill="none" stroke="url(#g3)" stroke-width="11" transform="rotate(-11 180 215)"/><circle cx="274" cy="140" r="23" fill="#f8e6e3" stroke="url(#g3)" stroke-width="7"/><path d="M96 169l-13-19m190 53l21 10" stroke="#d29b3f" stroke-width="9" stroke-linecap="round"/></svg>`,
  oval: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g4" x1="80" y1="100" x2="285" y2="335"><stop stop-color="#ffe992"/><stop offset=".38" stop-color="#a96d20"/><stop offset=".72" stop-color="#efd06b"/><stop offset="1" stop-color="#845117"/></linearGradient><radialGradient id="d4" cx=".35" cy=".25"><stop stop-color="#fff"/><stop offset=".45" stop-color="#efdbdd"/><stop offset="1" stop-color="#a98e94"/></radialGradient></defs><ellipse cx="180" cy="254" rx="106" ry="72" fill="none" stroke="url(#g4)" stroke-width="17"/><ellipse cx="180" cy="163" rx="55" ry="72" fill="url(#d4)" stroke="url(#g4)" stroke-width="8"/><path d="M151 115l58 96M209 115l-58 96M126 163h108" stroke="#fff" stroke-opacity=".6" stroke-width="3"/></svg>`,
  pearl: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g5" x1="80" y1="50" x2="280" y2="350"><stop stop-color="#ffed9f"/><stop offset=".45" stop-color="#ae7524"/><stop offset=".7" stop-color="#f6dc86"/><stop offset="1" stop-color="#8e5c1d"/></linearGradient><radialGradient id="p5" cx=".3" cy=".22"><stop stop-color="#fff"/><stop offset=".48" stop-color="#f7efea"/><stop offset="1" stop-color="#c8b7ae"/></radialGradient></defs><path d="M55 68c30 133 71 192 125 232 54-40 95-99 125-232" fill="none" stroke="url(#g5)" stroke-width="4"/><path d="M180 231c-35 34-50 60-50 86a50 50 0 00100 0c0-26-15-52-50-86z" fill="url(#p5)" stroke="url(#g5)" stroke-width="7"/><path d="M159 247l21-28 21 28" fill="none" stroke="url(#g5)" stroke-width="7"/></svg>`,
  chain: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g6" x1="45" y1="120" x2="315" y2="310"><stop stop-color="#94601c"/><stop offset=".28" stop-color="#ffe991"/><stop offset=".5" stop-color="#b77b27"/><stop offset=".75" stop-color="#f4d475"/><stop offset="1" stop-color="#845117"/></linearGradient></defs><g fill="none" stroke="url(#g6)" stroke-width="13">${Array.from({length: 12}, (_, i) => `<ellipse cx="${72 + (i % 6) * 43}" cy="${155 + Math.floor(i / 6) * 100 + (i % 2) * 14}" rx="31" ry="19" transform="rotate(${i % 2 ? 25 : -25} ${72 + (i % 6) * 43} ${155 + Math.floor(i / 6) * 100 + (i % 2) * 14})"/>`).join("")}</g></svg>`,
  double: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g7" x1="60" y1="100" x2="300" y2="340"><stop stop-color="#ffec9c"/><stop offset=".4" stop-color="#a86b1b"/><stop offset=".68" stop-color="#f1cf6b"/><stop offset="1" stop-color="#815018"/></linearGradient></defs><ellipse cx="145" cy="240" rx="91" ry="70" fill="none" stroke="url(#g7)" stroke-width="14" transform="rotate(-17 145 240)"/><ellipse cx="218" cy="230" rx="91" ry="70" fill="none" stroke="url(#g7)" stroke-width="14" transform="rotate(17 218 230)"/><circle cx="182" cy="158" r="27" fill="#f3dcdd" stroke="url(#g7)" stroke-width="7"/></svg>`,
  medallion: `<svg viewBox="0 0 360 420" aria-hidden="true"><defs><linearGradient id="g8" x1="60" y1="40" x2="300" y2="350"><stop stop-color="#ffed9f"/><stop offset=".35" stop-color="#ab701e"/><stop offset=".65" stop-color="#f3d477"/><stop offset="1" stop-color="#895619"/></linearGradient></defs><path d="M58 65c27 129 65 190 122 223 57-33 95-94 122-223" fill="none" stroke="url(#g8)" stroke-width="5"/><circle cx="180" cy="288" r="60" fill="url(#g8)"/><circle cx="180" cy="288" r="48" fill="#d4a44e" stroke="#ffe89c" stroke-width="3"/><path d="M180 258c-19 11-29 26-29 43 11-4 21-3 29 7 8-10 18-11 29-7 0-17-10-32-29-43z" fill="#efd17b" opacity=".85"/><circle cx="180" cy="215" r="10" fill="#f4d06e" stroke="#95601b" stroke-width="4"/></svg>`,
};

const formatPrice = (price) => `S/ ${Number(price).toFixed(2)}`;

function whatsappUrl(product) {
  const message = `Hola RyM Joyería, deseo adquirir el ${product.name} que vi en su catálogo por ${formatPrice(product.price)}. Estado: ${product.stock}. ¿Podrían brindarme más información?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function productCard(product) {
  const soldOut = product.stock === "Agotado";
  const media = product.image
    ? `<picture>
         ${product.imageAvif ? `<source srcset="${product.imageAvif}" type="image/avif">` : ""}
         <img
           src="${product.image}"
           alt="${product.alt || product.name}"
           width="1200"
           height="1500"
           loading="lazy"
           decoding="async"
         >
       </picture>`
    : artTemplates[product.art];
  return `
    <article class="product-card reveal" data-category="${product.category}" style="--product-bg:${product.bg}">
      <div class="product-card__media">
        <span class="product-card__badge${soldOut ? " product-card__badge--sold" : ""}">${product.stock}</span>
        <div class="product-card__image${product.image ? " product-card__image--photo" : ""}">${media}</div>
      </div>
      <div class="product-card__body">
        <div class="product-card__meta">
          <div>
            <h3 class="product-card__name">${product.name}</h3>
            <p class="product-card__type">${product.detail}</p>
          </div>
          <p class="product-card__price">${formatPrice(product.price)}</p>
        </div>
        <button class="product-card__action" type="button" data-product-id="${product.id}" ${soldOut ? "disabled" : ""}>
          <span>${soldOut ? "Temporalmente agotado" : "Consultar por WhatsApp"}</span>
          <span aria-hidden="true">${soldOut ? "—" : "↗"}</span>
        </button>
      </div>
    </article>`;
}

const grid = document.querySelector("#product-grid");
grid.innerHTML = products.map(productCard).join("");

grid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-product-id]");
  if (!button || button.disabled) return;
  const product = products.find((item) => item.id === Number(button.dataset.productId));
  if (product) window.open(whatsappUrl(product), "_blank", "noopener,noreferrer");
});

function setFilter(filterName) {
  document.querySelectorAll(".filter").forEach((button) => {
    const active = button.dataset.filter === filterName;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });

  document.querySelectorAll(".product-card").forEach((card) => {
    card.hidden = filterName !== "Todos" && card.dataset.category !== filterName;
  });
}

document.querySelectorAll(".filter").forEach((button) => {
  button.addEventListener("click", () => setFilter(button.dataset.filter));
});

document.querySelectorAll("[data-filter-link]").forEach((link) => {
  link.addEventListener("click", () => setFilter(link.dataset.filterLink));
});

const menuButton = document.querySelector(".menu-toggle");
const mobileMenu = document.querySelector("#mobile-menu");

function closeMenu() {
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Abrir menú");
  mobileMenu.hidden = true;
  document.body.classList.remove("menu-open");
}

menuButton.addEventListener("click", () => {
  const open = menuButton.getAttribute("aria-expanded") === "true";
  if (open) {
    closeMenu();
  } else {
    menuButton.setAttribute("aria-expanded", "true");
    menuButton.setAttribute("aria-label", "Cerrar menú");
    mobileMenu.hidden = false;
    document.body.classList.add("menu-open");
  }
});

mobileMenu.addEventListener("click", (event) => {
  if (!event.target.closest("a")) return;
  closeMenu();
});

window.addEventListener("hashchange", closeMenu);
window.addEventListener("resize", () => {
  if (window.innerWidth > 980) closeMenu();
}, { passive: true });

const header = document.querySelector("[data-header]");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 16);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const observer = new IntersectionObserver(
  (entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    }
  }),
  { threshold: 0.12 }
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
document.querySelector("#current-year").textContent = new Date().getFullYear();
