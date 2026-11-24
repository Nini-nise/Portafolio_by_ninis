/* Destellos (miniestrellas SVG) y rastro de estrellas — optimizado: transform/opacity,
   límite de partículas y eliminación del DOM al terminar la animación. */
(function () {
  'use strict';
  var A = window.AJUSTES || {};
  var COLORS = ['#e18597', '#f9d6da', '#f3e6c5', '#560f18', '#f2b632'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var SVG = '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false"><use href="#spark"/></svg>';
  var rand = function (a, b) { return a + Math.random() * (b - a); };

  function make(sizeMin, sizeMax, dur) {
    var s = document.createElement('i');
    s.className = 'spark';
    s.innerHTML = SVG;
    s.style.setProperty('--s', rand(sizeMin, sizeMax).toFixed(1) + 'px');
    s.style.setProperty('--c', COLORS[(Math.random() * COLORS.length) | 0]);
    s.style.setProperty('--rot', rand(-80, 80).toFixed(0) + 'deg');
    s.style.setProperty('--dx', rand(-14, 14).toFixed(0) + 'px');
    s.style.setProperty('--dy', rand(-18, 6).toFixed(0) + 'px');
    s.style.setProperty('--dur', (dur * rand(0.8, 1.25)).toFixed(0) + 'ms');
    s.addEventListener('animationend', function () { s.remove(); }, { once: true });
    return s;
  }

  /* Ráfaga alrededor del contorno de una estrella fotográfica */
  function burst(frame, count) {
    if (reduce) return;
    var layer = frame.querySelector('.sparkle-layer');
    if (!layer) return;
    var room = (A.destellosMáximos || 14) - layer.childElementCount;
    count = Math.min(count || A.destellosPorRáfaga || 3, room);
    for (var i = 0; i < count; i++) {
      var s = make(14, 34, A.duraciónDestello || 1100);
      var ang = Math.random() * Math.PI * 2, r = rand(50, 76);
      s.style.left = (50 + Math.cos(ang) * r) + '%';
      s.style.top = (46 + Math.sin(ang) * r) + '%';
      layer.appendChild(s);
    }
  }

  /* Rastro del mouse */
  var trailLayer, alive = 0, lastT = 0;
  function trail(x, y) {
    if (reduce || A.rastroActivo === false) return;
    var now = performance.now();
    if (now - lastT < (A.rastroIntervalo || 55) || alive >= (A.rastroMáximo || 18)) return;
    lastT = now;
    if (!trailLayer) {
      trailLayer = document.createElement('div');
      trailLayer.className = 'trail-layer';
      trailLayer.setAttribute('aria-hidden', 'true');
      document.body.appendChild(trailLayer);
    }
    var s = make(8, 18, 900);
    s.classList.add('spark--trail');
    s.style.left = x + 'px'; s.style.top = y + 'px';
    alive++;
    s.addEventListener('animationend', function () { alive--; }, { once: true });
    trailLayer.appendChild(s);
  }

  window.ByNinis = window.ByNinis || {};
  window.ByNinis.sparkles = { burst: burst, trail: trail };
})();
