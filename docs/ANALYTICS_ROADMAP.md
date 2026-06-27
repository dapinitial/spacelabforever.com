# spacelabforever.com — Telemetry & Conversion Roadmap

How we turn the marketing site into an **investor-grade, privacy-respecting**
measurement system — owning the funnel, not renting it.

## Principles

1. **Own the funnel.** The waitlist (emails) and the conversion data are *our*
   assets — they live in our Postgres (Supabase), not a third party.
2. **Privacy-first, like the product.** SuperAudio's whole pitch is "no telemetry,
   no ad-tech, your data stays yours." The marketing site must honor that. **No Google
   Analytics** (ad-tech + cookie banners + brand contradiction). Cookieless, no PII
   beyond an email the user volunteers.
3. **Investor-grade = the funnel over time.** Visitors → engagement → CTA click →
   waitlist signup, with sources and trends. Signup growth rate is the headline number.
4. **`main` is production.** Every change ships live; build green first.

## The stack (decided)

| Layer | Tool | Notes |
|---|---|---|
| Waitlist signups (the asset) | **Supabase** | Owned. The #1 pre-launch investor metric. |
| Events (pageview, CTA click, scroll, outbound) | **Supabase** | Owned, cookieless, anon-insert-only. |
| Dashboard | **`/admin`** — React island, Supabase-Auth-gated | Our owned view; charts of the KPIs below. |
| Traffic/funnel (optional) | **PostHog** (free, cookieless/EU) *or* stay pure-Supabase | Investor-ready funnels/retention without building them. Disclosable as "privacy-respecting analytics." |

Architecture: marketing pages stay **Astro static** (fast, SEO-ready); React is added
**only** as an island on `/admin` via `@astrojs/react`. Not a full React app.

## Data model (Supabase / Postgres)

```sql
-- emails we own. The asset.
create table waitlist (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text,                 -- which CTA / page
  referrer text,
  utm jsonb,                   -- utm_source/medium/campaign
  created_at timestamptz default now()
);

-- cookieless behavioral events. Session = a random id in sessionStorage (no PII).
create table events (
  id bigint generated always as identity primary key,
  session_id text,
  type text not null,          -- pageview | cta_click | scroll_50 | scroll_90 | outbound
  path text,
  referrer text,
  utm jsonb,
  meta jsonb,                  -- e.g. { cta: "get-notified", label: "hero" }
  created_at timestamptz default now()
);
```
**RLS:** anon role → `INSERT` only on both tables (public capture). `SELECT` → authed
admins only (the `/admin` dashboard). No anon reads. No PII in `events`.

## Phases

- **Phase 0 — site live.** ✅ 8 pages on spacelabforever.com (Astro static, auto-deploy).
- **Phase 1 — own the funnel.** Wire the (currently stubbed) waitlist form → `waitlist`.
  Add a tiny cookieless beacon → `events` (pageview, CTA clicks via `data-cta`, scroll
  50/90%, outbound). RLS as above. *Needs: Supabase URL + anon key.*
- **Phase 2 — `/admin` dashboard.** React island, Supabase Auth (team-only). Charts:
  visitors, sources, CTA clickthrough, signups, conversion %, day/week trends.
- **Phase 3 — traffic analytics (optional).** Add PostHog for top-of-funnel + funnels
  out-of-box, or build the equivalents in `/admin` (pure-Supabase).
- **Phase 4 — investor reporting.** A weekly KPI snapshot (signups, growth %,
  conversion, sources) — exportable. Optional emailed digest.
- **Phase 5 — launch readiness.** Flip `noindex`, OG/Twitter cards + sitemap,
  performance budget, real form success states.

## Investor KPIs (what the dashboard surfaces)

- **Unique visitors** + **traffic sources** (referrer/UTM) + geography.
- **CTA clickthrough rate** (per CTA — which copy converts).
- **Waitlist signups:** count, **daily/weekly growth rate**, **visit→signup conversion %**.
- **Funnel:** visit → scrolled-50% → CTA click → signup.
- **Trends** over time on all of the above.

## What David provides to start Phase 1

1. A **Supabase project** (new, or reuse an existing one).
2. Its **Project URL** + **anon (publishable) key** — safe to share (client-side).
   Keep the **service-role key secret** (only `/admin` server-side needs it).
3. (Optional) a **PostHog** account if we go that route in Phase 3.

Then: tables + RLS get scripted, the form + beacon get wired, and signups start landing
in your own database.
