# RyM — Calidad en cada detalle

Sitio web responsive para el catálogo de accesorios RyM, diseñado con una dirección visual editorial, carga ligera y consulta directa por WhatsApp.

El catálogo contiene 32 productos reales organizados en Anillos, Aretes, Cofres, Collares, Dijes, Dijes + Aretes y Pulseras. Sus fotografías están en `assets/products/`, separadas por categoría.

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
- `category`: `Anillos`, `Aretes`, `Cofres`, `Collares`, `Dijes`, `Dijes + Aretes` o `Pulseras`.
- `detail`: material o descripción breve.
- `description`: frase comercial breve y específica de la pieza.
- `price`: número en soles; usa `null` mientras el precio esté pendiente y el sitio mostrará `Consultar`.
- `stock`: texto visible de disponibilidad.
- `image`: ruta a la fotografía principal del producto.
- `bg`: fondo de la tarjeta.

Cada producto debe incluir también un texto `alt` breve y descriptivo para accesibilidad.

Las fotografías adicionales se detectan mediante la numeración de archivos (`-1.jpeg`, `-2.jpeg`, etc.) y la configuración `galleryCounts` de `script.js`. Al seleccionar una tarjeta, `producto.html` abre la ficha individual y muestra esas imágenes como galería con miniaturas, navegación por teclado y gesto de deslizamiento. Cuando una pieza solo tiene una fotografía, los controles del carrusel se ocultan automáticamente.

El número de WhatsApp se configura una sola vez en `WHATSAPP_NUMBER`.

Antes del lanzamiento, sustituye también el enlace genérico de Instagram en `index.html` por el perfil oficial de la marca.

Para un modelo 3D, carga `<model-viewer>` solo al abrir el detalle del producto y sirve archivos GLB comprimidos con Draco/KTX2. Así el catálogo inicial no descarga geometría innecesaria.

## Estructura

```text
RyM-Joyeria/
├── index.html         # catálogo y colecciones
├── producto.html      # ficha individual de cada joya
├── styles.css         # sistema visual general y responsive
├── product.css        # presentación responsive de la ficha
├── script.js          # productos, galerías, filtros y WhatsApp
├── product-detail.js  # carrusel y contenido de cada ficha
├── netlify.toml       # configuración de despliegue y caché
├── assets/            # fotografías reales de los productos
└── README.md          # guía rápida de mantenimiento
```
