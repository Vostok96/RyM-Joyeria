const PRODUCT_WHATSAPP_NUMBER = "51917578751";
const productId = Number(new URLSearchParams(window.location.search).get("id"));
const product = (window.RYM_PRODUCTS || []).find((item) => item.id === productId);

const detailSection = document.querySelector("[data-product-detail]");
const notFoundSection = document.querySelector("[data-product-not-found]");
const yearElement = document.querySelector("[data-product-year]");

if (yearElement) yearElement.textContent = new Date().getFullYear();

if (!product) {
  notFoundSection.hidden = false;
  document.title = "Producto no encontrado | RyM";
} else {
  const images = product.images?.length ? product.images : [product.image];
  let currentImage = 0;
  let pointerStartX = null;

  const mainImage = document.querySelector("[data-gallery-main]");
  const galleryStage = document.querySelector("[data-gallery-stage]");
  const thumbnails = document.querySelector("[data-gallery-thumbs]");
  const previousButton = document.querySelector("[data-gallery-prev]");
  const nextButton = document.querySelector("[data-gallery-next]");
  const counter = document.querySelector("[data-gallery-counter]");

  document.querySelector("[data-breadcrumb-product]").textContent = product.name;
  document.querySelector("[data-product-category]").textContent = product.category;
  document.querySelector("[data-product-name]").textContent = product.name;
  const description = document.querySelector("[data-product-description]");
  description.replaceChildren(...product.longDescription.map((copy, index) => {
    const paragraph = document.createElement("p");
    paragraph.textContent = copy;
    if (index === 0) paragraph.classList.add("product-detail__lead");
    return paragraph;
  }));
  document.querySelector("[data-product-type]").textContent = product.detail;
  document.querySelector("[data-product-stock]").textContent = product.stock;

  const whatsappMessage = `Hola RyM, deseo recibir más información sobre ${product.name}. Estado: ${product.stock}. ¿Podrían confirmarme sus detalles y entrega?`;
  document.querySelector("[data-product-whatsapp]").href = `https://wa.me/${PRODUCT_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  document.title = `${product.name} | RyM`;
  document.querySelector('meta[name="description"]').content = product.description;
  document.querySelector('meta[property="og:title"]').content = `${product.name} | RyM`;
  document.querySelector('meta[property="og:description"]').content = product.description;
  const canonicalUrl = `https://rymgroup.org/producto.html?id=${product.id}`;
  const socialImage = new URL(images[0], "https://rymgroup.org/").href;
  document.querySelector('link[rel="canonical"]').href = canonicalUrl;
  document.querySelector('meta[property="og:url"]').content = canonicalUrl;
  document.querySelector('meta[property="og:image"]').content = socialImage;
  document.querySelector('meta[name="twitter:title"]').content = `${product.name} | RyM`;
  document.querySelector('meta[name="twitter:description"]').content = product.description;
  document.querySelector('meta[name="twitter:image"]').content = socialImage;
  document.getElementById("product-schema").textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.map((image) => new URL(image, "https://rymgroup.org/").href),
    sku: `RYM-${String(product.id).padStart(3, "0")}`,
    category: product.category,
    brand: { "@type": "Brand", name: "RyM" },
    url: canonicalUrl
  });

  thumbnails.innerHTML = images.map((image, index) => `
    <button class="product-gallery__thumb" type="button" data-gallery-index="${index}" aria-label="Ver imagen ${index + 1} de ${images.length}">
      <img src="${image}" alt="" width="160" height="160" loading="lazy" decoding="async">
    </button>
  `).join("");

  const thumbnailButtons = [...thumbnails.querySelectorAll("[data-gallery-index]")];

  function showImage(index) {
    currentImage = (index + images.length) % images.length;
    mainImage.src = images[currentImage];
    mainImage.alt = `${product.alt || product.name}, vista ${currentImage + 1} de ${images.length}`;
    counter.textContent = `${currentImage + 1} / ${images.length}`;
    galleryStage.setAttribute("aria-label", `${product.name}, imagen ${currentImage + 1} de ${images.length}. Usa las flechas para navegar.`);
    thumbnailButtons.forEach((button, buttonIndex) => {
      button.setAttribute("aria-current", String(buttonIndex === currentImage));
    });
  }

  if (images.length === 1) {
    previousButton.hidden = true;
    nextButton.hidden = true;
    counter.hidden = true;
    thumbnails.hidden = true;
    galleryStage.removeAttribute("tabindex");
    galleryStage.setAttribute("aria-label", product.name);
  } else {
    previousButton.addEventListener("click", () => showImage(currentImage - 1));
    nextButton.addEventListener("click", () => showImage(currentImage + 1));

    thumbnails.addEventListener("click", (event) => {
      const button = event.target.closest("[data-gallery-index]");
      if (button) showImage(Number(button.dataset.galleryIndex));
    });

    galleryStage.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        showImage(currentImage - 1);
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        showImage(currentImage + 1);
      }
    });

    galleryStage.addEventListener("pointerdown", (event) => {
      pointerStartX = event.clientX;
    });

    galleryStage.addEventListener("pointerup", (event) => {
      if (pointerStartX === null) return;
      const distance = event.clientX - pointerStartX;
      pointerStartX = null;
      if (Math.abs(distance) < 45) return;
      showImage(currentImage + (distance < 0 ? 1 : -1));
    });

    galleryStage.addEventListener("pointercancel", () => {
      pointerStartX = null;
    });
  }

  showImage(0);
  detailSection.hidden = false;
}

const productHeader = document.querySelector("[data-product-header]");
const updateHeader = () => productHeader?.classList.toggle("is-scrolled", window.scrollY > 16);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
