/* Detección de proximidad del cursor para las estrellas fotográficas.
   Cerca → reacción leve + destellos · Encima → zoom máximo · Lejos → vuelve suave. */
(function () {
  'use strict';
  var A = window.AJUSTES || {};
  var root = document.documentElement;
  root.style.setProperty('--zoom', A.zoomFoto != null ? A.zoomFoto : 0.12);
  root.style.setProperty('--star-scale', A.escalaEstrella != null ? A.escalaEstrella : 0.05);

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var sp = function () { return window.ByNinis.sparkles; };
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-star]'));
  if (!els.length) return;

  var items = els.map(function (el) {
    return { el: el, clip: el.querySelector('.star-clip') || el, prox: 0, target: 0, tx: 0, ty: 0, last: 0, visible: false };
  });

  /* Solo calcular lo que está en pantalla */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      for (var i = 0; i < items.length; i++) if (items[i].el === e.target) items[i].visible = e.isIntersecting;
    });
  }, { rootMargin: '120px' });
  items.forEach(function (it) { io.observe(it.el); });

  /* Táctil / sin hover: ráfaga cuando la estrella entra en pantalla y al tocarla */
  if (!canHover) {
    var io2 = new IntersectionObserver(function (entries) {
      entries.forEach(function (e, n) {
        if (e.isIntersecting) {
          setTimeout(function () { sp().burst(e.target, 4); }, n * 180);
          io2.unobserve(e.target);
        }
      });
    }, { threshold: 0.6 });
    items.forEach(function (it) {
      io2.observe(it.el);
      it.el.addEventListener('pointerdown', function () { sp().burst(it.el, 5); });
    });
  }

  /* Teclado: el foco equivale a "cursor encima" */
  items.forEach(function (it) {
    it.el.addEventListener('focus', function () { it.el.classList.add('is-over', 'is-near'); it.el.style.setProperty('--prox', '1'); sp().burst(it.el, 4); });
    it.el.addEventListener('blur', function () { it.el.classList.remove('is-over', 'is-near'); it.el.style.setProperty('--prox', '0'); });
  });

  if (!canHover || reduce) return;

  var mouse = null, raf = 0;
  function schedule() { if (!raf) raf = requestAnimationFrame(tick); }

  window.addEventListener('pointermove', function (e) {
    if (e.pointerType === 'touch') return;
    mouse = { x: e.clientX, y: e.clientY };
    schedule();
  }, { passive: true });
  document.addEventListener('pointerleave', function () { mouse = null; schedule(); });
  window.addEventListener('blur', function () { mouse = null; schedule(); });

  function tick(now) {
    raf = 0;
    var moving = false, R = A.radioProximidad || 170, pull = A.movimientoImán || 7;
    items.forEach(function (it) {
      var t = 0, ttx = 0, tty = 0;
      if (mouse && it.visible) {
        var r = it.clip.getBoundingClientRect();
        var cx = r.left + r.width / 2, cy = r.top + r.height * 0.52, half = r.width / 2;
        var dx = mouse.x - cx, dy = mouse.y - cy, d = Math.hypot(dx, dy);
        var inner = half * 0.72;
        if (d <= inner) t = 1;
        else {
          t = Math.max(0, 1 - (d - inner) / R);
          t = t * 0.62;                            // zona cercana: reacción suave
        }
        if (t > 0 && d > 0) { ttx = (dx / d) * pull * t; tty = (dy / d) * pull * t; }
      }
      it.prox += (t - it.prox) * 0.14;
      it.tx += (ttx - it.tx) * 0.14;
      it.ty += (tty - it.ty) * 0.14;
      if (Math.abs(it.prox - t) < 0.002) it.prox = t;
      var s = it.el.style;
      s.setProperty('--prox', it.prox.toFixed(3));
      s.setProperty('--tx', it.tx.toFixed(2) + 'px');
      s.setProperty('--ty', it.ty.toFixed(2) + 'px');
      var near = it.prox > 0.18, over = it.prox > 0.8;
      it.el.classList.toggle('is-near', near);
      it.el.classList.toggle('is-over', over);
      if (near && now - it.last > (A.intervaloDestellos || 260)) {
        it.last = now;
        sp().burst(it.el, over ? Math.ceil((A.destellosPorRáfaga || 3) * 1.5) : 1);
      }
      if (it.prox !== t || t > 0) moving = true;
    });
    if (moving) schedule();
  }
})();
