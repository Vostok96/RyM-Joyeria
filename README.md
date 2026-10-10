# RyM — Calidad en cada detalle

Sitio web responsive para el catálogo de accesorios RyM, diseñado con una dirección visual editorial, carga ligera y checkout directo por WhatsApp.

Las fotografías actuales son imágenes editoriales temporales generadas específicamente para la maqueta. No representan el inventario real del cliente y deben reemplazarse por las fotos finales antes del lanzamiento comercial.

## Ejecutar localmente

No requiere instalación ni proceso de compilación. Puedes abrir `index.html` directamente o levantar un servidor estático:

```powershell
python -m http.server 4173
```

Luego visita `http://localhost:4173`.

## Desplegar en Netlify

El repositorio está listo para importarse directamente en Netlify:

- Build command: dejar vacío.
- Publish directory: `.`
- Branch de producción: `main`.

`netlify.toml` ya incluye la configuración de publicación, cabeceras de seguridad y caché de imágenes.

## Actualizar el catálogo

Los productos están centralizados en el arreglo `products` de `script.js`. Cada producto contiene:

- `name`: nombre visible.
- `category`: `Anillos`, `Collares`, `Dijes`, `Pulseras` o `Aretes`.
- `detail`: material o descripción breve.
- `price`: número en soles; el sitio lo formatea automáticamente como `S/ 00.00`.
- `stock`: `Última pieza`, `Pocas unidades`, `Bajo pedido` o `Agotado`.
- `art`: ilustración temporal asociada.
- `bg`: fondo de la tarjeta.

Cuando tengas una foto real, agrega `image: "assets/productos/anillo-aurelia.webp"` y, opcionalmente, `imageAvif: "assets/productos/anillo-aurelia.avif"` y `alt: "Anillo Aurelia dorado con cristal"`. La foto reemplazará automáticamente la ilustración temporal.

El número de WhatsApp se configura una sola vez en `WHATSAPP_NUMBER`.

## Sustituir ilustraciones por fotografías

Para producción, exporta cada foto en AVIF y WebP, idealmente a 1200 × 1500 px, sin personas y con fondo limpio. Usa `loading="lazy"`, `decoding="async"`, `width` y `height` para evitar saltos de diseño. Conserva la proporción 4:5 de `.product-card__media`.

Antes del lanzamiento, sustituye también el enlace genérico de Instagram en `index.html` por el perfil oficial de la marca.

Para un modelo 3D, carga `<model-viewer>` solo al abrir el detalle del producto y sirve archivos GLB comprimidos con Draco/KTX2. Así el catálogo inicial no descarga geometría innecesaria.

## Estructura

```text
RyM-Joyeria/
├── index.html   # estructura semántica y contenido
├── styles.css   # sistema visual, responsive y animaciones
├── script.js    # catálogo, filtros, menú y WhatsApp dinámico
├── netlify.toml # configuración de despliegue y caché
├── assets/      # fotografías optimizadas AVIF/WebP
└── README.md    # guía rápida de mantenimiento
```
