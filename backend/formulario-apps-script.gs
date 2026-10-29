/**
 * Formulario de reserva FISIO 2.0 → correo (Google Apps Script)
 * ---------------------------------------------------------------
 * Recibe el formulario de cursos.html y lo envía por correo con el
 * comprobante adjunto. Corre en la cuenta de Google que lo publica, sin
 * servicios de terceros.
 *
 * CÓMO PUBLICARLO (una sola vez, ~5 minutos):
 *  1. Entra a https://script.google.com con la cuenta destinyrehabilitacion@gmail.com
 *     (o cualquier cuenta de Google; el correo llega igual a DESTINO).
 *  2. "Nuevo proyecto" → borra el contenido y pega este archivo completo → Guardar (nómbralo "Formulario FISIO 2.0").
 *  3. Botón "Implementar" → "Nueva implementación" → tipo "Aplicación web":
 *        - Ejecutar como: "Yo"
 *        - Quién tiene acceso: "Cualquier usuario"
 *     → "Implementar". Autoriza los permisos cuando los pida (enviar correo).
 *  4. Copia la "URL de la aplicación web" (termina en /exec) y pégala en js/config.js:
 *        formEndpoint: "https://script.google.com/macros/s/....../exec"
 *  5. Prueba enviando el formulario desde el sitio. Para probar aquí mismo, ejecuta la función `probar`.
 *
 * Si cambias este código después, vuelve a "Implementar" → "Administrar implementaciones" → editar → "Nueva versión".
 */

var DESTINO = "destinyrehabilitacion@gmail.com";   // <-- a quién llegan las inscripciones
var ASUNTO  = "Nueva inscripción · Formación FISIO 2.0";

// Orden en que se muestran los campos en el correo
var CAMPOS = ["Nombre", "Celular", "Correo", "Ciudad de interés", "Otra ciudad", "Perfil", "Solicitud", "Mensaje", "Acepta términos"];

function doPost(e) {
  try {
    var d = JSON.parse(e.postData.contents || "{}");
    if (d._honey) return responder({ ok: true });            // bot: se ignora en silencio

    var filas = "";
    CAMPOS.forEach(function (k) {
      if (d[k]) filas += "<tr><td style='padding:6px 10px;color:#5b6f7a;white-space:nowrap'><b>" + esc(k) + "</b></td><td style='padding:6px 10px'>" + esc(d[k]).replace(/\n/g, "<br>") + "</td></tr>";
    });
    var html = "<div style='font-family:Arial,sans-serif;color:#15303d'>"
             + "<h2 style='color:#0d6e8f;margin:0 0 12px'>Nueva inscripción · Formación FISIO 2.0</h2>"
             + "<table style='border-collapse:collapse;border:1px solid #dbe7ec'>" + filas + "</table>"
             + "<p style='color:#5b6f7a;font-size:12px'>Enviado desde el formulario del sitio web · " + new Date().toLocaleString("es-CO", { timeZone: "America/Bogota" }) + "</p>"
             + "</div>";

    var opciones = { htmlBody: html, name: "Formulario FISIO 2.0" };
    if (d.Correo) opciones.replyTo = d.Correo;
    if (d.archivoBase64 && d.archivoNombre) {
      var bytes = Utilities.base64Decode(d.archivoBase64);
      opciones.attachments = [Utilities.newBlob(bytes, d.archivoTipo || "application/octet-stream", d.archivoNombre)];
    }

    MailApp.sendEmail(DESTINO, ASUNTO + (d.Nombre ? " — " + d.Nombre : ""), "Nueva inscripción (ver versión HTML)", opciones);
    return responder({ ok: true });
  } catch (err) {
    return responder({ ok: false, error: String(err) });
  }
}

// Permite comprobar en el navegador que la URL está publicada
function doGet() {
  return responder({ ok: true, mensaje: "Formulario FISIO 2.0 activo" });
}

function responder(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function esc(s) {
  return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; });
}

// Ejecuta esta función desde el editor para enviar un correo de prueba
function probar() {
  var e = { postData: { contents: JSON.stringify({ Nombre: "Prueba", Celular: "300 000 0000", Correo: DESTINO, "Ciudad de interés": "Medellín", Perfil: "Fisioterapeuta", Solicitud: "Recibir información de próximas fechas", "Acepta términos": "Acepto" }) } };
  Logger.log(doPost(e).getContent());
}
