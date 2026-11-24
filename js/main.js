/* Navegación, contacto configurable, carpetas, copiar HEX y utilidades. */
(function () {
  'use strict';
  var A = window.AJUSTES || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

  /* ---------- Menú: sticky, hamburguesa, sección activa ---------- */
  var header = $('.site-header'), toggle = $('.nav-toggle'), nav = $('#menu');
  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
  }
  toggle.addEventListener('click', function () { setMenu(toggle.getAttribute('aria-expanded') !== 'true'); });
  nav.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); toggle.focus(); }
  });
  window.addEventListener('scroll', function () { header.classList.toggle('is-scrolled', window.scrollY > 30); }, { passive: true });

  var links = $$('.nav-link');
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      var key = e.target.dataset.nav;
      links.forEach(function (l) {
        var on = l.dataset.nav === key;
        l.classList.toggle('active', on);
        if (on) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  $$('main > section[data-nav]').forEach(function (s) { io.observe(s); });

  /* Botón volver arriba */
  var top = $('.to-top');
  window.addEventListener('scroll', function () { top.classList.toggle('show', window.scrollY > 700); }, { passive: true });
  $$('[data-top]').forEach(function (b) {
    b.addEventListener('click', function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
      $('#inicio h1').focus({ preventScroll: true });
    });
  });

  /* ---------- Contacto: todo se lee desde config.js ---------- */
  function handle(v) { return v.replace(/^@/, '').replace(/\s+/g, ''); }
  function buildURL(key, raw) {
    var v = (raw || '').trim();
    if (!v) return null;
    var isUrl = /^https?:\/\//i.test(v);
    switch (key) {
      case 'email': v = v.replace(/^mailto:/i, ''); return /^\S+@\S+\.\S+$/.test(v) ? 'mailto:' + v : null;
      case 'whatsapp': if (isUrl) return v; var d = v.replace(/\D/g, ''); return d ? 'https://wa.me/' + d : null;
      case 'instagram': return isUrl ? v : 'https://instagram.com/' + handle(v);
      case 'tiktok': return isUrl ? v : 'https://www.tiktok.com/@' + handle(v);
      case 'linkedin': return isUrl ? v : 'https://www.linkedin.com/in/' + handle(v);
      case 'behance': return isUrl ? v : 'https://www.behance.net/' + handle(v);
    }
    return isUrl ? v : null;
  }
  function enable(a, url) {
    a.href = url;
    a.removeAttribute('aria-disabled'); a.removeAttribute('role'); a.classList.remove('is-disabled');
    if (/^mailto:/.test(url)) { a.removeAttribute('target'); a.removeAttribute('rel'); }
    else { a.target = '_blank'; a.rel = 'noopener noreferrer'; }
    var t = a.querySelector('.soon'); if (t) t.remove();
    a.removeAttribute('title');
  }
  function disable(a) {
    a.removeAttribute('href'); a.removeAttribute('target');
    a.setAttribute('role', 'link'); a.setAttribute('aria-disabled', 'true');
    a.classList.add('is-disabled'); a.title = 'Próximamente';
    if (!a.querySelector('.soon')) { var s = document.createElement('span'); s.className = 'sr-only soon'; s.textContent = ' (próximamente)'; a.appendChild(s); }
  }
  var cfg = {}; try { cfg = CONTACTO || {}; } catch (err) { cfg = {}; }
  $$('[data-contact]').forEach(function (a) {
    var url = buildURL(a.dataset.contact, cfg[a.dataset.contact]);
    url ? enable(a, url) : disable(a);
  });
  var cta = $$('[data-contact-cta]');
  var order = ['whatsapp', 'instagram', 'email', 'tiktok', 'linkedin', 'behance'], best = null;
  for (var i = 0; i < order.length && !best; i++) { var u = buildURL(order[i], cfg[order[i]]); if (u) best = u; }
  cta.forEach(function (a) { best ? enable(a, best) : disable(a); });
  document.addEventListener('click', function (e) {
    var d = e.target.closest('a[aria-disabled="true"]'); if (d) e.preventDefault();
  });

  /* ---------- Carpetas: abrir y viajar a la sección ---------- */
  var dur = A.duraciónTransición || 650;
  $$('[data-folder-link]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      if (e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
      var id = el.getAttribute('href'), target = id && id.charAt(0) === '#' ? $(id) : null;
      if (!target) return;
      e.preventDefault();
      function go() {
        target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
        history.pushState(null, '', id);
        target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
        setTimeout(function () { el.classList.remove('is-open'); }, 900);
      }
      if (reduce) return go();
      el.classList.add('is-open');
      setTimeout(go, dur);
    });
  });

  /* Táctil: la carpeta se "entreabre" al aparecer en pantalla */
  if (!window.matchMedia('(hover: hover)').matches && 'IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('is-peek', e.isIntersecting); });
    }, { threshold: 0.7 });
    $$('.folder').forEach(function (f) { io2.observe(f); });
  }

  /* Carpeta de la portada: clic/toque abre y cierra */
  $$('[data-hero-toggle]').forEach(function (b) {
    b.addEventListener('click', function () {
      var f = b.closest('.hero-folder'), on = !f.classList.contains('is-open');
      f.classList.toggle('is-open', on); b.setAttribute('aria-pressed', String(on));
    });
  });

  /* Portafolio: la carpeta se inclina suavemente hacia el cursor */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduce) {
    $$('.port-art').forEach(function (a) {
      var raf = 0, px = 0, py = 0;
      a.addEventListener('pointermove', function (e) {
        var r = a.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * 2; py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!raf) raf = requestAnimationFrame(function () { raf = 0; a.style.setProperty('--rx', px.toFixed(3)); a.style.setProperty('--ry', py.toFixed(3)); });
      }, { passive: true });
      a.addEventListener('pointerleave', function () { a.style.setProperty('--rx', 0); a.style.setProperty('--ry', 0); });
    });
  }

  /* ---------- Rastro de estrellas (portafolio) ---------- */
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) {
    $$('[data-trail]').forEach(function (s) {
      s.addEventListener('pointermove', function (e) {
        if (e.pointerType !== 'touch') window.ByNinis.sparkles.trail(e.clientX, e.clientY);
      }, { passive: true });
    });
  }

  /* ---------- Copiar HEX ---------- */
  var toast = $('#toast');
  function say(msg) { toast.textContent = msg; toast.classList.add('show'); clearTimeout(say.t); say.t = setTimeout(function () { toast.classList.remove('show'); }, 1800); }
  $$('[data-copy]').forEach(function (b) {
    b.addEventListener('click', function () {
      var hex = b.dataset.copy;
      function ok() { say('Copiado ' + hex); }
      if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(hex).then(ok, ok);
      else { var t = document.createElement('textarea'); t.value = hex; document.body.appendChild(t); t.select(); try { document.execCommand('copy'); } catch (x) {} t.remove(); ok(); }
    });
  });

  $$('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
})();
