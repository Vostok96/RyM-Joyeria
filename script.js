const WHATSAPP_NUMBER = "51917578751";

// Catálogo real de RyM. Los precios quedan pendientes de confirmación comercial.
const products = [
  { id: 1, name: "Anillo Doble Hélice", category: "Anillos", detail: "Anillo", description: "Dos líneas entrelazadas que celebran conexión, equilibrio y elegancia.", price: null, stock: "Disponible", image: "assets/products/anillos/anillo-doble-helice-2.jpeg", alt: "Anillo Doble Hélice dorado", bg: "#f2eee9" },
  { id: 2, name: "Anillo Flowersel", category: "Anillos", detail: "Anillo", description: "Una flor luminosa que aporta romanticismo y delicadeza a tus manos.", price: null, stock: "Disponible", image: "assets/products/anillos/anillo-flowersel-1.jpeg", alt: "Anillo Flowersel dorado con diseño floral", bg: "#f3e8e7" },
  { id: 3, name: "Anillo Pirámide de Luz", category: "Anillos", detail: "Anillo", description: "Geometría brillante para un estilo moderno, seguro y lleno de personalidad.", price: null, stock: "Disponible", image: "assets/products/anillos/anillo-piramide-de-luz-1.jpeg", alt: "Anillo Pirámide de Luz dorado", bg: "#f4e4e5" },

  { id: 4, name: "Argollas Clásicas Gold", category: "Aretes", detail: "Aretes", description: "Un básico atemporal que acompaña tus looks con elegancia natural.", price: null, stock: "Disponible", image: "assets/products/aretes/argollas-clasicas-gold-1.jpeg", alt: "Argollas Clásicas Gold", bg: "#ece9e4" },
  { id: 5, name: "Argollas Destello Real", category: "Aretes", detail: "Aretes", description: "Argollas delicadas que enmarcan el rostro con un brillo distinguido.", price: null, stock: "Disponible", image: "assets/products/aretes/argollas-destello-real-1.jpeg", alt: "Argollas Destello Real doradas", bg: "#f2ebe5" },
  { id: 6, name: "Cherry Love", category: "Aretes", detail: "Aretes", description: "Cerezas llenas de color para un look dulce, fresco y divertido.", price: null, stock: "Disponible", image: "assets/products/aretes/cherry-love-1.jpeg", alt: "Aretes Cherry Love con diseño de cerezas", bg: "#f1e9e2" },
  { id: 7, name: "Corazón Zircon", category: "Aretes", detail: "Aretes", description: "Un corazón luminoso que añade romanticismo y encanto a cada gesto.", price: null, stock: "Disponible", image: "assets/products/aretes/corazon-zircon-1.jpeg", alt: "Aretes Corazón Zircon", bg: "#f2eee9" },
  { id: 8, name: "Mariposa Cristal", category: "Aretes", detail: "Aretes", description: "Mariposas brillantes que evocan libertad, transformación y delicadeza.", price: null, stock: "Disponible", image: "assets/products/aretes/mariposa-cristal-1.jpeg", alt: "Aretes Mariposa Cristal", bg: "#f3e8e7" },

  { id: 9, name: "Cadena Cordón Imperial", category: "Collares", detail: "Cadena", description: "Una cadena de presencia elegante para elevar conjuntos clásicos y contemporáneos.", price: null, stock: "Disponible", image: "assets/products/collares/cadena-cordon-imperial-1.jpeg", alt: "Cadena Cordón Imperial dorada", bg: "#f4e4e5" },
  { id: 10, name: "Cadena Grumet Fina", category: "Collares", detail: "Cadena", description: "Eslabones finos y versátiles para sumar carácter sin perder sutileza.", price: null, stock: "Disponible", image: "assets/products/collares/cadena-grumet-fina-1.jpeg", alt: "Cadena Grumet Fina dorada", bg: "#ece9e4" },
  { id: 11, name: "Cadena Minimal Gold", category: "Collares", detail: "Cadena", description: "Sutileza dorada y líneas limpias para acompañarte todos los días.", price: null, stock: "Disponible", image: "assets/products/collares/cadena-minimal-gold-1.jpeg", alt: "Cadena Minimal Gold", bg: "#f2ebe5" },
  { id: 12, name: "Collar Brújula del Destino", category: "Collares", detail: "Collar", description: "Un símbolo de orientación para llevar contigo sueños, caminos y propósito.", price: null, stock: "Disponible", image: "assets/products/collares/collar-brujula-del-destino-1.jpeg", alt: "Collar Brújula del Destino dorado", bg: "#f1e9e2" },
  { id: 13, name: "Collar Constelación", category: "Collares", detail: "Collar", description: "Pequeños destellos celestiales que iluminan el escote con elegancia sutil.", price: null, stock: "Disponible", image: "assets/products/collares/collar-constelacion-1.jpeg", alt: "Collar Constelación dorado", bg: "#f2eee9" },
  { id: 14, name: "Collar Estrella Brillante", category: "Collares", detail: "Collar", description: "Una estrella protagonista que aporta luz y encanto a cualquier ocasión.", price: null, stock: "Disponible", image: "assets/products/collares/collar-estrella-brillante-1.jpeg", alt: "Collar Estrella Brillante dorado", bg: "#f3e8e7" },
  { id: 15, name: "Collar Primeros Pasos", category: "Collares", detail: "Collar", description: "Un recuerdo tierno y significativo para celebrar los primeros momentos.", price: null, stock: "Disponible", image: "assets/products/collares/collar-primeros-pasos-1.jpeg", alt: "Collar Primeros Pasos dorado", bg: "#f4e4e5" },
  { id: 16, name: "Rosario Edición Celestial", category: "Collares", detail: "Rosario", description: "Inspiración espiritual y detalles delicados en una pieza serena y especial.", price: null, stock: "Disponible", image: "assets/products/collares/rosario-edicion-celestial-1.jpeg", alt: "Rosario Edición Celestial dorado", bg: "#ece9e4" },

  { id: 17, name: "Colibrí de Luz", category: "Dijes", detail: "Dije", description: "Un símbolo de alegría y esperanza que cobra vida con cada movimiento.", price: null, stock: "Disponible", image: "assets/products/dijes/colibri-de-luz-1.jpeg", alt: "Dije Colibrí de Luz dorado", bg: "#f2ebe5" },
  { id: 18, name: "Dije René", category: "Dijes", detail: "Dije", description: "Un pez dorado lleno de movimiento, carácter y un encanto singular.", price: null, stock: "Disponible", image: "assets/products/dijes/dije-rene-1.jpeg", alt: "Dije René dorado con forma de pez", bg: "#f1e9e2" },
  { id: 19, name: "Dije San Benito", category: "Dijes", detail: "Dije", description: "Un emblema clásico de protección y fe para llevar siempre contigo.", price: null, stock: "Disponible", image: "assets/products/dijes/dije-san-benito-1.jpeg", alt: "Dije San Benito dorado", bg: "#f2eee9" },
  { id: 20, name: "Dije Sueño de Hada", category: "Dijes", detail: "Dije", description: "Una pequeña hada bajo la luna que convierte cada look en fantasía.", price: null, stock: "Disponible", image: "assets/products/dijes/dije-sueno-de-hada-1.jpeg", alt: "Dije Sueño de Hada dorado", bg: "#f3e8e7" },
  { id: 21, name: "Virgen de Guadalupe", category: "Dijes", detail: "Dije", description: "Una imagen devocional delicada que expresa fe, cercanía y esperanza.", price: null, stock: "Disponible", image: "assets/products/dijes/virgen-de-guadalupe-1.jpeg", alt: "Dije Virgen de Guadalupe dorado", bg: "#f4e4e5" },

  { id: 22, name: "Dúo Cherry Brillante", category: "Dijes + Aretes", detail: "Dije + aretes", description: "Cerezas coordinadas para crear un conjunto alegre, dulce y lleno de color.", price: null, stock: "Disponible", image: "assets/products/dijes-aretes/duo-cherry-brillante-1.jpeg", alt: "Dúo Cherry Brillante de dije y aretes", bg: "#ece9e4" },
  { id: 23, name: "Dúo Conejito Pastel", category: "Dijes + Aretes", detail: "Dije + aretes", description: "Conejitos encantadores en un dúo tierno, divertido y fácil de combinar.", price: null, stock: "Disponible", image: "assets/products/dijes-aretes/duo-conejito-pastel-1.jpeg", alt: "Dúo Conejito Pastel de dije y aretes", bg: "#f2ebe5" },
  { id: 24, name: "Dúo Estrella Zircon", category: "Dijes + Aretes", detail: "Dije + aretes", description: "Estrellas coordinadas que multiplican el brillo con un aire moderno y juvenil.", price: null, stock: "Disponible", image: "assets/products/dijes-aretes/duo-estrella-zircon-1.jpeg", alt: "Dúo Estrella Zircon de dije y aretes", bg: "#f1e9e2" },

  { id: 25, name: "Brazalete Dorada Seducción", category: "Pulseras", detail: "Brazalete", description: "Una silueta limpia y audaz que aporta sofisticación instantánea a la muñeca.", price: null, stock: "Disponible", image: "assets/products/pulseras/brazalete-dorada-seduccion-1.jpeg", alt: "Brazalete Dorada Seducción", bg: "#f2eee9" },
  { id: 26, name: "Brazalete Malla Dorada", category: "Pulseras", detail: "Brazalete", description: "Textura de malla y brillo uniforme para un estilo elegante y contemporáneo.", price: null, stock: "Disponible", image: "assets/products/pulseras/brazalete-malla-dorada-1.jpeg", alt: "Brazalete Malla Dorada", bg: "#f3e8e7" },
  { id: 27, name: "Pulsera Brisa Marina", category: "Pulseras", detail: "Pulsera", description: "Detalles coloridos que llevan frescura y alegría a tu muñeca.", price: null, stock: "Disponible", image: "assets/products/pulseras/pulsera-brisa-marina-1.jpeg", alt: "Pulsera Brisa Marina", bg: "#f4e4e5" },
  { id: 28, name: "Pulsera Brisa Marina Roja", category: "Pulseras", detail: "Pulsera", description: "Acentos rojos y detalles delicados para un look vibrante y femenino.", price: null, stock: "Disponible", image: "assets/products/pulseras/pulsera-brisa-marina-roja-1.jpeg", alt: "Pulsera Brisa Marina Roja", bg: "#ece9e4" },
  { id: 29, name: "Pulsera Corazón Estelar", category: "Pulseras", detail: "Pulsera", description: "Corazones y estrellas se unen en una pulsera luminosa y especial.", price: null, stock: "Disponible", image: "assets/products/pulseras/pulsera-corazon-estelar-1.jpeg", alt: "Pulsera Corazón Estelar", bg: "#f2ebe5" },
  { id: 30, name: "Pulsera Primavera Rosa", category: "Pulseras", detail: "Pulsera", description: "Flores rosadas que aportan un toque alegre, delicado y primaveral.", price: null, stock: "Disponible", image: "assets/products/pulseras/pulsera-primavera-rosa-1.jpeg", alt: "Pulsera Primavera Rosa", bg: "#f1e9e2" },

  { id: 31, name: "Joyero Glamour Pink", category: "Cofres", detail: "Joyero", description: "Un joyero amplio y delicado para organizar tus piezas con elegancia.", price: null, stock: "Disponible", image: "assets/products/cofres/joyero-glamour-pink-1.jpeg", alt: "Joyero Glamour Pink abierto con compartimentos", bg: "#f4e4e5" },
  { id: 32, name: "Mini Joyero Glamour Shocking Pink", category: "Cofres", detail: "Mini joyero", description: "Formato compacto y vibrante para llevar tus joyas favoritas a todas partes.", price: null, stock: "Disponible", image: "assets/products/cofres/mini-joyero-glamour-shocking-pink-1.jpeg", alt: "Mini Joyero Glamour Shocking Pink abierto", bg: "#f2ebe5" },
];

