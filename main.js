/* PRIME — site behaviour.
 *
 * Three things, no dependencies: reveal-on-scroll, the progress rail, and the
 * day ring in the hero. Everything degrades to a perfectly readable page if
 * this file fails to load.
 */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ───────────────────────────────────────────── reveal on scroll ── */

  var revealables = document.querySelectorAll('.reveal');

  if (reduceMotion || !('IntersectionObserver' in window)) {
    // No observer, or motion is unwelcome: show everything immediately. A
    // page that hides its content behind an animation it cannot run is a
    // blank page.
    revealables.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        observer.unobserve(entry.target); // reveal once, not on every pass
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });

    revealables.forEach(function (el) { observer.observe(el); });
  }

  /* ──────────────────────────────────────── progress rail + sticky nav ── */

  var fill = document.getElementById('scrollFill');
  var nav = document.getElementById('nav');
  var ticking = false;

  function onScroll() {
    var scrolled = window.scrollY;
    var height = document.documentElement.scrollHeight - window.innerHeight;
    if (fill) fill.style.width = (height > 0 ? (scrolled / height) * 100 : 0) + '%';
    if (nav) nav.classList.toggle('is-stuck', scrolled > 8);
    ticking = false;
  }

  // rAF-throttled: a scroll handler that runs on every event is the classic
  // way to make a smooth page feel cheap.
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(onScroll);
  }, { passive: true });
  onScroll();

  /* ───────────────────────────────────────────────────── the day ring ── */

  var canvas = document.getElementById('dayRing');
  if (canvas && canvas.getContext) {
    var ctx = canvas.getContext('2d');

    var SAGE = '#4F8E7C', TERRACOTTA = '#D97551', INDIGO = '#5E6AB8',
        AMBER = '#D99A2B', VIOLET = '#7E6BB0';

    // One colour per hour, 00–23. The same sequence the app's icon and its
    // opening animation use: sleep through the night, deep work through the
    // morning, meals at midday.
    var HOURS = [
      VIOLET, VIOLET, VIOLET, VIOLET, VIOLET, VIOLET,
      AMBER, AMBER,
      INDIGO, INDIGO, INDIGO, INDIGO,
      AMBER, AMBER,
      INDIGO, INDIGO, TERRACOTTA, TERRACOTTA,
      AMBER, SAGE,
      INDIGO, SAGE,
      VIOLET, VIOLET
    ];

    var size = canvas.width;
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    var centre = size / 2;
    var radius = size * 0.40;
    var stroke = size * 0.052;
    var step = (Math.PI * 2) / 24;
    var gap = step * 0.17;

    function draw(progress) {
      ctx.clearRect(0, 0, size, size);
      ctx.lineCap = 'round';
      ctx.lineWidth = stroke;

      var landed = progress * 24;
      for (var hour = 0; hour < 24; hour++) {
        var amount = Math.max(0, Math.min(1, landed - hour));
        if (amount <= 0) continue;

        var start = -Math.PI / 2 + step * hour + gap / 2;
        ctx.strokeStyle = HOURS[hour];
        ctx.globalAlpha = 0.34 + amount * 0.62;
        ctx.lineWidth = stroke * amount;

        ctx.beginPath();
        // Each arc grows from its own leading edge rather than fading in, so
        // the ring reads as assembling rather than appearing.
        ctx.arc(centre, centre, radius, start, start + (step - gap) * amount);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
    }

    var DURATION = 1500;
    var finished = false;

    function run() {
      if (finished) return;
      var began = null;
      requestAnimationFrame(function tick(now) {
        if (began === null) began = now;
        var t = Math.min(1, (now - began) / DURATION);
        draw(1 - Math.pow(1 - t, 3)); // easeOutCubic
        if (t < 1) {
          requestAnimationFrame(tick);
        } else {
          finished = true;
        }
      });
    }

    if (reduceMotion || document.hidden) {
      // A hidden tab throttles requestAnimationFrame, which would leave the
      // ring frozen part-drawn the moment the user switched to it. Start
      // complete instead, and only animate for someone actually watching.
      draw(1);
      finished = true;
    } else {
      run();
    }

    // If the tab is backgrounded mid-animation the loop stalls, so snap to the
    // finished state rather than showing a broken ring on return.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden && !finished) {
        draw(1);
        finished = true;
      }
    });
  }

  /* ───────────────────────────────────────────────────────── footer ── */

  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
