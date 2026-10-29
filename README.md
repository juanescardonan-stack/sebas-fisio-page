# Sebastián Rengifo · Fisioterapia — Sitio web

Sitio estático (HTML + CSS + JavaScript puro, sin dependencias ni proceso de build) para el consultorio de fisioterapia de Sebastián Rengifo Mora en Medellín y su curso FISIO 2.0.

## Estructura

```
├── index.html          Página principal: servicios, recuperación muscular, sobre mí, opiniones, contacto
├── cursos.html         Página del curso FISIO 2.0
├── css/styles.css      Estilos (paleta clínica azul/teal + blanco, responsive)
├── js/config.js        ⚙️  DATOS DE CONTACTO — edita aquí WhatsApp, dirección, Instagram, agenda
├── js/i18n.js          Traducciones al inglés (el español vive en el HTML)
├── js/main.js          Animaciones, menú, carrusel, traducción, formulario → WhatsApp
├── js/columna3d.js     Columna vertebral 3D del hero (Three.js desde CDN; si no hay WebGL se muestra la foto)
└── assets/
    ├── img/            Fotos optimizadas para web
    ├── video/          Video de recuperación muscular (comprimido, 5 MB) + poster
    └── favicon.svg
```

## 1. Configurar los datos de contacto

Abre `js/config.js`. WhatsApp, dirección e Instagram ya están configurados; los demás valores marcados con `<-- CAMBIAR` (agenda en línea, correo, enlace de reseñas, horario, fechas del curso) se pueden completar cuando los tengas:

| Campo | Qué poner |
|---|---|
| `whatsapp` | Número con indicativo, solo dígitos. Ej: `573001234567` |
| `whatsappDisplay` | Texto visible. Ej: `+57 300 123 4567` |
| `address` / `mapsUrl` | Dirección del consultorio y enlace de Google Maps |
| `calendarUrl` | Enlace de agenda en línea (Calendly, etc.). Si se deja vacío, el ítem se oculta |
| `instagram` / `instagramHandle` | Enlace y usuario de Instagram |
| `email` | Correo de contacto |
| `googleReviewsUrl` | Enlace al perfil de Google (reseñas) |
| `schedule` | Horario de atención (ES y EN) |
| `course.dates` / `course.city` | Próxima fecha y ciudad del curso FISIO 2.0 |

Todos los botones de WhatsApp del sitio abren un chat con un mensaje precargado según el servicio.

## 2. Publicar en GitHub Pages

1. Crea un repositorio en GitHub (por ejemplo `fisio-sebastian-rengifo`).
2. Sube **todo el contenido de esta carpeta** a la raíz del repositorio (índice en `index.html`).
   ```bash
   git init
   git add .
   git commit -m "Sitio web Sebastián Rengifo Fisioterapia"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/fisio-sebastian-rengifo.git
   git push -u origin main
   ```
3. En el repositorio: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, rama `main`, carpeta `/ (root)` → **Save**.
4. En 1–2 minutos el sitio queda en `https://TU_USUARIO.github.io/fisio-sebastian-rengifo/`.

Para usar un dominio propio después, agrega el dominio en **Settings → Pages → Custom domain** y configura el DNS según indique GitHub.

## 3. Editar contenido

- **Textos en español**: directamente en `index.html` / `cursos.html`.
- **Textos en inglés**: en `js/i18n.js`. Cada texto del HTML tiene un atributo `data-i18n="clave"`; esa misma clave en `i18n.js` contiene la traducción.
- **Precios**: están en las tarjetas de `index.html` (sección `#servicios`) y en la sección de recuperación muscular.
- **Fotos**: reemplaza los archivos de `assets/img/` manteniendo el nombre, o cambia la ruta en el `src` de la imagen. Recomendado: JPG de máx. 1200 px de ancho.
- **Columna 3D del hero**: en `js/columna3d.js`, el bloque `CONFIG` controla la velocidad y sentido del giro, los colores (hueso, discos, luces) y si se muestran las etiquetas C1…L5. La columna gira sola y también se puede arrastrar con el mouse o el dedo. Para volver a la foto, borra el `<div id="columna3d">` del `index.html`.
- **Video**: `assets/video/recuperacion.mp4` (vertical 9:16). Para cambiarlo, usa un MP4 H.264 de menos de ~10 MB.

## Características

- Responsive: escritorio, tablet y móvil (menú hamburguesa).
- Botón ES / EN que traduce toda la página y recuerda la elección del visitante.
- Animaciones en JavaScript: aparición al hacer scroll, contadores, carrusel de reseñas con autoplay y gestos táctiles, acordeón de contraindicaciones, parallax suave en el hero, botón flotante de WhatsApp.
- Formulario de contacto que abre WhatsApp con el mensaje armado (no requiere servidor).
- Respeta `prefers-reduced-motion`.
