/* SuperAudio console reskin — shared canvas/reveal/waitlist runtime.
   Every block is element-guarded, so each page runs only what it contains.
   Loaded once from Console.astro. Waitlist posts to window.SLF (analytics.js). */
(function () {
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function css(v) { return (getComputedStyle(document.documentElement).getPropertyValue(v) || '').trim(); }
  function fit(cv) {
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var r = cv.getBoundingClientRect();
    cv.width = Math.max(1, r.width * dpr); cv.height = Math.max(1, r.height * dpr);
    var ctx = cv.getContext('2d'); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx: ctx, w: r.width, h: r.height };
  }

  /* ---- hero oscilloscope (filled trace + signal-lock ramp) ---- */
  var hero = document.getElementById('heroScope');
  if (hero) {
    var amp = { v: 0.08, target: 1 }, lockText = document.getElementById('lockText'), locked = false;
    function heroDraw(t) {
      var d = fit(hero), ctx = d.ctx, W = d.w, H = d.h, col = css('--accent') || '#46d4e6', line = css('--line') || '#22303a';
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = line; ctx.globalAlpha = .4; ctx.lineWidth = 1;
      for (var gx = 0; gx < W; gx += 64) { ctx.beginPath(); ctx.moveTo(gx, 0); ctx.lineTo(gx, H); ctx.stroke(); }
      ctx.globalAlpha = 1;
      var mid = H * 0.5, a = Math.min(H * 0.21, 128) * amp.v, pts = [];
      for (var x = 0; x <= W; x += 2) {
        var y = mid
          + Math.sin(x * 0.012 + t * 0.9) * a * 0.55
          + Math.sin(x * 0.03 - t * 1.3) * a * 0.28
          + Math.sin(x * 0.08 + t * 2.1) * a * 0.13
          + Math.exp(-Math.pow((x - (W * 0.5 + Math.sin(t * 0.7) * W * 0.18)) / 40, 2)) * a * 0.7;
        pts.push([x, y]);
      }
      var g = ctx.createLinearGradient(0, mid - a, 0, H); g.addColorStop(0, col); g.addColorStop(1, 'transparent');
      ctx.globalAlpha = .16; ctx.fillStyle = g; ctx.beginPath(); ctx.moveTo(0, H);
      pts.forEach(function (p) { ctx.lineTo(p[0], p[1]); }); ctx.lineTo(W, H); ctx.closePath(); ctx.fill();
      ctx.globalAlpha = 1; ctx.lineWidth = 2.4; ctx.strokeStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 14;
      ctx.beginPath(); pts.forEach(function (p, i) { if (i === 0) ctx.moveTo(p[0], p[1]); else ctx.lineTo(p[0], p[1]); });
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    if (reduce) { amp.v = 1; if (lockText) lockText.textContent = 'Signal locked · 3 rooms'; heroDraw(.5); }
    else {
      var hs = null;
      requestAnimationFrame(function loop(ts) {
        if (hs === null) hs = ts; var t = (ts - hs) / 1000;
        amp.v += (amp.target - amp.v) * 0.03;
        if (!locked && lockText && t > 1.25) { locked = true; lockText.textContent = 'Signal locked · 3 rooms'; }
        heroDraw(t); requestAnimationFrame(loop);
      });
    }
  }

  /* ---- brand-mark mini scope ---- */
  var mk = document.getElementById('markScope');
  if (mk) {
    function mkDraw(t) {
      mk.width = 52; mk.height = 52; var ctx = mk.getContext('2d'); ctx.clearRect(0, 0, 52, 52);
      var col = css('--accent') || '#46d4e6'; ctx.strokeStyle = col; ctx.lineWidth = 1.6; ctx.shadowColor = col; ctx.shadowBlur = 6;
      ctx.beginPath();
      for (var x = 0; x <= 52; x += 2) { var y = 26 + Math.sin(x * 0.34 + t * 2.4) * 7 * Math.exp(-Math.pow((x - 26) / 18, 2)); if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y); }
      ctx.stroke(); ctx.shadowBlur = 0;
    }
    if (reduce) { mkDraw(.4); }
    else { var ms = null; requestAnimationFrame(function l(ts) { if (ms === null) ms = ts; mkDraw((ts - ms) / 1000); requestAnimationFrame(l); }); }
  }

  /* ---- animated favicon: the brand mini-scope, live in the browser tab.
     Repaints a 64px canvas ~12fps and swaps <link rel="icon">. Static
     favicon.svg stays the fallback for reduced-motion, Safari, and first paint. */
  (function () {
    if (reduce) return;
    var link = document.querySelector('link[rel="icon"]');
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'icon'); document.head.appendChild(link); }
    var fc = document.createElement('canvas'); fc.width = 64; fc.height = 64;
    var fx = fc.getContext('2d'); if (!fx) return;
    var CY = '#46d4e6', BG = '#0c1319', BR = '#2f424e';
    function rr(x, y, w, h, r) { fx.beginPath(); fx.moveTo(x + r, y); fx.arcTo(x + w, y, x + w, y + h, r); fx.arcTo(x + w, y + h, x, y + h, r); fx.arcTo(x, y + h, x, y, r); fx.arcTo(x, y, x + w, y, r); fx.closePath(); }
    function drawFav(t) {
      fx.clearRect(0, 0, 64, 64);
      rr(4, 4, 56, 56, 15); fx.fillStyle = BG; fx.fill();
      rr(4, 4, 56, 56, 15); fx.lineWidth = 2; fx.strokeStyle = BR; fx.stroke();
      rr(4, 4, 56, 56, 15); fx.save(); fx.clip();
      fx.strokeStyle = CY; fx.lineWidth = 3.4; fx.lineCap = 'round'; fx.lineJoin = 'round'; fx.shadowColor = CY; fx.shadowBlur = 6;
      fx.beginPath();
      for (var x = 0; x <= 64; x += 2) { var xr = x * 52 / 64; var y = 32 + Math.sin(xr * 0.34 + t * 2.4) * 11 * Math.exp(-Math.pow((xr - 26) / 18, 2)); if (x === 0) fx.moveTo(x, y); else fx.lineTo(x, y); }
      fx.stroke(); fx.shadowBlur = 0; fx.restore();
    }
    var last = 0, fs = null;
    requestAnimationFrame(function loop(ts) {
      if (!document.hidden) {
        if (fs === null) fs = ts;
        if (ts - last > 80) { last = ts; drawFav((ts - fs) / 1000); try { link.setAttribute('href', fc.toDataURL('image/png')); } catch (e) { } }
      }
      requestAnimationFrame(loop);
    });
  })();

  /* ---- signal-path diagram (landing) ---- */
  var pc = document.getElementById('pathCanvas');
  if (pc) {
    function bez(a, b, c, d, t) { var mt = 1 - t; return mt * mt * mt * a + 3 * mt * mt * t * b + 3 * mt * t * t * c + t * t * t * d; }
    function pathDraw(t) {
      var d = fit(pc), ctx = d.ctx, W = d.w, H = d.h, col = css('--accent'), line = css('--line-bright'), dim = css('--ink-faint');
      ctx.clearRect(0, 0, W, H);
      var yMid = H * 0.5, x0 = W * 0.10, xApp = W * 0.5, x1 = W * 0.90;
      function node(x, label, r) {
        ctx.fillStyle = css('--surface2'); ctx.strokeStyle = line; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(x, yMid, r, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = dim; ctx.font = '600 10px ui-monospace,Menlo,monospace'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(label, x, yMid);
      }
      var targets = [yMid - H * 0.28, yMid, yMid + H * 0.28];
      ctx.strokeStyle = line; ctx.lineWidth = 1.4; ctx.globalAlpha = .7;
      ctx.beginPath(); ctx.moveTo(x0, yMid); ctx.lineTo(xApp, yMid); ctx.stroke();
      targets.forEach(function (ty) { ctx.beginPath(); ctx.moveTo(xApp, yMid); ctx.bezierCurveTo((xApp + x1) / 2, yMid, (xApp + x1) / 2, ty, x1, ty); ctx.stroke(); });
      ctx.globalAlpha = 1; ctx.fillStyle = col; ctx.shadowColor = col; ctx.shadowBlur = 10;
      var p = (t * 0.33) % 1, sx = x0 + (xApp - x0) * p;
      ctx.beginPath(); ctx.arc(sx, yMid, 3, 0, Math.PI * 2); ctx.fill();
      targets.forEach(function (ty, i) {
        var pp = ((t * 0.33) + i * 0.06) % 1;
        var bx = bez(xApp, (xApp + x1) / 2, (xApp + x1) / 2, x1, pp), by = bez(yMid, yMid, ty, ty, pp);
        ctx.beginPath(); ctx.arc(bx, by, 3, 0, Math.PI * 2); ctx.fill();
      });
      ctx.shadowBlur = 0;
      node(x0, 'SRC', 18); node(xApp, 'S▸A', 26);
      targets.forEach(function (ty) { ctx.fillStyle = col; ctx.beginPath(); ctx.arc(x1, ty, 4, 0, Math.PI * 2); ctx.fill(); });
      ctx.fillStyle = dim; ctx.font = '600 10px ui-monospace,Menlo,monospace';
      ctx.textAlign = 'left'; ctx.fillText('CAPTURE', x0 - 14, yMid + 34);
      ctx.textAlign = 'center'; ctx.fillText('SUPERAUDIO', xApp, yMid + 42);
      ctx.textAlign = 'right'; ctx.fillText('SPEAKERS', x1 + 10, yMid + H * 0.28 + 22);
    }
    if (reduce) { pathDraw(1.2); }
    else { var ps = null; requestAnimationFrame(function loop(ts) { if (ps === null) ps = ts; pathDraw((ts - ps) / 1000); requestAnimationFrame(loop); }); }
  }

  /* ---- measurement VU (landing) ---- */
  var vu = document.getElementById('vuCanvas');
  if (vu) {
    var chans = [{ n: 'B&W A5', lag: .32 }, { n: 'B&W A7', lag: .55 }, { n: 'Sonos', lag: .88 }];
    function roundRect(ctx, x, y, w, h, r) { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); }
    function vuDraw(t) {
      var d = fit(vu), ctx = d.ctx, W = d.w, H = d.h, dim = css('--ink-faint');
      ctx.clearRect(0, 0, W, H);
      var padL = 86, padR = 24, rowH = H / (chans.length + 0.5), top = rowH * 0.55;
      chans.forEach(function (c, i) {
        var y = top + i * rowH, bw = W - padL - padR;
        ctx.fillStyle = dim; ctx.font = '600 12px ui-monospace,Menlo,monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
        ctx.fillText(c.n, 18, y);
        ctx.fillStyle = css('--raise'); roundRect(ctx, padL, y - 7, bw, 14, 7); ctx.fill();
        var live = c.lag + Math.sin(t * 2 + i) * 0.02, segs = 26, lit = Math.round(segs * Math.max(0, Math.min(1, live)));
        for (var s = 0; s < segs; s++) {
          var sx = padL + (bw / segs) * s + 1.5, sw = (bw / segs) - 3, on = s < lit;
          var col = s < segs * 0.6 ? css('--good') : (s < segs * 0.82 ? css('--warn') : css('--accent'));
          ctx.fillStyle = on ? col : css('--surface'); ctx.globalAlpha = on ? 1 : .5;
          ctx.fillRect(sx, y - 5, Math.max(1, sw), 10);
        }
        ctx.globalAlpha = 1;
        ctx.fillStyle = css('--accent'); ctx.font = '700 11px ui-monospace,Menlo,monospace'; ctx.textAlign = 'right';
        ctx.fillText(Math.round(live * 3050) + 'ms', W - 8, y - 14);
      });
    }
    if (reduce) { vuDraw(0.5); }
    else { var vs = null; requestAnimationFrame(function loop(ts) { if (vs === null) vs = ts; vuDraw((ts - vs) / 1000); requestAnimationFrame(loop); }); }
  }

  /* ---- status ticker (landing) ---- */
  var tt = document.getElementById('tickTrack');
  if (tt) {
    var items = [['B&W A5', 'LOCKED', 'st'], ['B&W A7', 'LOCKED', 'st'], ['Sonos Playbar', 'LOCKED', 'st'], ['AirPort Express', 'LOCKED', 'st'],
      ['Sonos Beam', 'LOCKED', 'st'], ['Sonos Arc', 'LOCKED', 'st'], ['HomePod', 'FairPlay', 'st cy'], ['Chromecast', 'QUEUED', 'st dim'], ['Bluetooth', 'QUEUED', 'st dim']];
    var html = '';
    for (var rep = 0; rep < 2; rep++) { items.forEach(function (it) { html += '<span class="tick-item">' + it[0] + ' <span class="' + it[2] + '">● ' + it[1] + '</span></span>'; }); }
    tt.innerHTML = html;
  }

  /* ---- fader value-scale fills (pricing) ---- */
  function fillBars(container) { container.querySelectorAll('.fill').forEach(function (f) { f.style.width = (parseFloat(f.getAttribute('data-pct')) || 0) + '%'; }); }
  var scale = document.querySelector('.scale');
  if (scale) {
    if (reduce || !('IntersectionObserver' in window)) { fillBars(scale); }
    else { var io0 = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { fillBars(scale); io0.unobserve(e.target); } }); }, { threshold: .3 }); io0.observe(scale); }
  }

  /* ---- scroll reveal ---- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { threshold: .13 });
    document.querySelectorAll('.rv').forEach(function (el) { io.observe(el); });
  } else { document.querySelectorAll('.rv').forEach(function (el) { el.classList.add('in'); }); }

  /* ---- waitlist → Supabase (window.SLF from analytics.js) ---- */
  var form = document.getElementById('wlForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var em = document.getElementById('wlEmail'); var v = (em.value || '').trim();
      if (!v || v.indexOf('@') < 0) { em.focus(); return; }
      var path = (location.pathname.replace(/\/$/, '') || '/');
      var src = ({ '/': 'landing', '/pricing': 'pricing', '/positioning': 'positioning', '/competitive-landscape': 'competitive' })[path] || 'site';
      var done = function () { form.style.display = 'none'; var w = document.getElementById('wlDone'); if (w) w.classList.add('on'); };
      if (window.SLF && window.SLF.joinWaitlist) { window.SLF.joinWaitlist(v, src).then(done).catch(done); } else { done(); }
    });
  }
})();
