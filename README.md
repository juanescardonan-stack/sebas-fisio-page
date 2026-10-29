# Sebastián Rengifo · Fisioterapia — Sitio web

Sitio estático (HTML + CSS + JavaScript puro, sin dependencias ni proceso de build) para el consultorio de fisioterapia de Sebastián Rengifo Mora en Medellín y su curso FISIO 2.0.

## Estructura

```
├── index.html          Página principal: servicios, recuperación muscular, sobre mí, opiniones, contacto
├── cursos.html         Página Formación FISIO 2.0 (copia del brochure + formulario de reserva con pago por QR)
├── css/styles.css      Estilos (paleta clínica azul/teal + blanco, responsive)
├── js/config.js        ⚙️  DATOS DE CONTACTO — edita aquí WhatsApp, dirección, Instagram, agenda
├── js/i18n.js          Traducciones al inglés (el español vive en el HTML)
├── js/main.js          Animaciones, menú, carrusel, traducción, formulario → WhatsApp
├── js/columna3d.js     Columna vertebral 3D de fondo en el hero (Three.js desde CDN; sin WebGL simplemente no aparece)
├── js/cursos.js        Página de formación: tarjetas de próximas fechas (desde config.js) y formulario de reserva
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
| `course.upcoming` | Tarjetas "Próximas formaciones" de `cursos.html`: lista de `{ city, date }` (agrega o quita ciudades) |
| `course.price` | Valor de la reserva que se muestra junto al QR (vacío = "Te lo confirmamos por WhatsApp") |
| `course.seats` | Cupos por formación (se muestra en el botón "Reservar mi cupo") |

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

## 3. Formulario de reserva (cursos.html) → correo

El formulario envía los datos a **destinyrehabilitacion@gmail.com** usando el servicio gratuito [FormSubmit](https://formsubmit.co) (no requiere servidor ni cuenta).

**Activación (solo la primera vez):** tras el primer envío real desde el sitio publicado, FormSubmit manda un correo a destinyrehabilitacion@gmail.com con un botón **"Activate form"**. Hay que hacer clic ahí una vez; desde entonces cada envío llega como correo con una tabla de los datos y el comprobante adjunto. Si no llega, revisar la carpeta de spam.

- Para cambiar el destinatario: edita el `action` del `<form id="enrollForm">` en `cursos.html` (`https://formsubmit.co/OTRO@correo.com`) y vuelve a activar.
- El asunto del correo se define en el campo oculto `_subject`.
- Tras enviar, el visitante vuelve a `cursos.html?enviado=1` y ve el mensaje de confirmación.
- El QR de pago es `assets/img/cursos/qr-pago.jpg` (Bre-B / Nequi, llave 315 515 9416). Si cambia la llave, reemplaza la imagen y el dato en la tarjeta de pago de `cursos.html`.
- El texto de términos/cancelaciones está en `cursos.html` (bloque `.f2-terms`) y su traducción en `js/i18n.js` (`f2.form.terms1/2`).

## 4. Editar contenido

- **Textos en español**: directamente en `index.html` / `cursos.html`.
- **Textos en inglés**: en `js/i18n.js`. Cada texto del HTML tiene un atributo `data-i18n="clave"`; esa misma clave en `i18n.js` contiene la traducción.
- **Precios**: están en las tarjetas de `index.html` (sección `#servicios`) y en la sección de recuperación muscular.
- **Fotos**: reemplaza los archivos de `assets/img/` manteniendo el nombre, o cambia la ruta en el `src` de la imagen. Recomendado: JPG de máx. 1200 px de ancho.
- **Columna 3D de fondo del hero**: gira sola detrás del texto y la foto. En `js/columna3d.js`, el bloque `CONFIG` controla velocidad, sentido del giro, colores (hueso, discos, luces) y etiquetas C1…L5. Su posición, tamaño y desvanecido se ajustan en `css/styles.css` (bloque "Columna vertebral 3D de fondo": variables `--x3d`, `--y3d`, `--alto3d`, `opacity` y la máscara degradada; hay valores distintos para móvil). Para quitarla, borra el `<div id="columna3d">` del `index.html`.
- **Video**: `assets/video/recuperacion.mp4` (vertical 9:16). Para cambiarlo, usa un MP4 H.264 de menos de ~10 MB.

## Características

- Responsive: escritorio, tablet y móvil (menú hamburguesa).
- Botón ES / EN que traduce toda la página y recuerda la elección del visitante.
- Animaciones en JavaScript: aparición al hacer scroll, contadores, carrusel de reseñas con autoplay y gestos táctiles, acordeón de contraindicaciones, parallax suave en el hero, botón flotante de WhatsApp.
- Formulario de contacto que abre WhatsApp con el mensaje armado (no requiere servidor).
- Respeta `prefers-reduced-motion`.
