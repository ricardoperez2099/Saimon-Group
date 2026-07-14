# SAiMON VISION — Home (handoff a Cursor)

Exportación estática (HTML + CSS + JS vanilla, sin frameworks ni build step) del diseño de la página de inicio. Pensada como punto de partida para maquetar la versión funcional en Cursor.

## Archivos
- `index.html` — toda la estructura y contenido de la página, en una sola pieza continua (sin router).
- `style.css` — todos los estilos, organizados por sección con comentarios (`/* ===== SECCIÓN ===== */`). Usa clases en lugar de estilos inline.
- `app.js` — toda la lógica/interactividad (ver detalle abajo).
- `assets/` — logos e imágenes reales ya integradas (fotografías de robótica, C4/C5, seguridad, etc). Los bloques que aún no tienen foto/video real muestran un placeholder rayado con el texto "Sustituir por…" indicando qué debe ir ahí.

## Dependencias externas
- **Lucide Icons** (`https://unpkg.com/lucide@latest`, vía CDN) — set de iconos lineales usado en toda la página (flechas, íconos de tarjetas, etc). `app.js` llama a `lucide.createIcons()` al cargar.
- Tipografía: `Avenir` / `Avenir Next` con fallback a `Segoe UI` / system-ui. Si el proyecto final necesita los archivos de fuente reales, agregar `@font-face` en `style.css`.

## Estructura de la página (secciones, en orden)
1. **Header** fijo — logo + navegación con anclas a cada sección.
2. **Hero** (`#hero`) — fondo full-bleed con overlay degradado navy, título/subtítulo, 5 tarjetas de acceso rápido a las líneas de negocio (IA, BI, Robótica destacada, C4/C5, Seguridad), y una franja del isotipo a baja opacidad.
3. **Ecosistema** (`#ecosistema`) — 3 cifras clave (+50 centros, 22M+ personas, 340+ clientes), collage de 2 fotos y texto de respaldo.
4. **Ecosistema tecnológico** (`#ecosistema-tech`) — 4 pasos en scroll vertical (Detección → Despacho → Coordinación → Acción en campo), cada uno con texto a la izquierda y un panel de video/imagen a la derecha, conectados por una línea vertical con nodos.
5. **Soluciones** (`#soluciones`) — panel dividido: texto institucional a la izquierda, imagen de fondo + tarjeta flotante con carrusel automático (3 categorías: Seguridad física, Inteligencia de datos, Gestión tecnológica) a la derecha.
6. **Sectores** (`#sectores`) — encabezado + dos paneles divididos (Privado y Gobierno), cada uno con su propia tarjeta flotante y carrusel automático de sub-sectores.
7. **Robótica (preview)** (`#robotica`) — bloque hero de pantalla completa: fondo fotográfico que cambia según la categoría activa, texto institucional, y una tarjeta flotante en "mazo de cartas" con carrusel de 5 categorías (Seguridad, Logística, Hotelería, Medicina, Alta carga), navegable con flechas y puntos.
8. **Robótica · marcas + CTA** — marquesina infinita con nombres de marcas de robótica (contenido de ejemplo, sustituir por marcas reales/logos) + enlace al catálogo completo.
9. **Proyectos Destacados** (`#proyectos`) — grid de 4 tarjetas de proyecto (imagen, nombre, cliente, fecha/estatus).
10. **Contacto + Footer** (`#contacto`) — CTA final a pantalla completa sobre fondo con overlay, seguido del footer con wordmark gigante, columnas de navegación, ubicaciones y barra inferior legal.

## Funcionalidad implementada en `app.js`

### 1. Reveal on scroll
Todos los elementos con clase `.reveal` (más modificadores `.reveal-d1` … `.reveal-d5` para retrasos escalonados) inician en opacidad 0 / desplazados 24px, y se animan a su estado final cuando entran al viewport, usando `IntersectionObserver`. Hay un timeout de seguridad que fuerza la visibilidad de todo a los 1.6s por si algo no cruza el observer.

### 2. Parallax
Elementos con `data-parallax="0.06"` (o el valor que sea) se desplazan y escalan levemente en función del scroll, calculado en cada frame con `requestAnimationFrame`. Se usa en los fondos de imagen de Soluciones y Sectores.

### 3. Línea de tiempo de "Ecosistema tecnológico"
A medida que se hace scroll, los nodos (`[data-eco-node]`) se activan (cambian de color) cuando cruzan el 55% del viewport, y una barra vertical (`[data-eco-fill]`) crece para "conectar" los nodos ya activados — simula progreso en tiempo real.

### 4. Carruseles de texto autoplay (Soluciones / Sectores)
Tres carruseles independientes (`[data-carousel="soluciones|privado|gobierno"]`) rotan automáticamente cada 4.2–4.8s, actualizando título, cuerpo de texto y una barra de progreso dentro de la tarjeta flotante correspondiente. Son solo texto — no tienen interacción manual en esta versión.

### 5. Carrusel de Robótica (interactivo)
El carrusel de la sección Robótica es el más completo:
- Avanza automáticamente cada 4.3s.
- Al cambiar de categoría, cambia **tanto el fondo de toda la sección** como la **tarjeta flotante** (imagen + nombre de categoría), con transición de opacidad.
- Tiene controles manuales: flechas circulares (izquierda/derecha) y puntos indicadores clicleables — cualquier interacción manual reinicia el temporizador de autoplay.
- Las 5 categorías (Seguridad, Logística, Hotelería, Medicina, Alta carga) actualmente comparten la misma imagen ilustrativa de catálogo; sustituir cada `<img>` dentro de `.robotica__bg-slide` y `.robotica__card-media` por la fotografía específica de cada categoría cuando esté disponible.

### 6. Marquesina de marcas
Animación CSS pura (`@keyframes roboMarquee`) — la lista de marcas está duplicada en el HTML para lograr el loop infinito sin salto.

## Notas para la maquetación funcional en Cursor
- Todo el contenido de "sustituir por foto/video real" está marcado con placeholders visibles — son los puntos donde se necesitan assets reales del cliente.
- No hay formularios ni llamadas a backend — los CTAs ("Solicitar demo", "Contacto") son anclas/enlaces sin lógica de envío.
- No hay router — es una sola página con scroll y anclas internas (`#hero`, `#soluciones`, etc.).
- El diseño es responsive a nivel básico (breakpoints en 1080px y 640px) pero fue pensado principalmente para desktop; conviene revisar a fondo el comportamiento en mobile al hacer la maqueta funcional.
