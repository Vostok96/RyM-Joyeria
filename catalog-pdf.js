const catalogDownloadButton = document.querySelector("[data-catalog-download]");
const catalogDownloadStatus = document.querySelector("[data-catalog-download-status]");

const PDF_COLORS = {
  ivory: [251, 250, 248],
  blush: [246, 234, 236],
  rose: [183, 82, 109],
  burgundy: [104, 70, 78],
  ink: [47, 43, 43],
  muted: [111, 102, 103],
  line: [229, 210, 214],
  gold: [190, 133, 40],
  white: [255, 255, 255],
};

function setCatalogStatus(message) {
  if (catalogDownloadStatus) catalogDownloadStatus.textContent = message;
}

function loadScript(source) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = source;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
}

async function ensureJsPdf() {
  if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;

  const sources = [
    "https://cdn.jsdelivr.net/npm/jspdf@2.5.2/dist/jspdf.umd.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.2/jspdf.umd.min.js",
  ];

  for (const source of sources) {
    try {
      await loadScript(source);
      if (window.jspdf?.jsPDF) return window.jspdf.jsPDF;
    } catch {
      // Intenta la siguiente fuente si una red bloquea el primer CDN.
    }
  }

  throw new Error("No fue posible cargar el generador PDF.");
}

async function imageToJpeg(source, targetWidth = 900, targetHeight = 620) {
  const response = await fetch(new URL(source, window.location.href));
  if (!response.ok) throw new Error(`No se pudo cargar ${source}`);

  const blob = await response.blob();
  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = await new Promise((resolve, reject) => {
      const element = new Image();
      element.onload = () => resolve(element);
      element.onerror = reject;
      element.src = objectUrl;
    });

    const canvas = document.createElement("canvas");
    canvas.width = targetWidth;
    canvas.height = targetHeight;
    const context = canvas.getContext("2d", { alpha: false });
    const sourceRatio = image.naturalWidth / image.naturalHeight;
    const targetRatio = targetWidth / targetHeight;
    let sourceX = 0;
    let sourceY = 0;
    let sourceWidth = image.naturalWidth;
    let sourceHeight = image.naturalHeight;

    if (sourceRatio > targetRatio) {
      sourceWidth = image.naturalHeight * targetRatio;
      sourceX = (image.naturalWidth - sourceWidth) / 2;
    } else {
      sourceHeight = image.naturalWidth / targetRatio;
      sourceY = (image.naturalHeight - sourceHeight) / 2;
    }

    context.fillStyle = "#fbfaf8";
    context.fillRect(0, 0, targetWidth, targetHeight);
    context.drawImage(
      image,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      0,
      0,
      targetWidth,
      targetHeight,
    );

    return canvas.toDataURL("image/jpeg", 0.78);
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

function setTextColor(document, color) {
  document.setTextColor(...color);
}

function drawCover(document, heroImage, productCount) {
  document.setFillColor(...PDF_COLORS.ivory);
  document.rect(0, 0, 210, 297, "F");
  document.addImage(heroImage, "JPEG", 0, 0, 210, 151);

  document.setFillColor(...PDF_COLORS.blush);
  document.roundedRect(17, 119, 176, 143, 5, 5, "F");

  document.setDrawColor(...PDF_COLORS.gold);
  document.setLineWidth(0.5);
  document.line(28, 143, 48, 143);
  document.line(63, 143, 83, 143);
  document.setFillColor(...PDF_COLORS.gold);
  document.rect(54.4, 139.4, 5.2, 5.2, "F");

  document.setFont("times", "normal");
  document.setFontSize(30);
  setTextColor(document, PDF_COLORS.ink);
  document.text("RyM", 55.5, 138, { align: "center" });

  document.setFontSize(36);
  document.text("Catálogo", 28, 177);
  document.setFont("times", "italic");
  document.setFontSize(41);
  setTextColor(document, PDF_COLORS.rose);
  document.text("de favoritos", 28, 196);

  document.setFont("helvetica", "normal");
  document.setFontSize(10);
  setTextColor(document, PDF_COLORS.muted);
  document.text("PIEZAS SELECCIONADAS - PRECIOS ACTUALIZADOS", 28, 215);

  document.setFontSize(9.5);
  const intro = document.splitTextToSize(
    `${productCount} piezas para regalar, celebrar y acompañar tus momentos especiales.`,
    122,
  );
  document.text(intro, 28, 226, { lineHeightFactor: 1.55 });

  document.setFont("helvetica", "bold");
  document.setFontSize(8.5);
  setTextColor(document, PDF_COLORS.burgundy);
  document.text("JOYERIA.RYMGROUP.ORG", 28, 250);

  document.setFont("helvetica", "normal");
  document.setFontSize(7.5);
  setTextColor(document, PDF_COLORS.muted);
  document.text("RyM - Calidad en cada detalle", 105, 284, { align: "center" });
}

function drawPageHeader(document, firstId, lastId) {
  document.setFont("helvetica", "bold");
  document.setFontSize(7.5);
  setTextColor(document, PDF_COLORS.burgundy);
  document.text("RYM - CALIDAD EN CADA DETALLE", 14, 12);

  document.setFont("helvetica", "normal");
  setTextColor(document, PDF_COLORS.muted);
  document.text(`PRODUCTOS ${firstId} - ${lastId}`, 196, 12, { align: "right" });
  document.setDrawColor(...PDF_COLORS.line);
  document.line(14, 17, 196, 17);

  document.setFont("times", "normal");
  document.setFontSize(25);
  setTextColor(document, PDF_COLORS.ink);
  document.text("Piezas seleccionadas", 14, 32);
}

function drawProductCard(document, product, image, x, y) {
  const width = 87.5;
  const height = 112;

  document.setFillColor(...PDF_COLORS.white);
  document.setDrawColor(...PDF_COLORS.line);
  document.setLineWidth(0.35);
  document.roundedRect(x, y, width, height, 4, 4, "FD");
  document.addImage(image, "JPEG", x + 3, y + 3, width - 6, 54);

  document.setFillColor(...PDF_COLORS.ivory);
  document.roundedRect(x + 6, y + 6, 11, 7, 3.5, 3.5, "F");
  document.setFont("helvetica", "bold");
  document.setFontSize(6.7);
  setTextColor(document, PDF_COLORS.burgundy);
  document.text(String(product.id).padStart(2, "0"), x + 11.5, y + 10.8, { align: "center" });

  document.setFont("helvetica", "bold");
  document.setFontSize(6.3);
  setTextColor(document, PDF_COLORS.burgundy);
  document.text(product.category.toUpperCase(), x + 6, y + 64);

  document.setFont("times", "normal");
  document.setFontSize(14.5);
  setTextColor(document, PDF_COLORS.ink);
  const nameLines = document.splitTextToSize(product.name, width - 12).slice(0, 2);
  document.text(nameLines, x + 6, y + 73, { lineHeightFactor: 1.02 });

  const descriptionY = y + (nameLines.length > 1 ? 89 : 84);
  document.setFont("helvetica", "normal");
  document.setFontSize(6.5);
  setTextColor(document, PDF_COLORS.muted);
  const description = document.splitTextToSize(product.description, width - 12).slice(0, 2);
  document.text(description, x + 6, descriptionY, { lineHeightFactor: 1.35 });

  document.setDrawColor(...PDF_COLORS.line);
  document.line(x + 6, y + 101, x + width - 6, y + 101);
  document.setFont("helvetica", "normal");
  document.setFontSize(6.2);
  setTextColor(document, PDF_COLORS.muted);
  document.text("PRECIO", x + 6, y + 107.5);

  document.setFont("times", "bold");
  document.setFontSize(13.5);
  setTextColor(document, PDF_COLORS.burgundy);
  const price = Number.isFinite(product.price) ? `S/ ${product.price.toFixed(2)}` : "Consultar";
  document.text(price, x + width - 6, y + 108, { align: "right" });
}

function drawPageFooter(document, pageNumber) {
  document.setDrawColor(...PDF_COLORS.line);
  document.line(14, 287, 196, 287);
  document.setFont("helvetica", "normal");
  document.setFontSize(6.5);
  setTextColor(document, PDF_COLORS.muted);
  document.text("joyeria.rymgroup.org", 14, 292);
  document.text(String(pageNumber).padStart(2, "0"), 196, 292, { align: "right" });
}

function drawClosingPage(document) {
  document.setFillColor(...PDF_COLORS.blush);
  document.rect(0, 0, 210, 297, "F");
  document.setFillColor(...PDF_COLORS.white);
  document.roundedRect(16, 22, 178, 250, 6, 6, "F");

  document.setFont("times", "normal");
  document.setFontSize(31);
  setTextColor(document, PDF_COLORS.ink);
  document.text("Tu próximo", 28, 62);
  document.setFont("times", "italic");
  document.setFontSize(40);
  setTextColor(document, PDF_COLORS.rose);
  document.text("favorito", 28, 80);

  document.setFont("helvetica", "normal");
  document.setFontSize(9.5);
  setTextColor(document, PDF_COLORS.muted);
  const message = document.splitTextToSize(
    "Te asesoramos personalmente sobre disponibilidad, pago y entrega en todo el Perú.",
    135,
  );
  document.text(message, 28, 98, { lineHeightFactor: 1.55 });

  const actions = [
    { y: 132, label: "VER CATÁLOGO WEB", value: "joyeria.rymgroup.org", url: "https://joyeria.rymgroup.org/" },
    { y: 176, label: "ESCRIBIR POR WHATSAPP", value: "+51 917 578 751", url: "https://wa.me/51917578751" },
  ];

  actions.forEach((action) => {
    document.setFillColor(...PDF_COLORS.ivory);
    document.setDrawColor(...PDF_COLORS.line);
    document.roundedRect(28, action.y, 154, 32, 3, 3, "FD");
    document.setFont("helvetica", "bold");
    document.setFontSize(8);
    setTextColor(document, PDF_COLORS.burgundy);
    document.text(action.label, 38, action.y + 12);
    document.setFont("helvetica", "normal");
    document.setFontSize(8.5);
    setTextColor(document, PDF_COLORS.muted);
    document.text(action.value, 38, action.y + 22);
    document.setFontSize(13);
    setTextColor(document, PDF_COLORS.rose);
    document.text("->", 171, action.y + 19, { align: "right" });
    document.link(28, action.y, 154, 32, { url: action.url });
  });

  document.setFont("helvetica", "normal");
  document.setFontSize(7);
  setTextColor(document, PDF_COLORS.muted);
  document.text("Precios sujetos a disponibilidad. Confirma tu pedido con RyM.", 105, 239, { align: "center" });
  document.setFont("helvetica", "bold");
  document.text("RYM - CALIDAD EN CADA DETALLE", 105, 253, { align: "center" });
}

async function generateCatalogPdf() {
  await (window.RYM_CATALOG_READY || Promise.resolve());
  const products = (window.RYM_PRODUCTS || []).filter((product) => product.visible !== false);
  if (!products.length) throw new Error("El catálogo todavía no está disponible.");

  setCatalogStatus("Preparando el generador...");
  const JsPdf = await ensureJsPdf();
  const document = new JsPdf({ orientation: "portrait", unit: "mm", format: "a4", compress: true });
  document.setProperties({
    title: "Catálogo RyM - Precios actualizados",
    subject: "Catálogo de productos RyM generado desde joyeria.rymgroup.org",
    author: "RyM",
    creator: "joyeria.rymgroup.org",
  });

  setCatalogStatus("Preparando portada...");
  const heroImage = await imageToJpeg("assets/images/hero-blossom.webp", 1200, 860);
  drawCover(document, heroImage, products.length);

  let loadedProducts = 0;
  let pageNumber = 2;

  for (let offset = 0; offset < products.length; offset += 4) {
    const pageProducts = products.slice(offset, offset + 4);
    const pageImages = await Promise.all(pageProducts.map(async (product) => {
      const image = await imageToJpeg(product.image);
      loadedProducts += 1;
      setCatalogStatus(`Preparando productos ${loadedProducts} de ${products.length}...`);
      return image;
    }));

    document.addPage();
    document.setFillColor(...PDF_COLORS.ivory);
    document.rect(0, 0, 210, 297, "F");
    drawPageHeader(document, pageProducts[0].id, pageProducts.at(-1).id);

    const positions = [
      [14, 40],
      [108.5, 40],
      [14, 161],
      [108.5, 161],
    ];

    pageProducts.forEach((product, index) => {
      drawProductCard(document, product, pageImages[index], positions[index][0], positions[index][1]);
    });
    drawPageFooter(document, pageNumber);
    pageNumber += 1;
  }

  document.addPage();
  drawClosingPage(document);
  setCatalogStatus("Descargando catálogo...");
  document.save("catalogo-rym-joyeria-precios.pdf");
}

if (catalogDownloadButton) {
  catalogDownloadButton.addEventListener("click", async () => {
    catalogDownloadButton.disabled = true;
    catalogDownloadButton.setAttribute("aria-busy", "true");

    try {
      await generateCatalogPdf();
      setCatalogStatus("Catálogo descargado correctamente.");
    } catch (error) {
      console.error(error);
      setCatalogStatus("No se pudo generar el PDF. Revisa tu conexión e inténtalo nuevamente.");
    } finally {
      catalogDownloadButton.disabled = false;
      catalogDownloadButton.removeAttribute("aria-busy");
    }
  });
}
