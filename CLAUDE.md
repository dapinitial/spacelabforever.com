# spacelabforever.com — Project Brief

> The public marketing site for **SuperAudio** (multi-room audio for the Mac). Astro,
> **static output**, deployed to **spacelabforever.com**. Read this before editing —
> it's how a careful senior dev expects Claude to operate in this repo.

## What this is

- A marketing/landing site. **Astro static** — no SSR, no framework components, no
  server. The whole thing is `astro build → dist/` served as static files.
- Deliberately separate from the **proprietary** `superaudio` app repo. This repo is
  public; never paste app source, secrets, or internal strategy docs in here.
- **`main` is production.** Every push to `main` auto-deploys to spacelabforever.com
  via DigitalOcean App Platform (`deploy_on_push`, static site, `npm run build → dist`,
  domains `www.spacelabforever.com` primary + `spacelabforever.com` alias). **There is
  no staging.** Build green locally and treat `main` as live.
- **`noindex, nofollow` is on** (in `Base.astro`) until launch. Do not remove it
  without an explicit instruction.

## How to operate here — the principles

The bar, non-negotiable:

1. **Copy is honest or it doesn't ship.** Every claim must be factually accurate and
   defensible against what SuperAudio *actually* does today. No overclaiming —
   credibility beats hype, and specificity *is* credibility. When unsure whether the
   app does something, assume it doesn't and verify. Current realities to respect:
   cross-protocol sync is **measurement-assisted + tuned by ear**, not hands-free;
   **et=1 encrypted AirPlay is broken** (et=0 is the shipping path); **AirPlay 2 is not
   built**; the product is **pre-launch** ("coming soon," not buyable). If a number or
   comparison can't be defended, fix it (e.g. "$19 ≈ half of Airfoil's $35," not
   "80% less").
2. **Performance is a feature.** Static output; motion must be GPU-cheap
   (transform/opacity/compositing). **No heavy SVG filters on large elements** — a
   `feTurbulence` displacement over a full-width card janks the main thread and blocks
   scrolling; it's a *small-element* effect only. Nothing may block scroll.
3. **Accessibility is not optional.** Every animated effect honors
   `prefers-reduced-motion: reduce` (neutralize, never strobe). Semantic HTML,
   keyboard-reachable, real contrast.
4. **Taste over quantity.** Motion and effects are accents. One hero element gets the
   dramatic treatment, not every card. Confirm the vibe before sprinkling.
5. **Verify with your eyes, not the source.** Never claim a page looks right until
   you've loaded it and scrolled. The dev server's inline-style HMR lags a few seconds
   — **hard-refresh (⌘⇧R)** before judging, and re-check `curl localhost:4321` if in
   doubt.
6. **`main` is live — deploy with care.** `npm run build` must be green before pushing.
   A broken push publishes a broken public site.

## Architecture

- `src/layouts/Base.astro` — the single chrome shell: `<head>` (meta, `noindex`, the
  `/animate` engine + CDN tags), `<Nav/>`, `<slot/>`, `<Footer/>`, `motion.js`. Every
  page uses it.
- `src/components/Nav.astro` · `Footer.astro` — canonical nav/footer (Nav auto-
  highlights the current route). Edit chrome **here, once** — never per page.
- `src/styles/site.css` — the design system (`:root` tokens, chrome, sections,
  components) plus the `/* PIZZAZZ … end PIZZAZZ */` block (electric CTAs etc.),
  which is intentionally **backable as a unit**.
- `src/pages/*.astro` — one per route. Content is migrated from
  `../superaudio/website/*.html`, copy preserved and accuracy-corrected.
- `public/motion.js` — the `/animate` engine (reduced-motion gated).
  `public/robots.txt` — disallow (pre-launch).

## Motion & effects — use the fleet skills

- **`/animate`** (supermotion): scroll motion via `data-animate` tokens — `reveal`
  (masked SplitText lines), `fade-up`, `parallax`, `zoom`, `marquee`, `count`,
  `track-x`. Engine in `public/motion.js`. **Retrofit rule:** we use the engine + a
  tiny helper, NOT the skill's opinionated base theme — this site has its own design.
- **`/spacelab-styles`**: electric-border / glass effects. The electric crackle lives
  on the **CTA buttons** (small = cheap + smooth), via the turbulence filter tuned for
  small elements (fine `baseFrequency`, small sweep, thin border). Big cards get a
  lightweight neon/glow hover — **never** the filter.

## Hard-won gotchas (don't relearn these)

- **SplitText masked-line reveals clip descenders** at tight line-height. Fix:
  `.studio-line` / `.studio-mask-line-mask { line-height: inherit }` +
  `overflow-clip-margin` — *not* a thicker heading line-height.
- **`feTurbulence` is scale-sensitive.** Tuned for a ~350px card; on a small button you
  need ~6× higher `baseFrequency` and a small offset sweep, or half the border reads as
  a "solid moving line" with a "clockwise reveal." Too heavy for big elements, period.
- **Gradient `transparent` = transparent _black_** → a dark seam. Fade to same-hue
  0-alpha (`rgba(h, 0)`).
- **HMR lag:** served CSS can be a few seconds stale — hard-refresh before judging.

## Working norms

- Dev server in background mode (see [`llm/astro.md`](llm/astro.md)).
- Commit per logical change; keep `main` deployable at all times.
- Astro scaffold/dev/doc pointers live in [`llm/astro.md`](llm/astro.md).
