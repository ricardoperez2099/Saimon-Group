# SAiMON VISION — Documento de Funcionalidades
> Maqueta funcional · Versión 1.0 · Julio 2026

---

## Índice
1. [Estructura general](#1-estructura-general)
2. [Header / Navegación](#2-header--navegación)
3. [Hero](#3-hero)
4. [Ecosistema (Nosotros)](#4-ecosistema-nosotros)
5. [Ecosistema Tecnológico](#5-ecosistema-tecnológico)
6. [Soluciones](#6-soluciones)
7. [Sectores](#7-sectores)
8. [Robótica — Preview](#8-robótica--preview)
9. [Robótica — Marcas + CTA](#9-robótica--marcas--cta)
10. [Proyectos Destacados](#10-proyectos-destacados)
11. [Contacto + Footer](#11-contacto--footer)
12. [Funcionalidades JS globales](#12-funcionalidades-js-globales)
13. [Assets disponibles](#13-assets-disponibles)
14. [Pendientes / Placeholders](#14-pendientes--placeholders)
15. [Stack técnico](#15-stack-técnico)

---

## 1. Estructura general

| Elemento | Valor |
|---|---|
| Tipo | Single-page application (SPA sin router) |
| Navegación | Anclas internas con `scroll-behavior: smooth` |
| Framework | Vanilla HTML + CSS + JS (sin dependencias de build) |
| Breakpoints | Desktop ≥1080px · Tablet 640–1080px · Mobile <640px |
| Paleta principal | Navy `#25356d` · Navy oscuro `#0f1633` · Acento azul `#1e86c4` · Blanco `#ffffff` |
| Tipografía | Avenir / Avenir Next — fallback a Segoe UI / system-ui |

### Orden de secciones
```
Header (fijo)
├── #hero              → Hero fullscreen con video + tarjetas
├── #ecosistema        → Estadísticas + collage de fotos
├── #ecosistema-tech   → Línea de tiempo scroll-driven (4 pasos)
├── #soluciones        → Panel dividido + carrusel de texto
├── #sectores          → Header + 2 paneles (Privado / Gobierno)
├── #robotica          → Hero fullscreen + carrusel en mazo
├── [robotica-cta]     → Marquesina de marcas + link externo
├── #proyectos         → Grid de 4 tarjetas de proyecto
└── #contacto          → CTA final + Footer completo
```

---

## 2. Header / Navegación

### Comportamiento
- **Fijo** en la parte superior (`position: fixed; z-index: 50`)
- **Transparente** sobre el hero, se vuelve sólido (`background: rgba(15,22,51,0.92)` + `backdrop-filter blur`) al hacer scroll > 60px
- **Link activo**: el enlace de la sección visible en el viewport recibe la clase `.is-active` (mayor opacidad)
- La detección de sección activa se actualiza en cada evento `scroll`

### Links de navegación

| Etiqueta | Destino |
|---|---|
| Inicio | `#hero` |
| Nosotros | `#ecosistema` |
| Soluciones | `#soluciones` |
| Robótica | `#robotica` |
| Sectores | `#sectores` |
| Partners | `#proyectos` |
| Contacto | `#contacto` (estilo pill outline) |

### Responsive
- En mobile (<640px): gap reducido, `font-size: 11px`, el botón "Contacto" (pill) se oculta para ahorrar espacio

---

## 3. Hero

### Composición visual
- Fondo **fullscreen** con `min-height: 100vh`
- **Video de fondo** (`assets/hero-video.mp4`): autoplay, muted, loop, playsinline. Poster fallback: `assets/robotica.png`
- **Overlay degradado** azul navy de arriba hacia abajo
- **Efecto scanlines**: textura de líneas horizontales a baja opacidad (overlay decorativo CSS puro)
- **Isotipo** gigante a 11% de opacidad en la parte inferior (logo como elemento decorativo)

### Contenido de texto
- Eyebrow: "Descubre Saimon Vision"
- `<h1>`: "Innovación que protege el futuro"
- Subtítulo: descripción del ecosistema (IA + BI + Robótica)

### Tarjetas de acceso rápido (5 tarjetas)

| Tarjeta | Imagen | Tipo | Destino |
|---|---|---|---|
| Inteligencia Artificial | `inteligencia-artificial.png` | Normal | `#soluciones` |
| Business Intelligence | `business-intelligence.png` | Normal | `#ecosistema` |
| **Robótica** | `robotica.png` | **Destacada** (1.5x ancho) | `#soluciones` |
| Infraestructura C4/C5 | `c5.jpg` | Normal | `#soluciones` |
| Seguridad | `seguridad.png` | Dark | `#soluciones` |

- Cada tarjeta tiene imagen de fondo con degradado, ícono de flecha (Lucide) y label
- La tarjeta destacada tiene badge "Destacado" + título más grande
- **Hover**: la imagen hace zoom `scale(1.07)` con transición suave

### Animaciones de entrada
- Título: `.reveal .reveal-d1` — delay 80ms
- Subtítulo: `.reveal .reveal-d2` — delay 160ms
- Tarjetas: `.reveal .reveal-d3` — delay 240ms

---

## 4. Ecosistema (Nosotros)

### Sección de estadísticas (3 cifras)

| Número | Descripción |
|---|---|
| +50 | Centros de Comando y Control construidos |
| 22M+ | Personas beneficiadas en México, EU y Colombia |
| 340+ | Clientes B2B en Robótica |

- Grid de 3 columnas con separadores verticales semitransparentes
- Tipografía grande (`clamp(44px, 5vw, 66px)`) en peso 900

### Collage de imágenes
- **Foto grande**: posición absoluta, 78% de ancho, 82% de alto — *placeholder pendiente*
- **Foto pequeña**: superpuesta abajo a la derecha, 48% × 46% — *placeholder pendiente*
- **Texto descriptivo** a la derecha: párrafo institucional + link "Conoce nuestras soluciones"

---

## 5. Ecosistema Tecnológico

### Concepto
Sección de fondo blanco que explica el flujo completo de la plataforma en **4 pasos** navegados con scroll vertical.

### Estructura de cada paso
```
[Texto izquierda (40%)] — [Nodo central] — [Panel visual derecha]
```

| Paso | Título | Descripción |
|---|---|---|
| 01 · Detección | Un dron identifica el incidente | Monitoreo en tiempo real |
| 02 · Despacho | BI conecta la respuesta | Datos procesados y enrutados automáticamente |
| 03 · Coordinación | C4/C5 coordina la operación | Centro de comando con información centralizada |
| 04 · Acción en campo | La robótica ejecuta la respuesta | Robots/drones actúan en el lugar del incidente |

### Funcionalidad JS — Línea de tiempo dinámica
- Cada nodo (`data-eco-node`) cambia de color al entrar al 55% superior del viewport
- Una barra vertical (`data-eco-fill`) crece con `height` en px para "conectar" los nodos ya activados
- Se actualiza en cada evento `scroll` sin `requestAnimationFrame` (event directo con `passive: true`)
- **Nodo activo**: color `#1e86c4` (azul acento) + halo semitransparente

### Assets de video
- **Paso 1**: `assets/eco-paso-1.mp4` — conectado (autoplay, muted, loop)
- **Pasos 2–4**: placeholders pendientes de video real

### Responsive mobile
- La línea de nodo central (`eco-step__node`) se oculta en <640px
- Los pasos pasan a layout vertical con `flex-direction: column`
- Altura del panel visual reducida a 260px

---

## 6. Soluciones

### Layout
- **Panel dividido** 46%/54%: texto a la izquierda (navy), media a la derecha
- Fondo de media: *placeholder* pendiente (foto de centro de monitoreo)

### Carrusel automático (tarjeta flotante)
- **Intervalo**: 4,500ms
- **3 slides rotando**:

| # | Nombre | Descripción |
|---|---|---|
| 1/3 | Seguridad física | Videovigilancia inteligente, control de accesos, detección proactiva por IA |
| 2/3 | Inteligencia de datos | BI que convierte eventos en métricas accionables en tiempo real |
| 3/3 | Gestión tecnológica | Integración de infraestructura C4/C5 y robótica como un solo sistema |

- La tarjeta muestra: label fijo + título que cambia + cuerpo de texto que cambia + contador `X/3` + barra de progreso animada
- La barra de progreso se actualiza con `width: X%` en transición CSS de 500ms
- **Sin interacción manual** en esta versión (solo autoplay)

### Ornamento decorativo
- SVG de anillos concéntricos + líneas diagonales a 6% de opacidad en el fondo del panel texto

---

## 7. Sectores

### Intro header
- Eyebrow: "Sectores"
- Título: "Seguridad y tecnología para cada tipo de operación"
- Descripción: las 3 categorías (Seguridad física, Inteligencia de datos, Gestión tecnológica)
- SVG de anillos decorativos de fondo

### Panel Privado
- Imagen de fondo: `assets/sec-privado.png` (con parallax)
- **Carrusel automático** (4,200ms) — 3 subsectores:

| # | Nombre | Descripción |
|---|---|---|
| 1/3 | Empresas | Seguridad corporativa integral: control de accesos, videovigilancia, monitoreo |
| 2/3 | Residencial | Gestión residencial inteligente con detección proactiva |
| 3/3 | Industria | Monitoreo industrial y robótica para plantas, almacenes y producción |

### Panel Gobierno
- Imagen de fondo: `assets/sec-gobierno.png` (con parallax)
- **Carrusel automático** (4,800ms) — 3 subsectores:

| # | Nombre | Descripción |
|---|---|---|
| 1/3 | Seguridad pública | Plataformas de videovigilancia e inteligencia para espacio público |
| 2/3 | Municipios | Infraestructura tecnológica municipal integrada a centros de comando |
| 3/3 | Movilidad urbana y penitenciario | Monitoreo de movilidad y seguridad en instalaciones penitenciarias |

- El panel Gobierno está **invertido** (imagen a la izquierda, texto a la derecha)
- La tarjeta flotante aparece a la izquierda (`.floating-card--left`)

---

## 8. Robótica — Preview

### Layout
- Hero fullscreen (`min-height: 860px`) con imagen de fondo que cambia según categoría activa
- Stack de 5 imágenes (`robotica__bg-slide`) superpuestas, solo la activa tiene `opacity: 1`
- Overlay degradado navy de arriba hacia abajo + scanlines

### Carrusel interactivo (el más completo del sitio)

**5 categorías:**

| # | Categoría | Imagen actual |
|---|---|---|
| 1 | Seguridad | `robotica-categoria.png` |
| 2 | Logística | `robotica-categoria.png` |
| 3 | Hotelería | `robotica-categoria.png` |
| 4 | Medicina | `robotica-categoria.png` |
| 5 | Alta carga | `robotica-categoria.png` |

> Nota: todas las categorías usan la misma imagen actualmente. Sustituir por foto específica de cada una.

**Comportamiento:**
- **Autoplay**: cambia cada 4,300ms
- **Controles manuales**: flechas circulares (← →) y puntos indicadores clicables
- Cualquier interacción manual reinicia el temporizador de autoplay (`clearInterval` + nuevo `setInterval`)
- Al cambiar categoría: cambia el **fondo completo de la sección** + la **tarjeta en primer plano**, ambos con transición de opacidad 600ms

**Tarjeta "mazo":**
- 3 capas: 2 capas decorativas de fondo (semitransparentes, desplazadas) + 1 tarjeta activa en primer plano
- La tarjeta muestra: label "Categoría", nombre de categoría y foto

---

## 9. Robótica — Marcas + CTA

### Marquesina de marcas
- Animación CSS pura (`@keyframes roboMarquee`, 32s linear infinite)
- Lista duplicada en HTML para loop infinito sin salto visual
- **Marcas actuales** (de ejemplo — sustituir por marcas reales / logos):
  Boston Dynamics · ABB Robotics · FANUC · KUKA · Unitree · Keenon · Pudu Robotics · Locus Robotics · MiR · Omron · Yaskawa

### CTA
- Enlace externo a `https://saimonrobotics.com` — "Ver catálogo completo"
- Abre en nueva pestaña (`target="_blank" rel="noopener"`)

---

## 10. Proyectos Destacados

### Grid de 4 tarjetas

| Proyecto | Cliente | Estatus |
|---|---|---|
| C5i Estado de México | Gobierno del Estado de México | En operación |
| C5i Guanajuato | Gobierno de Guanajuato | En operación |
| Walmart LATAM — Robótica | Walmart LATAM | Cliente B2B activo |
| IMSS — Robótica | Instituto Mexicano del Seguro Social | Cliente B2B activo |

- Cada tarjeta: imagen (300px alto, placeholder), nombre del proyecto, cliente, fecha/estatus
- Grid 2 columnas en desktop, 1 columna en mobile
- Fondo de sección: `#f7f8fa` (gris muy claro) — única sección con fondo claro fuera del ecosistema tech y sectores

---

## 11. Contacto + Footer

### CTA de contacto
- Fondo de video/imagen — *placeholder pendiente* (dashboard de monitoreo nocturno)
- Overlay degradado navy
- Título: "¿Listo para transformar tu operación?"
- Botón: "Solicitar demo" — actualmente un enlace `#` sin lógica de backend

### Footer

**Wordmark:** "SAiMON VISION" gigante (clamp 64–168px), las letras "ai" en acento azul `#1e86c4`

**Columnas de navegación:**

| Columna | Links |
|---|---|
| Saimon Vision | Nosotros, Contacto |
| Soluciones | Seguridad física, Inteligencia de datos, Gestión tecnológica |
| Robótica | Ver catálogo completo (externo) |
| Sectores | Privado, Gobierno |
| Redes | LinkedIn, Instagram (pendiente URLs reales) |

**Barra inferior:**
- Copyright © 2026 Saimon Vision
- Aviso de Privacidad (pendiente)
- Términos de Uso (pendiente)
- Link "Volver arriba" → `#hero`

**Pendiente:** Ubicaciones de oficinas (campo con texto de marcador "[Ciudad, País]")

---

## 12. Funcionalidades JS globales

### Reveal on Scroll
- **Clase activadora**: `.reveal` (inicio: `opacity:0; translateY(24px)`)
- **Clase final**: `.reveal.visible` (destino: `opacity:1; translateY(0)`)
- **Modificadores de delay**: `.reveal-d1` (80ms) · `.reveal-d2` (160ms) · `.reveal-d3` (240ms) · `.reveal-d4` (100ms) · `.reveal-d5` (120ms)
- **Motor**: `IntersectionObserver` con threshold 8%, rootMargin `-4%` inferior
- **Timeout de seguridad**: fuerza `.visible` en todo a los 1,600ms (previene elementos permanentemente ocultos)

### Parallax
- **Atributo**: `data-parallax="0.06"` (el valor controla la intensidad)
- **Cálculo**: desplazamiento Y proporcional a la posición del elemento relativa al centro del viewport, con `scale` leve
- **Motor**: `requestAnimationFrame` en cada evento `scroll` (con flag `ticking` para evitar frames múltiples)
- **Usado en**: fondos de Soluciones y Sectores

### Header dinámico
- Clase `.header--scrolled`: se agrega cuando `scrollY > 60px`
- Efecto: fondo sólido semitransparente + blur + sombra sutil
- Link `.is-active`: el link del nav que corresponde a la sección visible recibe mayor opacidad

### Línea de tiempo (Ecosistema Tecnológico)
- Nodos (`data-eco-node`) cambian de color cuando su borde superior supera el 55% del viewport
- Barra (`data-eco-fill`) crece en píxeles desde el tope del track hasta el último nodo activo

### Carruseles de texto (Soluciones / Privado / Gobierno)
- 3 instancias independientes de `initTextCarousel()`
- Cada una mantiene su propio índice y `setInterval`
- Actualiza: título, cuerpo, contador `X/N`, barra de progreso (width en %)

### Carrusel de Robótica
- Instancia única con lógica de fondo + tarjeta + dots + flechas
- Reinicio automático del autoplay en cada interacción manual

---

## 13. Assets disponibles

| Archivo | Usado en | Estado |
|---|---|---|
| `assets/logo-saimon-vision-white.png` | Header | ✅ Conectado |
| `assets/logo-saimon-vision-blue.png` | Disponible | ⚠️ Sin usar aún |
| `assets/logo-saimon-azul.svg` | Hero (isotipo decorativo) | ✅ Conectado |
| `assets/hero-video.mp4` | Hero (fondo de video) | ✅ Conectado |
| `assets/eco-paso-1.mp4` | Ecosistema tech paso 1 | ✅ Conectado |
| `assets/inteligencia-artificial.png` | Hero tarjeta IA | ✅ Conectado |
| `assets/business-intelligence.png` | Hero tarjeta BI | ✅ Conectado |
| `assets/robotica.png` | Hero tarjeta Robótica | ✅ Conectado |
| `assets/c5.jpg` | Hero tarjeta C4/C5 | ✅ Conectado |
| `assets/seguridad.png` | Hero tarjeta Seguridad | ✅ Conectado |
| `assets/sec-privado.png` | Sectores panel Privado | ✅ Conectado |
| `assets/sec-gobierno.png` | Sectores panel Gobierno | ✅ Conectado |
| `assets/robotica-categoria.png` | Robótica (fondo + tarjeta × 5) | ✅ Conectado |

---

## 14. Pendientes / Placeholders

Los siguientes elementos muestran un cuadro rayado azul marino con texto indicativo. Son los puntos donde el cliente debe proveer assets reales:

| Sección | Placeholder | Recomendación |
|---|---|---|
| Ecosistema (collage foto grande) | Foto corporativa del cliente | JPG/WebP min. 1200px ancho |
| Ecosistema (collage foto pequeña) | Segunda foto de operación | JPG/WebP min. 600px ancho |
| Ecosistema Tech — Pasos 2, 3, 4 | Video de despacho, coordinación y acción | MP4 H.264, mismo formato que eco-paso-1.mp4 |
| Soluciones (panel media) | Foto de centro de monitoreo / dashboard | JPG/WebP min. 1400px ancho |
| Robótica — Fondos por categoría | 5 fotos distintas (Seg, Log, Hot, Med, Carga) | JPG/WebP min. 1600px ancho |
| Robótica — Tarjetas por categoría | 5 fotos distintas (mismo set) | JPG/WebP min. 600px ancho |
| Proyectos (4 fotos) | Fotos de cada proyecto (C5i EdoMex, GTO, Walmart, IMSS) | JPG/WebP min. 800px ancho |
| Contacto (fondo) | Video/foto de dashboard nocturno o drones | MP4 o JPG |
| Footer — Ubicaciones | Ciudades y países de las oficinas | Texto plano |
| Footer — Redes | URLs reales de LinkedIn e Instagram | URLs externas |
| CTAs "Solicitar demo" / "Contacto" | Formulario o integración (CRM, email, Calendly) | Backend / servicio externo |
| Aviso de Privacidad | Documento legal | Página o PDF |
| Términos de Uso | Documento legal | Página o PDF |
| Marcas en marquesina | Logos SVG/PNG reales de las marcas que distribuyen | SVG preferido |

---

## 15. Stack técnico

```
Lenguajes:      HTML5 · CSS3 · JavaScript ES2020 (vanilla)
Build:          Ninguno — archivos estáticos directos
Servidor:       Cualquier servidor de archivos estáticos (Nginx, Apache, GitHub Pages, Vercel, etc.)
Dependencias:   Lucide Icons v0.latest (CDN: unpkg.com/lucide@latest)
Tipografía:     Sistema / Avenir (no requiere fuente web a menos que se añada @font-face)
Compatibilidad: Todos los navegadores modernos (Chrome/Safari/Firefox/Edge); IE no soportado
```

### Para lanzar localmente
```bash
# Opción 1 — Python (sin instalación)
python3 -m http.server 3000

# Opción 2 — Node (npx, sin instalación)
npx serve .

# Opción 3 — VS Code / Cursor
# Instalar extensión "Live Server" y hacer clic en "Go Live"
```

> Abrir en `http://localhost:3000` — no abrir `index.html` directamente con `file://` ya que el video puede no cargar por políticas CORS del navegador.

---

*Documento generado automáticamente a partir del análisis del diseño exportado — SAiMON VISION Home v1.0*
