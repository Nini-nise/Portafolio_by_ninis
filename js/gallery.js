/* Galería ampliable (lightbox) accesible: teclado, Escape, flechas, swipe y gestión de foco. */
(function () {
  'use strict';
  var box = document.getElementById('lightbox');
  if (!box) return;
  var img = box.querySelector('.lb-img'), cap = box.querySelector('.lb-caption'),
      count = box.querySelector('.lb-count'), btnClose = box.querySelector('.lb-close'),
      btnPrev = box.querySelector('.lb-prev'), btnNext = box.querySelector('.lb-next');
  var list = [], idx = 0, opener = null;

  function group(name) {
    return Array.prototype.slice.call(document.querySelectorAll('[data-gallery="' + name + '"][data-full]'));
  }
  function show(i) {
    idx = (i + list.length) % list.length;
    var it = list[idx];
    box.classList.add('is-loading');
    img.onload = function () { box.classList.remove('is-loading'); };
    img.src = it.dataset.full;
    img.alt = it.dataset.alt || '';
    cap.textContent = it.dataset.alt || '';
    count.textContent = (idx + 1) + ' / ' + list.length;
    var multi = list.length > 1;
    btnPrev.hidden = btnNext.hidden = !multi;
    if (multi) { var n = new Image(); n.src = list[(idx + 1) % list.length].dataset.full; }
  }
  function open(el) {
    list = group(el.dataset.gallery);
    if (!list.length) return;
    opener = el;
    show(Math.max(0, list.indexOf(el)));
    box.hidden = false;
    requestAnimationFrame(function () { box.classList.add('is-open'); });
    document.body.classList.add('no-scroll');
    btnClose.focus();
  }
  function close() {
    box.classList.remove('is-open');
    document.body.classList.remove('no-scroll');
    setTimeout(function () { box.hidden = true; img.removeAttribute('src'); }, 220);
    if (opener) opener.focus({ preventScroll: true });
  }

  document.addEventListener('click', function (e) {
    var mini = e.target.closest('[data-open-id]');
    if (mini) { var t = document.getElementById(mini.dataset.openId); if (t) open(t); return; }
    var el = e.target.closest('[data-gallery][data-full]');
    if (el) { e.preventDefault(); open(el); }
  });
  document.addEventListener('keydown', function (e) {
    var el = e.target.closest && e.target.closest('[data-gallery][data-full]');
    if (el && (e.key === 'Enter' || e.key === ' ') && el.getAttribute('role') === 'button') { e.preventDefault(); open(el); return; }
    if (box.hidden) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'Tab') {                       // trampa de foco
      var f = [btnClose, btnPrev, btnNext].filter(function (b) { return !b.hidden; });
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  btnClose.addEventListener('click', close);
  btnPrev.addEventListener('click', function () { show(idx - 1); });
  btnNext.addEventListener('click', function () { show(idx + 1); });
  box.addEventListener('click', function (e) { if (e.target === box || e.target.classList.contains('lb-stage')) close(); });

  /* Swipe en móviles */
  var sx = null;
  box.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  box.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx; sx = null;
    if (Math.abs(dx) > 50 && list.length > 1) show(idx + (dx < 0 ? 1 : -1));
  });
})();
