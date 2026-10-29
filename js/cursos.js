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

  /* ---- Envío ---- */
  const t = k => { const d = (window.I18N && window.I18N.en) || {}; return lang() === "en" && d[k] ? d[k] : null; };
  const endpoint = CFG.formEndpoint || form.action;
  const esAppsScript = /script\.google\.com/.test(endpoint);

  // Recoge los campos como objeto {etiqueta: valor} (sin los técnicos "_xxx")
  function datos() {
    const out = {};
    new FormData(form).forEach((v, k) => { if (k[0] !== "_" && !(v instanceof File)) out[k] = String(v).trim(); });
    return out;
  }
  function leerArchivoBase64(file) {
    return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result).split(",")[1] || ""); r.onerror = rej; r.readAsDataURL(file); });
  }
  function textoResumen(d) {
    const l = lang();
    const lineas = [l === "en" ? "Hi Sebastián, I'd like to sign up for the FISIO 2.0 training." : "Hola Sebastián, quiero inscribirme en la formación FISIO 2.0."];
    Object.keys(d).forEach(k => { if (d[k]) lineas.push(k + ": " + d[k]); });
    return lineas.join("\n");
  }
  function mostrarRespaldo(d) {
    const fb = $("#formFallback"); if (!fb) return;
    const msg = textoResumen(d);
    const wa = $("#fallbackWa"); if (wa) wa.href = "https://wa.me/" + (CFG.whatsapp || "") + "?text=" + encodeURIComponent(msg);
    const mail = $("#fallbackMail"); if (mail) mail.href = "mailto:" + (CFG.formEmail || "") + "?subject=" + encodeURIComponent("Inscripción Formación FISIO 2.0") + "&body=" + encodeURIComponent(msg);
    fb.hidden = false;
    fb.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function mostrarExito() {
    const ok = $("#formOk"); if (ok) { ok.hidden = false; ok.scrollIntoView({ behavior: "smooth", block: "center" }); }
    form.reset(); form.classList.remove("was-validated"); toggleOtra();
  }

  async function enviar(d, file) {
    if (esAppsScript) {
      // Apps Script: JSON como texto plano (sin preflight CORS); el archivo va en base64
      const payload = Object.assign({}, d);
      if (file) { payload.archivoBase64 = await leerArchivoBase64(file); payload.archivoNombre = file.name; payload.archivoTipo = file.type; }
      const res = await fetch(endpoint, { method: "POST", body: JSON.stringify(payload) });
      const j = await res.json();
      if (!j || !j.ok) throw new Error(j && j.error || "Apps Script error");
    } else {
      // FormSubmit (endpoint /ajax/): se envía el formulario completo, con adjunto
      const fd = new FormData(form); fd.delete("_next");
      const res = await fetch(endpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const j = await res.json().catch(() => ({}));
      if (j && j.success === "false") throw new Error(j.message || "FormSubmit error");
    }
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    form.classList.add("was-validated");
    const err = $("#formError"), btn = $("#formSubmit"), fb = $("#formFallback");
    if (fb) fb.hidden = true;
    if (!form.checkValidity()) {
      const terminos = form.querySelector('input[name="Acepta términos"]');
      const faltanOtros = Array.from(form.elements).some(el => el !== terminos && typeof el.checkValidity === "function" && !el.checkValidity());
      if (err) {
        err.hidden = false;
        err.textContent = (!faltanOtros && terminos && !terminos.checked)
          ? (t("f2.form.terms") || "Por favor acepta los términos y condiciones antes de enviar el formulario.")
          : (t("f2.form.error") || err.dataset.es || "Revisa los campos marcados con * antes de enviar.");
      }
      const first = form.querySelector(":invalid"); if (first) first.focus();
      return;
    }
    const fileInput = $("#fComprobante");
    const file = fileInput && fileInput.files && fileInput.files[0];
    if (file && file.size > 10 * 1024 * 1024) {
      if (err) { err.hidden = false; err.textContent = t("f2.form.fileTooBig") || "El comprobante debe pesar menos de 10 MB."; }
      fileInput.focus(); return;
    }
    if (err) err.hidden = true;
    const replyTo = $("#formReplyTo"), correo = $("#fCorreo"); if (replyTo && correo) replyTo.value = correo.value;
    const d = datos();
    const txt = btn ? btn.textContent : "";
    if (btn) { btn.disabled = true; btn.textContent = t("f2.form.sending") || "Enviando…"; }
    try {
      await enviar(d, file);
      mostrarExito();
    } catch (ex) {
      console.warn("Formulario: no se pudo enviar por el servicio configurado.", ex);
      mostrarRespaldo(d);
    } finally {
      if (btn) { btn.disabled = false; btn.textContent = txt; }
    }
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
