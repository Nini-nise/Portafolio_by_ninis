/* Aparición por scroll, parallax (mouse + scroll) y pausa de animaciones fuera de pantalla. */
(function () {
  'use strict';
  var A = window.AJUSTES || {};
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var root = document.documentElement;
  root.style.setProperty('--par', reduce ? 0 : (A.intensidadParallax != null ? A.intensidadParallax : 1));

  document.querySelectorAll('[data-depth]').forEach(function (el) { el.style.setProperty('--depth', el.getAttribute('data-depth')); });

  /* 1 · Revelado al hacer scroll */
  var rev = document.querySelectorAll('.reveal, .reveal-wipe');
  if (reduce || !('IntersectionObserver' in window)) {
    rev.forEach(function (el) { el.classList.add('in'); });
  } else {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
    rev.forEach(function (el) { io.observe(el); });
  }

  /* 2 · Pausar animaciones decorativas fuera de pantalla */
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.target.classList.toggle('is-offscreen', !e.isIntersecting); });
    }, { rootMargin: '80px' });
    document.querySelectorAll('.stage').forEach(function (s) { io2.observe(s); });
  }
  if (reduce) return;

  var secs = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var vis = new Set();
  if ('IntersectionObserver' in window) {
    var io3 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { e.isIntersecting ? vis.add(e.target) : vis.delete(e.target); });
    });
    secs.forEach(function (s) { io3.observe(s); });
  }

  /* 3 · Parallax con el mouse (solo dispositivos con cursor) */
  if (canHover) {
    secs.forEach(function (s) {
      var raf = 0, px = 0, py = 0;
      s.addEventListener('pointermove', function (e) {
        var r = s.getBoundingClientRect();
        px = ((e.clientX - r.left) / r.width - 0.5) * 2;
        py = ((e.clientY - r.top) / r.height - 0.5) * 2;
        if (!raf) raf = requestAnimationFrame(function () {
          raf = 0; s.style.setProperty('--mx', px.toFixed(3)); s.style.setProperty('--my', py.toFixed(3));
        });
      }, { passive: true });
      s.addEventListener('pointerleave', function () { s.style.setProperty('--mx', 0); s.style.setProperty('--my', 0); });
    });
  }

  /* 4 · Parallax con el scroll */
  var ticking = false;
  function onScroll() {
    if (ticking) return; ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      var vh = window.innerHeight;
      vis.forEach(function (s) {
        var r = s.getBoundingClientRect();
        s.style.setProperty('--sy', (((r.top + r.height / 2) - vh / 2) / vh).toFixed(3));
      });
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();
