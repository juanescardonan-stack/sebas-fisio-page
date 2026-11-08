/* =====================================================================
   CONFIGURACIÓN DEL SITIO — edita SOLO este archivo para cambiar
   datos de contacto. Se usan automáticamente en todas las páginas.
   ===================================================================== */
window.SITE_CONFIG = {
  // Número de WhatsApp en formato internacional, sin "+", espacios ni guiones.
  whatsapp: "573155159416",
  whatsappDisplay: "+57 315 515 9416",

  // Dirección del consultorio y enlace de Google Maps
  // Sede principal (la sección "Sedes" de index.html tiene las dos direcciones y mapas)
  address: "Carrera 77B #45G - 61, Medellín, Colombia",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=Carrera+77B+%2345G-61%2C+Medell%C3%ADn%2C+Colombia",

  // Enlace de agenda en línea (Calendly, Google Calendar, Agenda Pro, etc.)
  // Si no tienes, deja "" y el botón de agenda se oculta.
  calendarUrl: "",                                             // <-- CAMBIAR

  // Redes sociales
  instagram: "https://www.instagram.com/fisio.sebastian.rengifo/",
  instagramHandle: "@fisio.sebastian.rengifo",
  email: "",                                                   // <-- CAMBIAR (si queda vacío, el ícono de correo se oculta)

  // Enlace al perfil de Google (reseñas)
  googleReviewsUrl: "https://maps.app.goo.gl/tXSD6DExu8gXHnYG8",

  // Horario de atención
  schedule: { es: "Agenda tu cita · Lunes a sábado de 8:00 a. m. a 12:30 p. m.", en: "Book your appointment · Monday to Saturday, 8:00 a.m. to 12:30 p.m." },

  // Formulario de reserva de la página de cursos → a qué correo y por qué servicio se envía.
  //  - formEmail: destinatario (también se usa para el respaldo por correo si el servicio falla).
  //  - formEndpoint: URL que recibe el formulario. Opciones:
  //      a) FormSubmit (gratis, sin cuenta; requiere activar una vez desde el correo que llega):
  //         "https://formsubmit.co/ajax/destinyrehabilitacion@gmail.com"
  //      b) Google Apps Script propio (recomendado, más estable; ver README sección 3):
  //         "https://script.google.com/macros/s/XXXXXXXX/exec"
  formEmail: "destinyrehabilitacion@gmail.com",
  formEndpoint: "https://script.google.com/macros/s/AKfycbz6Bdg6zGUAn2rGbNjY0PL40dal1BWqtnn3t9-BmilNNoDzMPZ2MbexjE3xEwwaH2spVw/exec",  // Apps Script publicado (ver README §3)

  // Publicidad y medición (Google Ads / Meta Ads). Deja "" en lo que no uses; nada se carga si está vacío.
  tracking: {
    gtmId: "GTM-TB24TX26",      // Etiqueta de Google de la cuenta de Google Ads (la que Google muestra en "Instalar manualmente")
    googleTagId: "",            // <-- CAMBIAR: ID de conversión de Google Ads, ej. "AW-123456789" (Conversiones → la conversión → Detalles de la etiqueta)
    ga4Id: "",                  // opcional: ID de Google Analytics 4, ej. "G-XXXXXXXXXX"
    // Etiquetas de conversión de Google Ads (la parte después de la barra en "AW-123456789/AbCdEfGh")
    conversions: {
      whatsapp: "",             // <-- CAMBIAR: conversión "Contacto por WhatsApp" (clic en cualquier botón de WhatsApp)
      llamada:  "",             // opcional: conversión "Llamada" (clic en un número de teléfono)
      curso:    ""              // <-- CAMBIAR: conversión "Inscripción FISIO 2.0" (formulario enviado con éxito)
    },
    metaPixelId: ""             // <-- CAMBIAR: ID del píxel de Meta, ej. "1234567890123456" (Meta Business → Orígenes de datos)
  },

  // Próxima fecha del curso FISIO 2.0
  course: {
    dates: { es: "10 y 11 de abril de 2027", en: "April 10–11, 2027" },
    city:  { es: "Medellín", en: "Medellín" },
    // Valor de la reserva / inversión que se muestra junto al QR (deja "" para mostrar "Te lo confirmamos por WhatsApp")
    price: { es: "$699.900 COP", en: "$699,900 COP" },
    // Valor de la reserva (50%) que se paga por QR para asegurar el cupo
    deposit: { es: "$350.000 COP", en: "$350,000 COP" },
    // Tarjetas "PRÓXIMAS FORMACIONES" de la página de cursos: agrega o quita ciudades y fechas
    upcoming: [                                                                      // <-- CAMBIAR
      { city: "Medellín", date: { es: "10 y 11 de abril de 2027", en: "April 10–11, 2027" } }
    ],
    seats: 25
  }
};
