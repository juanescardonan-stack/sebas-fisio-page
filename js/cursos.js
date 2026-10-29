/* =====================================================================
   PÁGINA FORMACIÓN FISIO 2.0
   - Tarjetas "Próximas formaciones" desde js/config.js (course.upcoming)
   - Formulario de reserva: validación, campo "otra ciudad", envío por
     correo a través de FormSubmit (action del <form>) y mensaje de éxito
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG || {};
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));
  const lang = () => (document.documentElement.lang === "en" ? "en" : "es");

  /* ---------------- Próximas formaciones ---------------- */
  function renderUpcoming() {
    const box = $("#nextTrainings"); if (!box) return;
    const list = (CFG.course && CFG.course.upcoming) || [];
    const l = lang();
    box.innerHTML = list.map(item => {
      const date = typeof item.date === "object" ? (item.date[l] || item.date.es || "") : (item.date || "");
      return '<div class="f2-next-city"><strong>' + esc(item.city || "") + "</strong><span>" + esc(date) + "</span></div>";
    }).join("") || '<div class="f2-next-city"><strong>' + (l === "en" ? "City and date" : "Ciudad y fecha") + "</strong><span>" + (l === "en" ? "To be confirmed" : "Por confirmar") + "</span></div>";
    const seats = CFG.course && CFG.course.seats;
    if (seats) $$("[data-i18n-html='f2.next.cta1'] small").forEach(el => { el.textContent = "(" + seats + (l === "en" ? " spots)" : " cupos)"); });
    // Valor junto al QR: si no está configurado, texto por defecto
    const price = CFG.course && CFG.course.price;
    const priceEl = $("[data-cfg-lang='course.price']");
    if (priceEl && !(price && (price[l] || price.es))) priceEl.textContent = l === "en" ? "We'll confirm it by WhatsApp" : "Te lo confirmamos por WhatsApp";
  }
  function esc(s) { return String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }

  /* ---------------- Formulario ---------------- */
  function initEnrollForm() {
  const form = $("#enrollForm"); if (!form) return;

  // Página a la que vuelve FormSubmit tras enviar (misma página con ?enviado=1)
  const next = $("#formNext");
  if (next) next.value = location.origin + location.pathname + "?enviado=1#formulario";

  // Mensaje de éxito al volver del envío
  if (/[?&]enviado=1/.test(location.search)) {
    const ok = $("#formOk"); if (ok) ok.hidden = false;
    try { history.replaceState(null, "", location.pathname + "#formulario"); } catch (e) { /* nada */ }
  }

  // Campo "¿Cuál ciudad?" solo si eligen "Otra"
  const ciudad = $("#fCiudad"), otra = $("#fieldOtraCiudad"), otraInput = $("#fOtraCiudad");
  function toggleOtra() {
    const show = ciudad && ciudad.value === "Otra";
    if (otra) otra.hidden = !show;
    if (otraInput) otraInput.required = !!show;
  }
  if (ciudad) { ciudad.addEventListener("change", toggleOtra); toggleOtra(); }

  // Validación antes de enviar (el envío real lo hace el navegador vía FormSubmit)
  form.addEventListener("submit", e => {
    form.classList.add("was-validated");
    const err = $("#formError");
    if (!form.checkValidity()) {
      e.preventDefault();
      if (err) err.hidden = false;
      const first = form.querySelector(":invalid"); if (first) first.focus();
      return;
    }
    const file = $("#fComprobante");
    if (file && file.files && file.files[0] && file.files[0].size > 10 * 1024 * 1024) {
      e.preventDefault();
      if (err) { err.hidden = false; err.textContent = lang() === "en" ? "The receipt must be smaller than 10 MB." : "El comprobante debe pesar menos de 10 MB."; }
      file.focus();
      return;
    }
    if (err) err.hidden = true;
    const btn = $("#formSubmit");
    if (btn) { btn.disabled = true; btn.textContent = lang() === "en" ? "Sending…" : "Enviando…"; }
  });
  }

  // Se ejecuta después de main.js (que aplica idioma y configuración al cargar)
  document.addEventListener("DOMContentLoaded", () => {
    renderUpcoming();
    initEnrollForm();
    // Se vuelve a pintar cuando cambia el idioma (el toggle actualiza <html lang>)
    new MutationObserver(renderUpcoming).observe(document.documentElement, { attributes: true, attributeFilter: ["lang"] });
  });
})();
