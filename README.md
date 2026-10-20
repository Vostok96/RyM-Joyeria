# RyM — Calidad en cada detalle

Sitio web responsive para el catálogo de accesorios RyM, diseñado con una dirección visual editorial, carga ligera y consulta directa por WhatsApp.

Dominio oficial: [joyeria.rymgroup.org](https://joyeria.rymgroup.org/)

El catálogo contiene 32 productos reales organizados en Anillos, Aretes, Cofres, Collares, Dijes, Dijes + Aretes y Pulseras. Sus fotografías están en `assets/products/`, separadas por categoría.

## Ejecutar localmente

Instala las dependencias y levanta Netlify Dev para incluir las funciones de catálogo, analítica y administración:

```powershell
pnpm install
pnpm dlx netlify-cli dev
```

Luego visita la dirección local indicada por Netlify Dev.

## Desplegar en Netlify

El repositorio está listo para importarse directamente en Netlify:

- Build command: dejar vacío.
- Publish directory: `.`
- Branch de producción: `main`.

`netlify.toml` ya incluye la configuración de publicación, funciones, rutas de API, cabeceras de seguridad y caché de imágenes.

Los archivos CSS y JavaScript usan revalidación inmediata para que los cambios publicados no queden retenidos en dispositivos que visitaron una versión anterior. Las referencias desde los archivos HTML incluyen además un parámetro de versión para invalidar la caché heredada. Las fotografías de productos se revalidan después de una hora; los recursos de marca que no cambian conservan una caché prolongada.

## Panel de administración

El cliente puede administrar el catálogo desde `/admin/`. El panel permite:

- Cambiar precios y cantidades.
- Ocultar o volver a mostrar productos.
- Consultar vistas, sesiones, productos más vistos, clics a WhatsApp, descargas del PDF y dispositivos durante los últimos 30 días.

La disponibilidad se calcula automáticamente: cantidad `0` muestra “Agotado”, cantidad `1` muestra “Última pieza” y cantidades mayores muestran “Disponible”. Los cambios se guardan en Netlify Blobs y se reflejan tanto en la web como en el PDF descargable.

La contraseña no se guarda en texto visible: la función compara su hash SHA-256. Para rotarla, define la variable de entorno `ADMIN_PASSWORD_HASH` en Netlify o reemplázala en `netlify/functions/admin.mjs` por el SHA-256 de la nueva contraseña. No incluyas la contraseña original en el repositorio.

La analítica es propia y anónima. No guarda nombres, correos ni direcciones IP; acumula métricas de los últimos 30 días mediante agregaciones automáticas que evitan demoras en el panel.

### Soporte dual con Google Analytics 4 (GA4)

El sitio cuenta con integración directa para GA4 con Modo de Consentimiento (Consent Mode):
- Agrega tu ID de medición en la etiqueta `<meta name="rym-ga-id" content="G-XXXXXXXXXX" />` de las páginas HTML, o define `window.RYM_GA_ID = "G-XXXXXXXXXX"`.
- `analytics.js` cargará automáticamente la etiqueta de Google con consentimiento por defecto y transmitirá los eventos de comercio electrónico: `view_item`, `select_item`, `add_to_cart`, `remove_from_cart`, `whatsapp_click`, `file_download` y `view_item_list`.
- Si no se configura un ID de GA4, la analítica propia interna sigue registrando todas las visitas en `/admin/` sin requerir cookies de terceros.

### Punto de restauración y reversión

Antes de aplicar actualizaciones se conserva una rama y etiqueta de respaldo en Git:
- Rama de respaldo: `backup-pre-mejoras`
- Etiqueta: `punto-restauracion-20261019-211514`
- Para revertir cualquier cambio en caso necesario:
  ```powershell
  git checkout backup-pre-mejoras
  # O volver de forma definitiva:
  git reset --hard backup-pre-mejoras
  ```

## Actualizar el catálogo

Los datos base de los productos están centralizados en el arreglo `products` de `script.js`. Precios, cantidades y visibilidad se administran desde `/admin/`; si la API no está disponible, la web conserva estos valores base como respaldo. Cada producto contiene:

- `name`: nombre visible.
- `category`: `Anillos`, `Aretes`, `Cofres`, `Collares`, `Dijes`, `Dijes + Aretes` o `Pulseras`.
- `detail`: material o descripción breve.
- `description`: frase comercial breve utilizada en la tarjeta del catálogo.
- `longDescription`: contenido ampliado que se muestra únicamente en la ficha del producto.
- `price`: número en soles. Este mismo valor se muestra en la web y se utiliza al generar el catálogo PDF descargable.
- `stock`: texto visible de disponibilidad.
- `image`: ruta a la fotografía principal del producto.
- `bg`: fondo de la tarjeta.

Cada producto debe incluir también un texto `alt` breve y descriptivo para accesibilidad.

Las fotografías adicionales se detectan mediante la numeración de archivos (`-1.jpeg`, `-2.jpeg`, etc.) y la configuración `galleryCounts` de `script.js`. Al seleccionar una tarjeta, `producto.html` abre la ficha individual y muestra esas imágenes como galería con miniaturas, navegación por teclado y gesto de deslizamiento. Cuando una pieza solo tiene una fotografía, los controles del carrusel se ocultan automáticamente.

Las portadas de la sección de colecciones alternan fotografías reales de su misma categoría mediante un fundido suave y aleatorio. La rotación se pausa cuando la sección sale de la pantalla o la pestaña queda en segundo plano, y se desactiva cuando el dispositivo solicita movimiento reducido.

El número de WhatsApp se configura una sola vez en `WHATSAPP_NUMBER`.

Los enlaces oficiales de Instagram y TikTok se configuran directamente en el footer de `index.html`.

La imagen social general se encuentra en `assets/images/rym-social-share.jpg` y sus etiquetas públicas utilizan la URL absoluta del dominio oficial para lograr compatibilidad con WhatsApp y otros rastreadores.

El botón “Descargar catálogo PDF” construye el documento directamente en el navegador a partir de `window.RYM_PRODUCTS`. Por eso, cualquier cambio de nombre, descripción, fotografía o precio realizado en `script.js` se refleja también en la siguiente descarga sin mantener un segundo catálogo manual.

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
├── analytics.js       # medición anónima de navegación y conversiones
├── admin/             # panel privado de inventario y estadísticas
├── netlify/functions/ # API de catálogo, inventario y analítica
├── netlify.toml       # configuración de despliegue y caché
├── package.json       # dependencia de almacenamiento Netlify Blobs
├── assets/            # fotografías reales de los productos
└── README.md          # guía rápida de mantenimiento
```
