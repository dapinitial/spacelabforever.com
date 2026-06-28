/* spacelabforever — privacy-first, cookieless telemetry.
 * Posts straight to the Supabase Data API (PostgREST) with the PUBLISHABLE key
 * (safe to expose by design — RLS allows anon INSERT only). No cookies, no PII;
 * session id is a random value in sessionStorage. window.SLF = { track, joinWaitlist }. */
(function () {
  var BASE = "https://hzsilbjojgqxmzwehvrp.supabase.co/rest/v1";
  var KEY = "sb_publishable_UHMPzEURH0mOSXucu5_AlA_ICJPkMaR";

  function sid() {
    try {
      var s = sessionStorage.getItem("slf_sid");
      if (!s) { s = Math.random().toString(36).slice(2) + Date.now().toString(36); sessionStorage.setItem("slf_sid", s); }
      return s;
    } catch (e) { return null; }
  }
  function utm() {
    var p = new URLSearchParams(location.search), o = {};
    ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"].forEach(function (k) { if (p.get(k)) o[k] = p.get(k); });
    return Object.keys(o).length ? o : null;
  }
  function post(table, row, prefer) {
    return fetch(BASE + "/" + table, {
      method: "POST",
      headers: {
        apikey: KEY,
        Authorization: "Bearer " + KEY,
        "Content-Type": "application/json",
        Prefer: prefer || "return=minimal",
      },
      body: JSON.stringify(row),
    });
  }
  function track(type, meta) {
    post("events", { session_id: sid(), type: type, path: location.pathname, referrer: document.referrer || null, utm: utm(), meta: meta || null }).catch(function () {});
  }

  window.SLF = {
    track: track,
    // returns the fetch Response so the form can show success / handle a dup (409).
    joinWaitlist: function (email, source) {
      return post("waitlist", { email: email, source: source || "site", referrer: document.referrer || null, utm: utm() });
    },
  };

  // auto pageview
  track("pageview");

  // CTA clicks — any element carrying data-cta
  document.addEventListener("click", function (e) {
    var el = e.target.closest("[data-cta]");
    if (el) track("cta_click", { cta: el.getAttribute("data-cta"), text: (el.textContent || "").trim().slice(0, 40) });
  }, { passive: true });

  // scroll depth (50% / 90%, once each)
  var hit = {};
  window.addEventListener("scroll", function () {
    var d = document.documentElement;
    var pct = ((d.scrollTop || document.body.scrollTop) + window.innerHeight) / d.scrollHeight * 100;
    [50, 90].forEach(function (m) { if (pct >= m && !hit[m]) { hit[m] = 1; track("scroll_" + m); } });
  }, { passive: true });
})();
