(function () {
  if (window.__studioInit) return; window.__studioInit = true;
  function start() {
    if (!window.gsap || !window.ScrollTrigger) { return setTimeout(start, 40); }
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) { return; }
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    var hasSplit = !!window.SplitText;

    // Lenis smooth scroll, synced to ScrollTrigger (graceful if absent)
    if (window.Lenis) {
      var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true });
      lenis.on('scroll', window.ScrollTrigger.update);
      gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
      gsap.ticker.lagSmoothing(0);
    }

    function q(sel) { return Array.prototype.slice.call(document.querySelectorAll(sel)); }
    function block(el) { return el.closest('[data-block]') || el; }

    // Parallax media — drifts within an over-sized frame
    q('[data-animate~="parallax"]').forEach(function (el) {
      var s = parseFloat(el.getAttribute('data-speed') || '18');
      gsap.fromTo(el, { yPercent: -s / 2 }, { yPercent: s / 2, ease: 'none',
        scrollTrigger: { trigger: block(el), start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Drifting titles (opposite directions) + a soft entrance
    function drift(sel, from, to) {
      q(sel).forEach(function (el) {
        gsap.fromTo(el, { xPercent: from }, { xPercent: to, ease: 'none',
          scrollTrigger: { trigger: block(el), start: 'top bottom', end: 'bottom top', scrub: true } });
        gsap.from(el, { opacity: 0, y: 36, duration: 1.2, ease: 'power3.out' });
      });
    }
    drift('[data-animate~="move-fw"]', 7, -7);
    drift('[data-animate~="move-bw"]', -7, 7);

    // Masked line reveal via SplitText (falls back to fade if unavailable)
    q('[data-animate~="reveal"]').forEach(function (el) {
      var run = function () {
        if (hasSplit) {
          var split = new window.SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'studio-line' });
          gsap.from(split.lines, { yPercent: 115, opacity: 0, duration: 1.1, ease: 'expo.out', stagger: 0.12,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        } else {
          gsap.from(el, { y: 40, opacity: 0, duration: 1, ease: 'power3.out',
            scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
        }
      };
      if (document.fonts && document.fonts.ready) { document.fonts.ready.then(run); } else { run(); }
    });

    // Generic fade-up
    q('[data-animate~="fade-up"]').forEach(function (el) {
      gsap.from(el, { y: 44, opacity: 0, duration: 1, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 90%', once: true } });
    });

    // Image wipe-reveal (clip up + subtle scale) on enter
    q('[data-animate~="reveal-img"]').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(0 0 100% 0)', scale: 1.08 },
        { clipPath: 'inset(0 0 0% 0)', scale: 1, duration: 1.2, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
    });

    // Marquee — oversized text drifts horizontally on scroll; data-dir flips direction.
    q('[data-animate~="marquee"]').forEach(function (el) {
      var bw = el.getAttribute('data-dir') === 'bw';
      gsap.fromTo(el, { xPercent: bw ? -28 : 4 }, { xPercent: bw ? 4 : -28, ease: 'none',
        scrollTrigger: { trigger: block(el), start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Zoom — slow Ken-Burns scale as the image scrolls through its frame.
    q('[data-animate~="zoom"]').forEach(function (el) {
      gsap.fromTo(el, { scale: 1 }, { scale: 1.16, ease: 'none',
        scrollTrigger: { trigger: el.parentElement || el, start: 'top bottom', end: 'bottom top', scrub: true } });
    });

    // Horizontal track — pin the block, translate the row by its overflow width.
    q('[data-animate~="track-x"]').forEach(function (el) {
      var blk = block(el);
      var dist = el.scrollWidth - window.innerWidth;
      if (dist <= 0) return; // fits on screen → leave as a normal row
      gsap.to(el, { x: -dist, ease: 'none',
        scrollTrigger: { trigger: blk, start: 'top top', end: function () { return '+=' + dist; },
          scrub: true, pin: true, anticipatePin: 1, invalidateOnRefresh: true } });
    });

    // Before/after compare — the top image wipes away on scroll to reveal the one beneath.
    q('[data-animate~="compare"]').forEach(function (el) {
      gsap.fromTo(el, { clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 0 100%)', ease: 'none',
        scrollTrigger: { trigger: block(el), start: 'top 75%', end: 'bottom 55%', scrub: true } });
    });

    // Count-up numbers
    q('[data-animate~="count"]').forEach(function (el) {
      var target = parseFloat(el.getAttribute('data-target') || '0');
      var suffix = el.getAttribute('data-suffix') || '';
      var prefix = el.getAttribute('data-prefix') || '';
      var o = { v: 0 };
      gsap.to(o, { v: target, duration: 2, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        onUpdate: function () { el.textContent = prefix + Math.round(o.v).toLocaleString() + suffix; } });
    });

    // Filter groups — click a pill to show/hide tiles by data-cat (portfolio-grid).
    q('[data-filter-group]').forEach(function (group) {
      var btns = Array.prototype.slice.call(group.querySelectorAll('[data-filter]'));
      var grid = group.querySelector('[data-filter-grid]');
      if (!grid) return;
      btns.forEach(function (btn) {
        btn.addEventListener('click', function () {
          var cat = btn.getAttribute('data-filter');
          btns.forEach(function (b) { b.classList[b === btn ? 'add' : 'remove']('is-active'); });
          Array.prototype.slice.call(grid.querySelectorAll('[data-cat]')).forEach(function (tile) {
            tile.style.display = (cat === '*' || tile.getAttribute('data-cat') === cat) ? '' : 'none';
          });
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        });
      });
    });

    window.ScrollTrigger.refresh();
  }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', start); } else { start(); }
})();

(function () {
  if (window.__studioChrome) return; window.__studioChrome = true;
  var pre = document.querySelector('.studio-preloader');
  var bar = pre && pre.querySelector('.studio-preloader-bar span');
  var page = document.querySelector('.studio-page');
  var pct = 0, tick = setInterval(function () { pct = Math.min(96, pct + Math.random() * 28); if (bar) bar.style.width = pct + '%'; }, 130);
  var revealed = false;
  function reveal() {
    if (revealed) return; revealed = true;
    clearInterval(tick); if (bar) bar.style.width = '100%';
    setTimeout(function () { if (pre) pre.classList.add('is-done'); if (page) page.classList.add('is-in'); if (window.ScrollTrigger) window.ScrollTrigger.refresh(); }, 260);
  }
  if (document.readyState === 'complete') reveal(); else window.addEventListener('load', reveal);
  setTimeout(reveal, 3000); // never trap the page

  var totop = document.querySelector('.studio-totop');
  if (totop) {
    var onScroll = function () { totop.classList[window.scrollY > 600 ? 'add' : 'remove']('is-on'); };
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
  }

  var cur = document.querySelector('.studio-cursor');
  var fine = window.matchMedia('(hover:hover) and (pointer:fine)').matches;
  var reduce = window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  if (cur && fine && !reduce) {
    var x = 0, y = 0, cx = 0, cy = 0;
    document.addEventListener('mousemove', function (e) { x = e.clientX; y = e.clientY; cur.style.opacity = '1'; }, { passive: true });
    (function loop() { cx += (x - cx) * 0.18; cy += (y - cy) * 0.18; cur.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)'; requestAnimationFrame(loop); })();
    var INTERACTIVE = 'a,button,[data-filter],summary,.studio-ilrow,.studio-panel,.studio-hotword';
    document.addEventListener('mouseover', function (e) { if (e.target.closest(INTERACTIVE)) { cur.style.width = '58px'; cur.style.height = '58px'; cur.style.background = 'rgba(255,255,255,.14)'; } });
    document.addEventListener('mouseout', function (e) { if (e.target.closest(INTERACTIVE)) { cur.style.width = '34px'; cur.style.height = '34px'; cur.style.background = 'transparent'; } });
  }
})();
