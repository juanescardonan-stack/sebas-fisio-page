/* =====================================================================
   Sebastián Rengifo · Fisioterapia — JavaScript principal
   - Configuración de contacto (config.js)
   - Traducción ES/EN (i18n.js)
   - Animaciones: reveal al hacer scroll, contadores, carrusel, acordeón
   - Menú móvil, header al hacer scroll, formulario → WhatsApp
   ===================================================================== */
(function () {
  "use strict";
  const CFG = window.SITE_CONFIG || {};
  const DICT = (window.I18N || {});
  const $ = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------------- Idioma ---------------- */
  // Español por defecto; se recuerda la última elección del visitante.
  let lang = "es";
  try { lang = localStorage.getItem("srm-lang") || "es"; } catch (e) { lang = "es"; }
  if (lang !== "en") lang = "es";

  // Guarda el texto original (español) de cada nodo traducible
  function cacheOriginals() {
    $$("[data-i18n]").forEach(el => { if (!el.dataset.es) el.dataset.es = el.textContent; });
    $$("[data-i18n-html]").forEach(el => { if (!el.dataset.esHtml) el.dataset.esHtml = el.innerHTML; });
    $$("[data-i18n-placeholder]").forEach(el => { if (!el.dataset.esPh) el.dataset.esPh = el.getAttribute("placeholder") || ""; });
    $$("[data-i18n-content]").forEach(el => { if (!el.dataset.esContent) el.dataset.esContent = el.getAttribute("content") || ""; });
    $$("[data-i18n-wa]").forEach(el => { if (!el.dataset.esWa) el.dataset.esWa = el.getAttribute("data-wa") || ""; });
  }

  function t(key) { return lang === "en" && DICT.en && DICT.en[key] != null ? DICT.en[key] : null; }

  function applyLang() {
    const en = lang === "en";
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach(el => {
      const v = t(el.dataset.i18n);
      const txt = en && v != null ? v : el.dataset.es;
      // Si la traducción contiene etiquetas, se inserta como HTML
      if (/<[a-z][\s\S]*>/i.test(txt)) el.innerHTML = txt; else el.textContent = txt;
    });
    $$("[data-i18n-html]").forEach(el => { const v = t(el.dataset.i18nHtml); el.innerHTML = en && v != null ? v : el.dataset.esHtml; });
    $$("[data-i18n-placeholder]").forEach(el => { const v = t(el.dataset.i18nPlaceholder); el.setAttribute("placeholder", en && v != null ? v : el.dataset.esPh); });
    $$("[data-i18n-content]").forEach(el => { const v = t(el.dataset.i18nContent); el.setAttribute("content", en && v != null ? v : el.dataset.esContent); });
    $$("[data-i18n-wa]").forEach(el => { const v = t(el.dataset.i18nWa); el.setAttribute("data-wa", en && v != null ? v : el.dataset.esWa); });
    $$("[data-cfg-lang]").forEach(el => {
      const path = el.dataset.cfgLang.split("."); let v = CFG; path.forEach(p => { v = v ? v[p] : null; });
      if (v && typeof v === "object") el.textContent = v[lang] || v.es || "";
    });
    $$(".lang-toggle button").forEach(b => b.classList.toggle("active", b.dataset.lang === lang));
    const titleEl = $("title"); if (titleEl) document.title = titleEl.textContent;
    buildWhatsAppLinks();
  }

  function setLang(l) {
    lang = l === "en" ? "en" : "es";
    try { localStorage.setItem("srm-lang", lang); } catch (e) { /* sin almacenamiento */ }
    document.body.classList.add("lang-switching");
    applyLang();
    setTimeout(() => document.body.classList.remove("lang-switching"), 300);
  }

  /* ---------------- Config de contacto ---------------- */
  function waUrl(msg) { return "https://wa.me/" + (CFG.whatsapp || "") + (msg ? "?text=" + encodeURIComponent(msg) : ""); }
  function buildWhatsAppLinks() { $$("[data-wa]").forEach(a => { a.href = waUrl(a.getAttribute("data-wa")); }); }

  function applyConfig() {
    $$("[data-cfg]").forEach(el => { const v = CFG[el.dataset.cfg]; if (v) el.textContent = v; });
    const maps = $("#mapsLink"); if (maps && CFG.mapsUrl) maps.href = CFG.mapsUrl;
    $$("#instagramLink, #footerInstagram").forEach(a => { if (CFG.instagram) a.href = CFG.instagram; });
    const mail = $("#footerEmail"); if (mail) { if (CFG.email) mail.href = "mailto:" + CFG.email; else mail.hidden = true; }
    const g = $("#googleReviewsLink"); if (g && CFG.googleReviewsUrl) g.href = CFG.googleReviewsUrl;
    $$("[data-cfg-href]").forEach(el => { const v = CFG[el.dataset.cfgHref]; if (v) el.href = v; });
    const calItem = $("#calendarItem"), calLink = $("#calendarLink");
    if (calItem && calLink && CFG.calendarUrl) { calLink.href = CFG.calendarUrl; calItem.hidden = false; }
    const y = $("#year"); if (y) y.textContent = new Date().getFullYear();
  }

  /* ---------------- Header / menú ---------------- */
  function initHeader() {
    const header = $("#header"), btn = $("#menuBtn"), links = $("#navLinks");
    const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 24);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    if (btn && links) {
      btn.addEventListener("click", () => {
        const open = links.classList.toggle("open");
        btn.classList.toggle("open", open); btn.setAttribute("aria-expanded", String(open));
      });
      links.addEventListener("click", e => { if (e.target.tagName === "A") { links.classList.remove("open"); btn.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); } });
    }
    // Enlace activo según la sección visible
    const sections = $$("main section[id]");
    const navAnchors = $$("#navLinks a[href^='#']");
    if ("IntersectionObserver" in window && sections.length && navAnchors.length) {
      const io = new IntersectionObserver(entries => {
        entries.forEach(en => {
          if (en.isIntersecting) navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id));
        });
      }, { rootMargin: "-40% 0px -55% 0px" });
      sections.forEach(s => io.observe(s));
    }
  }

  /* ---------------- Reveal al hacer scroll ---------------- */
  function initReveal() {
    const els = $$(".reveal, .reveal-left, .reveal-right");
    if (!("IntersectionObserver" in window)) { els.forEach(e => e.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" });
    els.forEach(e => io.observe(e));
  }

  /* ---------------- Contadores animados ---------------- */
  function initCounters() {
    const counters = $$(".counter");
    const fmt = (n, el) => {
      const dec = parseInt(el.dataset.decimals || "0", 10);
      let s = n.toFixed(dec);
      if (el.dataset.sep) s = s.replace(/\B(?=(\d{3})+(?!\d))/g, el.dataset.sep);
      return (el.dataset.prefix || "") + s + (el.dataset.suffix || "");
    };
    const run = el => {
      const target = parseFloat(el.dataset.target); const dur = 1600; const start = performance.now();
      const step = now => {
        const p = Math.min(1, (now - start) / dur); const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(target * ease, el);
        if (p < 1) requestAnimationFrame(step); else el.textContent = fmt(target, el);
      };
      requestAnimationFrame(step);
    };
    if (!("IntersectionObserver" in window)) { counters.forEach(c => { c.textContent = fmt(parseFloat(c.dataset.target), c); }); return; }
    const io = new IntersectionObserver(entries => { entries.forEach(en => { if (en.isIntersecting) { run(en.target); io.unobserve(en.target); } }); }, { threshold: 0.5 });
    counters.forEach(c => { c.textContent = fmt(0, c); io.observe(c); });
  }

  /* ---------------- Carrusel de opiniones ---------------- */
  function initCarousel() {
    const track = $("#reviewsTrack"); if (!track) return;
    const slides = $$(".review", track); const dots = $("#reviewDots");
    let index = 0, timer, perView = 3;
    const calcPerView = () => { const w = window.innerWidth; perView = w <= 600 ? 1 : w <= 1024 ? 2 : 3; };
    const pages = () => Math.max(1, slides.length - perView + 1);
    const render = () => {
      const gap = 20; const slideW = slides[0].getBoundingClientRect().width;
      track.style.transform = "translateX(-" + index * (slideW + gap) + "px)";
      if (dots) $$("span", dots).forEach((d, i) => d.classList.toggle("active", i === index));
    };
    const buildDots = () => {
      if (!dots) return; dots.innerHTML = "";
      for (let i = 0; i < pages(); i++) { const s = document.createElement("span"); s.addEventListener("click", () => { index = i; render(); restart(); }); dots.appendChild(s); }
    };
    const go = d => { index = (index + d + pages()) % pages(); render(); };
    const restart = () => { clearInterval(timer); timer = setInterval(() => go(1), 5500); };
    $("#prevReview") && $("#prevReview").addEventListener("click", () => { go(-1); restart(); });
    $("#nextReview") && $("#nextReview").addEventListener("click", () => { go(1); restart(); });
    // Deslizar con el dedo
    let x0 = null;
    track.addEventListener("touchstart", e => { x0 = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", e => { if (x0 == null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); } x0 = null; });
    $("#reviewsCarousel").addEventListener("mouseenter", () => clearInterval(timer));
    $("#reviewsCarousel").addEventListener("mouseleave", restart);
    window.addEventListener("resize", () => { calcPerView(); index = Math.min(index, pages() - 1); buildDots(); render(); });
    calcPerView(); buildDots(); render(); restart();
  }

  /* ---------------- Acordeón ---------------- */
  function initAccordion() {
    $$(".accordion").forEach(acc => {
      const btn = $(".accordion-btn", acc), panel = $(".accordion-panel", acc);
      btn.addEventListener("click", () => {
        const open = acc.classList.toggle("open");
        btn.setAttribute("aria-expanded", String(open));
        panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
      });
    });
  }

  /* ---------------- Formulario → WhatsApp ---------------- */
  function initForm() {
    const form = $("#contactForm"); if (!form) return;
    form.addEventListener("submit", e => {
      e.preventDefault();
      const name = $("#fName").value.trim(), service = $("#fService").value, msg = $("#fMsg").value.trim();
      if (!name) { $("#fName").focus(); $("#fName").style.borderColor = "#e05a5a"; return; }
      const en = lang === "en";
      const text = (en ? "Hi Sebastián, my name is " : "Hola Sebastián, mi nombre es ") + name + ". " +
        (en ? "I'm interested in: " : "Me interesa: ") + service + "." + (msg ? (en ? " My case: " : " Mi caso: ") + msg : "");
      if (window.srmTrack) window.srmTrack("whatsapp", { event_label: "formulario-contacto" });
      window.open(waUrl(text), "_blank", "noopener");
    });
  }

  /* ---------------- Video ---------------- */
  function initVideo() {
    const v = $("#recoveryVideo"); if (!v) return;
    v.addEventListener("click", () => { v.muted = !v.muted; if (v.paused) v.play(); });
    v.title = "Clic para activar / silenciar el sonido";
    if ("IntersectionObserver" in window) {
      const io = new IntersectionObserver(entries => { entries.forEach(en => { en.isIntersecting ? v.play().catch(() => {}) : v.pause(); }); }, { threshold: 0.25 });
      io.observe(v);
    }
  }

  /* ---------------- Parallax suave en hero ---------------- */
  function initParallax() {
    const img = $(".hero-photo img"); if (!img || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    window.addEventListener("scroll", () => { const y = window.scrollY; if (y < 800) img.style.transform = "scale(1.08) translateY(" + y * 0.08 + "px)"; }, { passive: true });
  }

  /* ---------------- Medición: Google Ads / GA4 / Meta Pixel ---------------- */
  // Las etiquetas solo se cargan si hay un ID en config.js. Expone window.srmTrack(evento) para los formularios.
  function initTracking() {
    const T = CFG.tracking || {}; const ids = [T.googleTagId, T.ga4Id].filter(Boolean);
    if (ids.length) {
      const sc = document.createElement("script"); sc.async = true; sc.src = "https://www.googletagmanager.com/gtag/js?id=" + ids[0]; document.head.appendChild(sc);
      window.dataLayer = window.dataLayer || []; window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag("js", new Date()); ids.forEach(id => window.gtag("config", id));
    }
    if (T.metaPixelId) {
      /* Código oficial del píxel de Meta */
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      window.fbq("init", T.metaPixelId); window.fbq("track", "PageView");
    }
    const conv = T.conversions || {};
    // Registra una conversión en todas las plataformas configuradas
    window.srmTrack = function (evento, extra) {
      const label = conv[evento];
      if (window.gtag) {
        if (T.googleTagId && label) window.gtag("event", "conversion", Object.assign({ send_to: T.googleTagId + "/" + label }, extra || {}));
        window.gtag("event", evento, extra || {});
      }
      if (window.fbq) {
        const meta = { whatsapp: "Contact", llamada: "Contact", curso: "Lead" }[evento] || "Lead";
        window.fbq("track", meta, extra || {});
      }
    };
    // Clics en WhatsApp y teléfono (botones, enlaces y formulario de contacto)
    document.addEventListener("click", e => {
      const a = e.target.closest("a"); if (!a) return;
      const h = a.getAttribute("href") || "";
      if (a.hasAttribute("data-wa") || /wa\.me|api\.whatsapp\.com/.test(h)) window.srmTrack("whatsapp", { event_label: a.getAttribute("data-wa") || h });
      else if (/^tel:/.test(h)) window.srmTrack("llamada", { event_label: h });
    }, true);
  }

  /* ---------------- Inicio ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    cacheOriginals();
    applyConfig();
    applyLang();
    $$(".lang-toggle button").forEach(b => b.addEventListener("click", () => setLang(b.dataset.lang)));
    initTracking(); initHeader(); initReveal(); initCounters(); initCarousel(); initAccordion(); initForm(); initVideo(); initParallax();
  });
})();