const galleryCounts = {
  1: 3, 2: 3, 3: 3, 4: 2, 5: 1, 6: 1, 7: 1, 8: 1,
  9: 3, 10: 3, 11: 2, 12: 3, 13: 3, 14: 3, 15: 3, 16: 3,
  17: 3, 18: 2, 19: 3, 20: 3, 21: 3, 22: 2, 23: 2, 24: 2,
  25: 2, 26: 3, 27: 3, 28: 3, 29: 3, 30: 2, 31: 1, 32: 1,
};

products.forEach((product) => {
  const imageBase = product.image.replace(/-\d+\.jpeg$/, "");
  const galleryImages = Array.from(
    { length: galleryCounts[product.id] || 1 },
    (_, index) => `${imageBase}-${index + 1}.jpeg`,
  );
  product.images = [product.image, ...galleryImages.filter((image) => image !== product.image)];
});

window.RYM_PRODUCTS = products;

function setupCollectionSlideshows() {
  const collectionSection = document.querySelector("#colecciones");
  const collectionCards = [...document.querySelectorAll(".collection-card[data-filter-link]")];
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (!collectionSection || !collectionCards.length || reduceMotion.matches) return;

  const slideshows = collectionCards.map((card, cardIndex) => {
    const art = card.querySelector(".collection-card__art");
    const initialImage = art?.querySelector("img");
    const category = card.dataset.filterLink;
    const imagePool = [...new Set(
      products
        .filter((product) => product.category === category)
        .flatMap((product) => product.images),
    )];

    if (!art || !initialImage || imagePool.length < 2) return null;

    initialImage.classList.add("collection-card__image", "is-active");

    const standbyImage = document.createElement("img");
    standbyImage.className = "collection-card__image";
    standbyImage.alt = "";
    standbyImage.width = 1200;
    standbyImage.height = 1500;
    standbyImage.loading = "lazy";
    standbyImage.decoding = "async";
    art.append(standbyImage);

    let activeImage = initialImage;
    let inactiveImage = standbyImage;
    let currentSource = initialImage.getAttribute("src");
    let timerId;
    let running = false;
    let loading = false;

    const schedule = (firstChange = false) => {
      if (!running) return;
      const baseDelay = firstChange ? 2200 + cardIndex * 420 : 5200;
      timerId = window.setTimeout(showNext, baseDelay + Math.random() * 1800);
    };

    const finishSwap = (nextSource) => {
      if (!running) {
        loading = false;
        return;
      }

      inactiveImage.classList.add("is-active");
      activeImage.classList.remove("is-active");
      [activeImage, inactiveImage] = [inactiveImage, activeImage];
      currentSource = nextSource;
      loading = false;
      schedule();
    };

    function showNext() {
      if (!running || loading) return;

      const candidates = imagePool.filter((source) => source !== currentSource);
      const nextSource = candidates[Math.floor(Math.random() * candidates.length)];
      let completed = false;
      loading = true;

      const completeOnce = () => {
        if (completed) return;
        completed = true;
        finishSwap(nextSource);
      };

      inactiveImage.onload = completeOnce;
      inactiveImage.onerror = () => {
        if (completed) return;
        completed = true;
        loading = false;
        schedule();
      };
      inactiveImage.src = nextSource;

      if (inactiveImage.complete && inactiveImage.naturalWidth) completeOnce();
    }

    return {
      start() {
        if (running) return;
        running = true;
        schedule(true);
      },
      stop() {
        running = false;
        window.clearTimeout(timerId);
      },
    };
  }).filter(Boolean);

  let sectionVisible = false;

  const updatePlayback = () => {
    const shouldPlay = sectionVisible && !document.hidden;
    slideshows.forEach((slideshow) => slideshow[shouldPlay ? "start" : "stop"]());
  };

  const visibilityObserver = new IntersectionObserver(([entry]) => {
    sectionVisible = entry.isIntersecting;
    updatePlayback();
  }, { threshold: 0.12 });

  visibilityObserver.observe(collectionSection);
  document.addEventListener("visibilitychange", updatePlayback);
}

