-- spacelabforever telemetry: own the funnel (privacy-first, cookieless).
-- "Automatically expose new tables" is OFF, so we GRANT to the Data API roles
-- explicitly. Security boundary is RLS: anon may INSERT only; authed reads.

-- ── waitlist: the asset (emails we own) ──────────────────────────────
create table if not exists public.waitlist (
  id         uuid primary key default gen_random_uuid(),
  email      text not null unique,
  source     text,                       -- which CTA / page drove the signup
  referrer   text,
  utm        jsonb,                      -- utm_source/medium/campaign/...
  created_at timestamptz not null default now()
);
alter table public.waitlist enable row level security;
create policy "anon insert waitlist"  on public.waitlist for insert to anon          with check (true);
create policy "authed read waitlist"  on public.waitlist for select to authenticated using (true);

-- ── events: cookieless behavioral telemetry (no PII) ─────────────────
create table if not exists public.events (
  id         bigint generated always as identity primary key,
  session_id text,                       -- random id in sessionStorage, not a cookie
  type       text not null,              -- pageview | cta_click | scroll_50 | scroll_90 | outbound
  path       text,
  referrer   text,
  utm        jsonb,
  meta       jsonb,                      -- e.g. { "cta": "get-notified", "text": "Get notified" }
  created_at timestamptz not null default now()
);
alter table public.events enable row level security;
create policy "anon insert events" on public.events for insert to anon          with check (true);
create policy "authed read events" on public.events for select to authenticated using (true);

-- ── grants (needed because auto-expose is OFF) ───────────────────────
grant usage  on schema public to anon, authenticated;
grant insert on public.waitlist, public.events to anon;
grant select on public.waitlist, public.events to authenticated;
