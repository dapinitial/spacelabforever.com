import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient.js";

/* ── helpers ─────────────────────────────────────────────────────────── */
const hostOf = (url) => { try { return new URL(url).hostname.replace(/^www\./, ""); } catch { return null; } };
const sourceOf = (e) => (e.utm && e.utm.utm_source) || (e.referrer ? hostOf(e.referrer) || "other" : "direct");
const dayOf = (ts) => (ts || "").slice(0, 10);
const pct = (n, d) => (d ? Math.round((n / d) * 1000) / 10 : 0);

function tally(arr, key) {
  const m = {};
  arr.forEach((x) => { const k = key(x); if (k != null) m[k] = (m[k] || 0) + 1; });
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

/* ── small presentational bits ───────────────────────────────────────── */
const Kpi = ({ label, value, sub }) => (
  <div className="kpi"><div className="kpi-value">{value}</div><div className="kpi-label">{label}</div>{sub && <div className="kpi-sub">{sub}</div>}</div>
);
function Bars({ rows, total }) {
  if (!rows.length) return <p className="muted">No data yet.</p>;
  const max = Math.max(...rows.map((r) => r[1]));
  return (
    <div className="bars">
      {rows.map(([label, n]) => (
        <div className="bar-row" key={label}>
          <span className="bar-label" title={label}>{label}</span>
          <span className="bar-track"><span className="bar-fill" style={{ width: `${(n / max) * 100}%` }} /></span>
          <span className="bar-num">{n}{total ? ` · ${pct(n, total)}%` : ""}</span>
        </div>
      ))}
    </div>
  );
}

/* ── login ───────────────────────────────────────────────────────────── */
function Login() {
  const [email, setEmail] = useState(""); const [pw, setPw] = useState("");
  const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setErr("");
    const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
    if (error) setErr(error.message); setBusy(false);
  };
  return (
    <form className="login" onSubmit={submit}>
      <h1>SpaceLab · admin</h1>
      <p className="muted">Sign in to view the funnel.</p>
      <input type="email" placeholder="you@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <input type="password" placeholder="password" value={pw} onChange={(e) => setPw(e.target.value)} required />
      <button disabled={busy}>{busy ? "Signing in…" : "Sign in"}</button>
      {err && <p className="err">{err}</p>}
    </form>
  );
}

/* ── dashboard ───────────────────────────────────────────────────────── */
function Funnel() {
  const [data, setData] = useState(null); const [err, setErr] = useState("");
  useEffect(() => {
    (async () => {
      const [w, ev] = await Promise.all([
        supabase.from("waitlist").select("email,source,referrer,utm,created_at").order("created_at", { ascending: false }),
        supabase.from("events").select("type,path,referrer,utm,meta,session_id,created_at").limit(50000),
      ]);
      if (w.error || ev.error) { setErr((w.error || ev.error).message); return; }
      setData({ waitlist: w.data || [], events: ev.data || [] });
    })();
  }, []);
  if (err) return <p className="err">Couldn't load data: {err}</p>;
  if (!data) return <p className="muted">Loading the funnel…</p>;

  const { waitlist, events } = data;
  const pageviews = events.filter((e) => e.type === "pageview");
  const sessions = new Set(events.map((e) => e.session_id).filter(Boolean));
  const visitors = sessions.size;
  const scroll50 = new Set(events.filter((e) => e.type === "scroll_50").map((e) => e.session_id)).size;
  const ctaSessions = new Set(events.filter((e) => e.type === "cta_click").map((e) => e.session_id)).size;
  const signups = waitlist.length;

  const funnel = [
    ["Visitors", visitors], ["Scrolled 50%", scroll50], ["Clicked a CTA", ctaSessions], ["Signed up", signups],
  ];
  const signupsByDay = tally(waitlist, (w) => dayOf(w.created_at)).sort((a, b) => a[0].localeCompare(b[0]));
  const topSources = tally(pageviews, sourceOf);
  const ctaClicks = tally(events.filter((e) => e.type === "cta_click"), (e) => (e.meta && e.meta.cta) || "unknown");
  const topPages = tally(pageviews, (e) => e.path || "/");

  return (
    <div className="dash">
      <header className="dash-head">
        <div><h1>SpaceLab · funnel</h1><p className="muted">spacelabforever.com — live</p></div>
        <button className="ghost" onClick={() => supabase.auth.signOut()}>Sign out</button>
      </header>

      <section className="kpis">
        <Kpi label="Waitlist signups" value={signups} />
        <Kpi label="Unique visitors" value={visitors} />
        <Kpi label="Pageviews" value={pageviews.length} />
        <Kpi label="Visitor → signup" value={`${pct(signups, visitors)}%`} sub="conversion" />
      </section>

      <section className="card">
        <h2>Funnel</h2>
        <div className="bars">
          {funnel.map(([label, n]) => (
            <div className="bar-row" key={label}>
              <span className="bar-label">{label}</span>
              <span className="bar-track"><span className="bar-fill accent" style={{ width: `${visitors ? (n / visitors) * 100 : 0}%` }} /></span>
              <span className="bar-num">{n}{visitors ? ` · ${pct(n, visitors)}%` : ""}</span>
            </div>
          ))}
        </div>
      </section>

      <div className="grid">
        <section className="card"><h2>Signups by day</h2><Bars rows={signupsByDay} /></section>
        <section className="card"><h2>Top sources</h2><Bars rows={topSources} total={pageviews.length} /></section>
        <section className="card"><h2>CTA clicks</h2><Bars rows={ctaClicks} /></section>
        <section className="card"><h2>Top pages</h2><Bars rows={topPages} total={pageviews.length} /></section>
      </div>

      <section className="card">
        <h2>Recent signups</h2>
        {waitlist.length === 0 ? <p className="muted">No signups yet.</p> : (
          <table className="tbl">
            <thead><tr><th>Email</th><th>Source</th><th>When</th></tr></thead>
            <tbody>{waitlist.slice(0, 50).map((w, i) => (
              <tr key={i}><td>{w.email}</td><td>{w.source || "—"}</td><td>{(w.created_at || "").replace("T", " ").slice(0, 16)}</td></tr>
            ))}</tbody>
          </table>
        )}
      </section>
    </div>
  );
}

export default function Dashboard() {
  const [session, setSession] = useState(undefined);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);
  if (session === undefined) return <p className="muted">…</p>;
  return session ? <Funnel /> : <Login />;
}