setupCollectionSlideshows();

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

const hasPrice = (product) => Number.isFinite(product.price);
const formatPrice = (price) => Number.isFinite(price) ? `S/ ${price.toFixed(2)}` : "Consultar";

function whatsappUrl(product) {
  const priceText = hasPrice(product) ? ` por ${formatPrice(product.price)}` : "";
  const message = `Hola RyM, deseo adquirir ${product.name}, que vi en su catálogo${priceText}. Estado: ${product.stock}. ¿Podrían brindarme más información?`;
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
      <a class="product-card__media" href="producto.html?id=${product.id}" aria-label="Ver detalles de ${product.name}">
        <span class="product-card__badge${soldOut ? " product-card__badge--sold" : ""}">${product.stock}</span>
        <div class="product-card__image${product.image ? " product-card__image--photo" : ""}">${media}</div>
      </a>
      <div class="product-card__body">
        <div class="product-card__meta">
          <div>
            <h3 class="product-card__name"><a href="producto.html?id=${product.id}">${product.name}</a></h3>
            <p class="product-card__type">${product.detail}</p>
          </div>
          <p class="product-card__price">${formatPrice(product.price)}</p>
        </div>
        <p class="product-card__description">${product.description}</p>
        <div class="product-card__actions">
          <button class="product-card__action" type="button" data-product-id="${product.id}" ${soldOut ? "disabled" : ""}>
            <span>${soldOut ? "Temporalmente agotado" : "Consultar por WhatsApp"}</span>
            <span aria-hidden="true">${soldOut ? "—" : "↗"}</span>
          </button>
          <button class="product-card__bag" type="button" data-add-product-id="${product.id}" aria-label="Agregar ${product.name} a mi cartera" ${soldOut ? "disabled" : ""}>
            <svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><path d="M5 8.5h14l1 11H4l1-11Z"/><path d="M8.5 9V6.8a3.5 3.5 0 0 1 7 0V9"/></svg>
          </button>
        </div>
      </div>
    </article>`;
}

const grid = document.querySelector("#product-grid");
if (grid) {
grid.innerHTML = products.map(productCard).join("");

grid.addEventListener("click", (event) => {
  const addButton = event.target.closest("[data-add-product-id]");
  if (addButton && !addButton.disabled) {
    toggleBagProduct(Number(addButton.dataset.addProductId));
    return;
  }

  const button = event.target.closest("[data-product-id]");
  if (!button || button.disabled) return;
  const product = products.find((item) => item.id === Number(button.dataset.productId));
  if (product) window.open(whatsappUrl(product), "_blank", "noopener,noreferrer");
});

const bagOverlay = document.querySelector("[data-bag-overlay]");
const bagContent = document.querySelector("[data-bag-content]");
const bagFooter = document.querySelector("[data-bag-footer]");
const bagTotal = document.querySelector("[data-bag-total]");
const bagWhatsapp = document.querySelector("[data-bag-whatsapp]");
const bagOpenButtons = document.querySelectorAll("[data-bag-open]");
const bagCountElements = document.querySelectorAll("[data-bag-count]");
const BAG_STORAGE_KEY = "rym-selected-products-v2";

function loadBag() {
  try {
    const storedIds = JSON.parse(localStorage.getItem(BAG_STORAGE_KEY) || "[]");
    return new Set(storedIds.filter((id) => products.some((product) => product.id === id && product.stock !== "Agotado")));
  } catch {
    return new Set();
  }
}

const selectedProductIds = loadBag();

function saveBag() {
  try {
    localStorage.setItem(BAG_STORAGE_KEY, JSON.stringify([...selectedProductIds]));
  } catch {
    // La selección sigue funcionando durante la sesión si el navegador bloquea el almacenamiento.
  }
}

function bagWhatsappUrl(selectedProducts) {
  const lines = selectedProducts.map((product) => `• ${product.name} — ${formatPrice(product.price)} (${product.stock})`);
  const pricedProducts = selectedProducts.filter(hasPrice);
  const total = pricedProducts.reduce((sum, product) => sum + product.price, 0);
  const totalText = pricedProducts.length === selectedProducts.length ? `\n\nTotal referencial: ${formatPrice(total)}.` : "";
  const message = `Hola RyM, deseo consultar por estas piezas de mi cartera:\n\n${lines.join("\n")}${totalText}\n\n¿Podrían confirmarme precios, disponibilidad y entrega?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

function renderBag() {
  const selectedProducts = products.filter((product) => selectedProductIds.has(product.id));
  const count = selectedProducts.length;

  bagCountElements.forEach((element) => {
    element.textContent = String(count);
    element.setAttribute("aria-label", `${count} ${count === 1 ? "pieza seleccionada" : "piezas seleccionadas"}`);
  });

  document.querySelectorAll("[data-add-product-id]").forEach((button) => {
    const product = products.find((item) => item.id === Number(button.dataset.addProductId));
    const selected = selectedProductIds.has(Number(button.dataset.addProductId));
    button.classList.toggle("is-selected", selected);
    if (product) button.setAttribute("aria-label", `${selected ? "Quitar" : "Agregar"} ${product.name} ${selected ? "de" : "a"} mi cartera`);
  });

  if (!count) {
    bagContent.innerHTML = `
      <div class="bag-empty">
        <div>
          <svg viewBox="0 0 64 64" fill="none" aria-hidden="true"><path d="M14 22h36l3 31H11l3-31Z"/><path d="M23 23v-6a9 9 0 0 1 18 0v6"/></svg>
          <h3>Tu cartera está vacía</h3>
          <p>Guarda tus piezas favoritas y consúltalas juntas directamente por WhatsApp.</p>
          <a href="#catalogo" data-bag-close>Descubrir el catálogo</a>
        </div>
      </div>`;
    bagFooter.hidden = true;
    return;
  }

  bagContent.innerHTML = selectedProducts.map((product) => `
    <article class="bag-item">
      <img src="${product.image}" alt="${product.alt || product.name}" width="82" height="103" decoding="async">
      <div><h3>${product.name}</h3><p>${product.stock}</p><strong>${formatPrice(product.price)}</strong></div>
      <button class="bag-item__remove" type="button" data-remove-product-id="${product.id}" aria-label="Quitar ${product.name} de mi cartera">×</button>
    </article>`).join("");

  const pricedProducts = selectedProducts.filter(hasPrice);
  const total = pricedProducts.reduce((sum, product) => sum + product.price, 0);
  bagTotal.textContent = pricedProducts.length === selectedProducts.length ? formatPrice(total) : "Por confirmar";
  bagWhatsapp.href = bagWhatsappUrl(selectedProducts);
  bagFooter.hidden = false;
}

function toggleBagProduct(productId) {
  if (selectedProductIds.has(productId)) selectedProductIds.delete(productId);
  else selectedProductIds.add(productId);
  saveBag();
  renderBag();
}

function openBag() {
  bagOverlay.hidden = false;
  document.body.classList.add("bag-open");
  bagOpenButtons.forEach((button) => button.setAttribute("aria-expanded", "true"));
  document.querySelector("[data-bag-close]")?.focus();
}

function closeBag() {
  bagOverlay.hidden = true;
  document.body.classList.remove("bag-open");
  bagOpenButtons.forEach((button) => button.setAttribute("aria-expanded", "false"));
}

bagOpenButtons.forEach((button) => button.addEventListener("click", openBag));
bagOverlay.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-product-id]");
  if (removeButton) {
    selectedProductIds.delete(Number(removeButton.dataset.removeProductId));
    saveBag();
    renderBag();
    return;
  }
  if (event.target === bagOverlay || event.target.closest("[data-bag-close]")) closeBag();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !bagOverlay.hidden) closeBag();
});
renderBag();

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
}
