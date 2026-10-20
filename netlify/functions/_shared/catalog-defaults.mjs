export const catalogDefaults = [
  [1, "Anillo Doble Hélice", "Anillos", 40],
  [2, "Anillo Flowersel", "Anillos", 40],
  [3, "Anillo Pirámide de Luz", "Anillos", 40],
  [4, "Argollas Clásicas Gold", "Aretes", 25],
  [5, "Argollas Destello Real", "Aretes", 20],
  [6, "Cherry Love", "Aretes", 20],
  [7, "Corazón Zircon", "Aretes", 20],
  [8, "Mariposa Cristal", "Aretes", 25],
  [9, "Cadena Cordón Imperial", "Collares", 30],
  [10, "Cadena Grumet Fina", "Collares", 25],
  [11, "Cadena Minimal Gold", "Collares", 25],
  [12, "Collar Brújula del Destino", "Collares", 40],
  [13, "Collar Constelación", "Collares", 30],
  [14, "Collar Estrella Brillante", "Collares", 50],
  [15, "Collar Primeros Pasos", "Collares", 35],
  [16, "Rosario Bendición Celestial", "Collares", 50],
  [17, "Colibrí de Luz", "Dijes", 25],
  [18, "Dije René", "Dijes", 15],
  [19, "Dije San Benito", "Dijes", 25],
  [20, "Dije Sueño de Hada", "Dijes", 25],
  [21, "Virgen de Guadalupe", "Dijes", 25],
  [22, "Dúo Cherry Brillante", "Dijes + Aretes", 50],
  [23, "Dúo Conejito Pastel", "Dijes + Aretes", 50],
  [24, "Dúo Estrella Zircon", "Dijes + Aretes", 50],
  [25, "Brazalete Dorada Seducción", "Pulseras", 45],
  [26, "Brazalete Malla Dorada", "Pulseras", 45],
  [27, "Pulsera Brisa Marina", "Pulseras", 30],
  [28, "Pulsera Brisa Marina Roja", "Pulseras", 30],
  [29, "Pulsera Corazón Estelar", "Pulseras", 40],
  [30, "Pulsera Primavera Rosa", "Pulseras", 30],
  [31, "Joyero Glamour Pink", "Cofres", 20],
  [32, "Mini Joyero Glamour Shocking Pink", "Cofres", 10]
].map(([id, name, category, price]) => ({
  id,
  name,
  category,
  price,
  quantity: 1,
  stock: "Última pieza",
  visible: true
}));

export function deriveStock(quantity) {
  if (quantity <= 0) return "Agotado";
  if (quantity === 1) return "Última pieza";
  return "Disponible";
}

export function normalizeInventory(candidate = []) {
  const byId = new Map(candidate.map((item) => [Number(item.id), item]));
  return catalogDefaults.map((fallback) => {
    const item = byId.get(fallback.id) || {};
    const price = Number(item.price);
    const quantity = Number(item.quantity);
    const safeQuantity = Number.isInteger(quantity) && quantity >= 0 ? quantity : fallback.quantity;
    return {
      ...fallback,
      price: Number.isFinite(price) && price >= 0 ? Math.round(price * 100) / 100 : fallback.price,
      quantity: safeQuantity,
      stock: deriveStock(safeQuantity),
      visible: item.visible !== false
    };
  });
}
