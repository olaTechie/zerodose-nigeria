# Editorial Rebuild — Design Brief

> **Single source of truth for the polish/editorial-rebuild branch.** The next eight `/impeccable` skills (typeset, quieter, distill, clarify, harden, layout, animate, polish) execute against this brief verbatim. Where a downstream skill is tempted to deviate, it must update this file first and surface the change.

---

## 1. Design thesis

The rebuilt Zero-Dose Nigeria site is an **editorial evidence brief** about a national vaccination crisis, structured like Our World in Data and Pew Research: typography and white space carry the seriousness; maps and charts carry the argument; every number on screen is one click from its source. It is **not** a SaaS dashboard, not a glassmorphic showcase, not a McKinsey deck. The visitor — a programme manager, an epidemiologist, or a state health commissioner — leaves with one operational sentence already memorised ("two community types, two recipes") and the confidence that they could defend every digit they just read in front of a peer reviewer or a federal coordinator.

---

## 2. Information architecture per route

### `/` — Landing

- **Purpose:** orient the visitor in 30 seconds and route them to the right experience.
- **Above the fold:** a single full-bleed Nigeria choropleth (state-level zero-dose prevalence, sequential green-to-amber ramp) is the largest visual element. Headline copy — set in the display serif (see §4) — reads **"More than one in three Nigerian children never receives a single vaccine."** A subdeck below in body sans: **"Two community types. Two recipes. One unified targeting rule."** First interactive affordance is a single text-link cluster: `Read the story  ·  Open the policy console  ·  Inspect the methods` (no glass cards, no emoji, no gradient pills).
- **Section sequence:**
  1. Map hero + headline.
  2. Operational headline strip (see §3).
  3. Two-column "What this site is / What this site is not" editorial note (≤80 words each side).
  4. Three audience entry points — typographic blocks (see §6), not cards: each is an `<article>` with a small-caps eyebrow (`For policy makers` / `For researchers` / `For state officials`), an h2 link, two sentences, and a `→ continue` link.
  5. Method note + citation block + footer (data source, pipeline date, Warwick affiliation, citation BibTeX one-click reveal).
- **Leave with this:** *Nigeria's zero-dose burden is geographic and structural; this site shows the recipe to fix it.*

### `/story` — Story

- **Purpose:** walk the visitor through the evidence as a six-act argument.
- **Above the fold:** the largest visual element is a static, frame-1 version of the cluster-dot map that the first scroll step animates. Headline (display serif): **"How we got here, and how we get out."** Standfirst (body sans, ≤45 words). First interactive affordance is a "begin scrolling" cue (small caret + label) above a one-line table-of-contents (Crisis · Geography · Why · Twin · Recipes · Action) that is `position: sticky` once scrolling begins.
- **Section sequence:** Crisis → Geography → Why (drivers) → Digital twin → Recipes → Action (already in `storyContent.js`; preserve copy, restage visually).
- **Leave with this:** *The crisis is geographic, the drivers are systemic, and the digital twin proves which combinations of interventions cross 80%.*

### `/policy` — Policy

- **Purpose:** give a programme manager an answer they can act on this week.
- **Above the fold:** largest visual element is the **operational headline panel** (see §3) rendered as the page lede — not the four metric cards currently there. Headline copy: **"Pick a community type. Read the recipe. Allocate the resource."** First interactive affordance is the typology selector (Reference / Access-Constrained) rendered as two large adjacent typographic blocks with a built-in segmented control, not as the existing pill tabs.
- **Section sequence (renamed and re-ordered from current 4 panels):**
  1. *Recipe* — operational headline + per-typology recipe (replaces current "Action Plans" intro).
  2. *Where* — geographic targeting map + LISA toggle + selected-state side panel.
  3. *Scenarios* — coverage matrix (current heatmap) with inline 80% reference line and CI annotations on cell click.
  4. *What-if* — three sliders + projected coverage gauge + trajectory.
  5. *Briefs* — printable per-typology briefs (preserved; restyled per §6).
- **Leave with this:** *I know which intervention bundle to deploy in my state, what coverage to expect, and where the methods are if my director asks.*

### `/explorer/*` — Explorer

- **Purpose:** let a researcher inspect the pipeline with the rigour they would apply to a supplementary appendix.
- **Above the fold:** largest visual element is a small-multiples figure showing the four core pipeline outputs (state map, SHAP top-10, LCA class profile bars, ABM coverage curve) at thumbnail scale, each linking to its tab. Headline (display serif): **"The full evidence base."** Standfirst names the dataset (NDHS 2024, n=4,875, 1,283 clusters) and the pipeline date. First interactive affordance is the new three-section navigation (see §9).
- **Section sequence (regrouping the seven existing tabs into three sections):**
  1. *Descriptive* — Descriptive · Spatial.
  2. *Modelling* — Risk Factors · Trust States · ABM.
  3. *Causal* — CNA · Export.
- **Leave with this:** *I can find any number on this site, see how it was computed, and download the underlying file.*

---

## 3. The operational headline as design

"Two community types. Two recipes." is the **brand-load-bearing sentence** of the entire site. It must appear in three places, in three visual treatments, all derived from a single React component — `OperationalHeadline.jsx` — that the next skills create.

### Variant A — Hero panel on `/policy` (canonical instance)

A two-column editorial panel, full content width, no background card, no shadow:

- **Left column (≈55%):** the existing `DecisionTreeSVG` from `Story.jsx:226` is **lifted into a standalone component** `DecisionTreeFigure.jsx` and recoloured against the new neutral palette (greens for Reference branch, amber-ochre for Access-Constrained, dotted 80% line in deep gold). It is the figure of record for the operational headline.
- **Right column (≈45%):** display-serif h2 reading **"Two community types. Two recipes."**, body-sans paragraph (≤55 words) explaining the rule, then two short `<dl>` blocks — one per typology — each listing `Coverage at S0`, `Recipe`, `Coverage projected`, with the projected number set in the display serif at 2× body size. Below: a single text-link `View the underlying CNA solutions →`.

### Variant B — Persistent strip across routes

A 40 px-tall slim strip below the site nav (and above the page hero on every route except Landing). Content: small-caps eyebrow `OPERATIONAL HEADLINE`, then the sentence "Two community types. Two recipes." set in the body sans at 14 px, then a `→` text link to `/policy#recipe`. Strip background is the neutral-100 surface (see §5), separated from the nav by a 1 px hairline rule; sticky on scroll only on `/explorer/*`. Dismissible via a small `×` (state stored in `localStorage`).

### Variant C — Story closing card (§5 of `storyContent.js`, the existing "Action" section)

The operational headline replaces the current floating glass card on Story step 5. It is rendered as a full-bleed editorial spread: display-serif sentence at 64 px on the left, `DecisionTreeFigure` on the right. Scroll choreography is described in §8.

**Spec for `/distill` and downstream skills:** the headline is *typographic first, illustrative second*. The decision tree exists to make the recipe legible; no other ornament. No glass card, no gradient, no emoji, no arrow icons.

---

## 4. Typography brief (input to `/typeset`)

### Reflex-reject list (do not propose)

Inter, DM Sans, Plus Jakarta, Space Grotesk, Fraunces, Playfair, Cormorant, Crimson, Lora, Newsreader, Outfit, Instrument, IBM Plex.

### Three candidate pairs

**Pair A — GT Sectra (display) + Söhne (body) — RECOMMENDED**

- **Display:** GT Sectra (Grilli Type, https://gt-sectra.com). A scotch-modern serif with slab-style terminals; designed for editorial mastheads (Wallpaper, Texas Monthly use it). Carries weight without warmth — exactly the "considered conviction" tone in `.impeccable.md`.
- **Body:** Söhne (Klim Type Foundry, https://klim.co.nz/retail-fonts/sohne). A grotesque sans modelled on Akzidenz, optimised for screen. Reads clearly at 15–17 px, has tabular-numeral and small-caps OpenType variants needed for data and eyebrows.
- **Why:** Sectra is the closest thing to the Pew Research display voice without being literally Pew's Mercury or NYT's Cheltenham; Söhne is what Bloomberg's data desk and The Atlantic's body voice converged on. Together they read *editorial-rigorous, not corporate-safe*.
- **License note:** both are paid foundry fonts; budget ~US$300 for self-hosted webfonts. If budget blocks, fall back to Pair B.

**Pair B — Source Serif 4 (display) + Söhne (body) or Source Sans 3 (body) — FREE FALLBACK**

- **Display:** Source Serif 4 (Adobe, https://fonts.adobe.com/fonts/source-serif & Google Fonts as Source Serif 4). Open-licensed, transitional serif with strong text and display optical sizes. Less editorial than Sectra but carries the same gravity.
- **Body:** Source Sans 3 (Google Fonts, https://fonts.google.com/specimen/Source+Sans+3). Pairs by foundry; identical x-height treatment.
- **Why:** ships free, hostable from Google Fonts (or self-hosted from Adobe). Used by serious-looking academic sites without being a cliché.

**Pair C — Tiempos Text (display + body) by Klim — single-family fallback**

- **Display + body:** Tiempos Text + Tiempos Headline (Klim Type Foundry, https://klim.co.nz/retail-fonts/tiempos-text/). Tiempos is the body face of *The Guardian's* US site and FiveThirtyEight; Headline its display companion.
- **Why:** if budget permits one purchase but not two, a single-family superfamily ships the entire system in one OpenType-synced voice. Slight risk: Tiempos is so widely used in journalism it may read as derivative; Sectra/Söhne is more distinctive.

### Recommendation: Pair A (GT Sectra + Söhne)

Pair A wins because (a) the display serif must do the heavy lifting of the operational headline and Sectra has the most editorial presence; (b) Söhne's tabular numerals and small-caps are non-negotiable for data tables and the small-caps eyebrows used throughout the new IA; (c) the combination is not yet recognisable as belonging to any one publication, which avoids the "looks like a Pew clone" failure mode. If the budget blocker is real, Pair B is a clean second choice with no quality loss in body and a small loss in display distinctiveness.

### Type scale (input to `/typeset`)

Modular scale at 1.25 (major third) anchored at 16 px body:

| Token | Size | Use |
|---|---|---|
| `text-display-1` | 64 px / 1.05 | Story act titles, operational headline canonical |
| `text-display-2` | 48 px / 1.1 | Page heroes |
| `text-display-3` | 36 px / 1.15 | Section heads |
| `text-h1` | 28 px / 1.2 | Story narrative subheads |
| `text-h2` | 22 px / 1.3 | Card / block titles |
| `text-h3` | 18 px / 1.4 | Inline emphasis |
| `text-body` | 16 px / 1.6 | Paragraphs |
| `text-small` | 14 px / 1.55 | Captions, table data |
| `text-eyebrow` | 12 px / 1.4 | Small-caps eyebrow, letter-spacing 0.08em |
| `text-mono` | 14 px / 1.5 | Recipe formulas, code |

Display = GT Sectra weights 400/500/700. Body = Söhne weights 400/500/600 + tabular-nums for all numeric cells.

---

## 5. Colour system refinement

### Preserve

- `primary` family (`#003d1e` / `#006633` / `#008744`) — Nigerian green, brand-load-bearing.
- `gold` (`#e6a817`, `#cc8400`) — single accent role: 80% target line, "necessary condition" highlight in CNA, selected-tab underline.
- `coverage.{ontrack,atrisk,critical,crisis}` — semantic data palette, used in choropleths and tables.
- `zone.{nw,ne,nc,se,ss,sw}` — Nigeria-specific zonal coding for state-level small multiples.
- `typology.{access,reference}` — keep as data colours but retire the matching `-bg` tints (replace with neutral surfaces + coloured hairline rules).

### Retire

- `primary.glow` and the `--primary-glow` rgba.
- All `linear-gradient` hero/card/badge fills (hero, coverage tiers, scenario card headers).
- `--bg-card` rgba with backdrop blur (becomes flat neutral surfaces).
- All `box-shadow` tokens except `--shadow-sm` (kept as a 1 px hairline alternative for table headers only).

### New OKLCH neutrals (tinted toward primary green hue 155)

| Token | OKLCH | Hex (approx.) | Use |
|---|---|---|---|
| `neutral-0` | `oklch(99% 0.005 155)` | `#fbfcfb` | Page background |
| `neutral-50` | `oklch(97% 0.008 155)` | `#f4f7f4` | Surface (formerly card background) |
| `neutral-100` | `oklch(94% 0.010 155)` | `#e9eee9` | Subtle separators, persistent strip |
| `neutral-300` | `oklch(82% 0.010 155)` | `#c7cfc7` | Hairline rules, table borders |
| `neutral-600` | `oklch(48% 0.010 155)` | `#697269` | Secondary text |
| `neutral-900` | `oklch(20% 0.010 155)` | `#1c211d` | Primary text |

Chroma capped at 0.010 throughout — neutrals tinted, not coloured. Test against AA contrast on the green primary at 16 px (target ≥ 4.5:1). All chart axis labels switch from current `#546e7a` to `neutral-600`.

### Gold is the only warm

The gold accent is reserved for *one signal at a time per surface*: the 80 % target line, the "necessary" CNA marker, the active tab underline. Never as a fill, never gradiated.

---

## 6. Component grammar replacement

Each anti-pattern → its typographic-block alternative. `/distill` and `/quieter` consume this table.

| Old anti-pattern | Replace with |
|---|---|
| **Glass card** (`.glass-card`, `<GlassCard>`) | `EditorialBlock` — semantic `<article>` with `padding-block: 2rem`, optional 1 px top hairline rule in `neutral-300`, no background fill, no shadow, no backdrop blur. Variant `EditorialBlock--inset` adds left padding + a 2 px gold left rule for callouts. |
| **Side-stripe accent** (`borderLeft: '4px solid …'` everywhere) | Reserve the side stripe for one purpose only: typology callouts in policy briefs. Stripe becomes 2 px (not 4 px), uses the typology colour at full saturation, no background tint. |
| **4-stat hero strip** (`.hero-stats` row of four boxed metrics) | `KeyFiguresList` — a definition list (`<dl>`) inline below the hero standfirst. Each item: small-caps eyebrow label above a Sectra display number; numbers separated by 1 px vertical rules in `neutral-300`. No box, no background. |
| **Coverage-tier gradient pill** (`.coverage-tier-*`) | `CoverageTierTag` — typographic tag: small-caps label in the tier's solid colour (no gradient), preceded by a 6 px solid square dot of the same colour. Inline with table cells, no padding box. |
| **Emoji nav-card** (`<NavCard icon="📖" …>`) | `AudienceEntryBlock` — full-width row with: eyebrow (`FOR POLICY MAKERS`), Sectra h2 link in primary green, two-sentence body, single right-arrow text link. Separated by 1 px `neutral-300` hairline rules between rows. No icon, no card, no shadow. |
| **Animated gradient hero section** (`.hero-section` + `heroGradient` keyframe) | `EditorialHero` — flat `neutral-0` background, full-bleed feature visual (map or chart) on the right or above, headline + standfirst on the left. No animation on background. Single static decorative element allowed: a thin gold rule beneath the eyebrow. |
| **CountUpNumber** | `StaticFigure` — render the final number on first paint, set in Sectra display weight, with the small-caps label below. The "count up" effect goes; tabular-numeral OpenType + reduced-motion compliance comes in. |

Additional retirements (no replacement needed):

- `.scenario-card-header-{ontrack,atrisk,critical,crisis}` gradients.
- `.recipe-card-formula` mono block keeps its monospace face but loses the tinted background; wraps in a 1 px hairline rectangle instead.
- `.policy-brief-card` keeps its semantics (printable brief) but loses its shadow and rounded corners; in print it becomes a clean A4 page with rule-only ornamentation.

---

## 7. Source-of-truth pattern (input to `/clarify` and `/harden`)

Three primitives, used consistently sitewide.

### Pointer location: superscript citation marker

Every metric and every claim that asserts a number renders the value followed by a superscript citation marker — set in Söhne 11 px, primary green, raised 0.4 em. Examples:

- `36.8%¹`
- `Moran's I = 0.608²`
- `XGBoost AUC = 0.972³`

Markers are sequential per page, reset per route. Hovering the marker reveals a small tooltip (Radix Popover or equivalent) with: source label (e.g. `outputs/stage1/eda/eda_summary_stats.csv`), computation snippet (`weighted by v005/1e6`), and a `Open methods →` link. Markers are tabbable and operable by keyboard (Enter/Space).

### Methods overlay: route + side drawer

`/clarify` and `/harden` create a single `MethodsDrawer` component invoked anywhere via `useMethods('section-id')`. Implementation:

- Drawer enters from the right, max-width 480 px, full viewport height, scroll-locked.
- Always reachable via a persistent text link in the site nav (`Methods`) routing to `/methods` (a real route that renders the drawer's content as a full page for direct linking and printing).
- Drawer content is a markdown render of `public/methods/<section-id>.md` files, one per analysis stage (`zero-dose-definition`, `lca`, `xgboost`, `abm-calibration`, `cna`, `spatial`).
- Closes on `Esc`, click-outside, or the close button.

### Inline-CI rendering convention

Standardised across the site:

```
90.7% (95% CI 90.3 – 91.1)
```

- Spaces around the en dash.
- Always parenthesised, always with the `95% CI` label inline.
- Set in tabular-numerals.
- For posterior-derived intervals: `82.0% (95% CrI 81.6 – 82.4)`.
- For Spearman / correlation: `r = 0.943 (95% CI 0.918 – 0.961)`.
- Helper component `<MetricWithCI value="82.0" lower="81.6" upper="82.4" kind="CrI" />` does the rendering.

### Jargon glossary tooltip

- Inline expansion via dotted underline (`text-decoration: underline dotted; text-underline-offset: 4px;` in `neutral-600`).
- Hover or focus reveals a 240 px-wide tooltip with: term in display serif, 1–2 sentence definition, link to a `Glossary` route.
- Glossary route (`/methods/glossary`) lists every term alphabetically.
- Source: a single `src/data/glossary.js` map. Initial terms: `zero-dose`, `Pentavalent-1`, `LCA`, `LISA`, `Moran's I`, `SHAP`, `ABM`, `CNA`, `consistency`, `coverage` (CNA sense), `posterior median`, `credible interval`, `outreach`, `community engagement`, `supply reinforcement`, `Reference community`, `Access-Constrained community`.

---

## 8. Motion budget per route

| Route | Budget | Concretely |
|---|---|---|
| **Landing** | ≤ **3** motion events on first view | (1) Map fades in over 600 ms with stroke-draw on Nigeria outline; (2) headline fades up 12 px over 400 ms; (3) the operational headline strip slides down from above on first scroll. No hover lifts, no count-ups. |
| **Story** | **Maximalist — full choreography** | All six acts get scroll-driven sequences. Specifically: Crisis act — cluster dots fade in by zone, NW first; Geography act — choropleth tiles in by zone with 60 ms stagger, then LISA hatching layers in; Why act — SHAP bars draw left-to-right with 120 ms stagger, top bar holds through subsequent steps; Twin act — `NetworkAnimation` runs its three-step network growth on Scrollama steps; Recipes act — coverage matrix cells fill in row-by-row with the 80 % reference line drawing last; Action act — the operational headline display number counts (in this one place only) from S0 → projected, decision tree branches expand from root after the headline lands. |
| **Policy** | ≤ **4** motion events per panel transition | Tab change: 200 ms cross-fade; metric values appear with a 150 ms upward fade (no count); slider updates animate the trajectory line over 250 ms (Framer `tween`); coverage gauge stroke-dashoffset animates over 600 ms on first paint and on slider settle (debounced 150 ms). No hover transforms. |
| **Explorer** | ≤ **2** motion events per tab | Tab switch fade only (200 ms); chart entrance fade only (300 ms). No staggered bar draws, no count-ups, no map animations. |

`prefers-reduced-motion: reduce` collapses all of the above to instant transitions (`duration: 0`) and renders final-state numbers immediately. Story scrollytelling preserves all *content* under reduced motion — visuals appear in their final state and narrative blocks become statically full-opacity.

---

## 9. Tab / navigation pattern

### Site nav (top)

Single `SiteNav` (already present) restyled to: white background, 1 px `neutral-300` bottom rule, no backdrop blur, no shadow. Logo lockup (Sectra `Zero-Dose Nigeria`) on the left; right side hosts `Story · Policy · Explorer · Methods · Cite this work`. Active item gets a 2 px gold underline (the gold accent's only role in nav).

### Route-level tabs — single pattern: **underline tab**

Kill the three competing implementations (rounded-pill inactive in Policy.jsx, rounded-top NavLink in Explorer.jsx, free-form buttons elsewhere). Adopt one `Tabs` component with this spec:

- 1 px bottom rule in `neutral-300` spans the full content width.
- Tab labels are body-sans 15 px, weight 500 inactive / 600 active.
- Active tab gets a 2 px solid gold underline, 4 px below the baseline, terminating at the label's exact width.
- Hover state on inactive: `neutral-900` colour change only, no background.
- Keyboard: `←/→` move focus, `Enter` activates (via Radix `Tabs` primitive).

### Explorer three-section grouping

Top-level navigation is a one-row strip of three section names (underline tabs); selecting a section reveals a second-tier underline-tab row beneath it for the sub-tabs. Mapping:

| Section | Sub-tabs |
|---|---|
| **Descriptive** | Descriptive · Spatial |
| **Modelling** | Risk Factors · Trust States · ABM |
| **Causal** | CNA · Export |

URL structure: `/explorer/descriptive/spatial`, `/explorer/modelling/abm`, `/explorer/causal/cna`. Default landing per section: first sub-tab in each list. The `Export` tab is intentionally placed under Causal because in practice users export from the CNA view.

---

## 10. Cut list

`/quieter` and `/distill` execute these deletions in order. Where a file is deleted, its imports across the codebase must also be removed (search-replace responsibility lies with the deleting skill).

**Files to delete entirely:**

- `/Users/uthlekan/Library/CloudStorage/Dropbox/00Todo/00_ToReview/vacSeries/01_zero-dose/website/src/styles/glass-morphism.css`
- `/Users/uthlekan/Library/CloudStorage/Dropbox/00Todo/00_ToReview/vacSeries/01_zero-dose/website/src/components/shared/GlassCard.jsx`
- `/Users/uthlekan/Library/CloudStorage/Dropbox/00Todo/00_ToReview/vacSeries/01_zero-dose/website/src/components/shared/CountUpNumber.jsx`
- `/Users/uthlekan/Library/CloudStorage/Dropbox/00Todo/00_ToReview/vacSeries/01_zero-dose/website/src/components/shared/NavCard.jsx`

**Tailwind config trims** (`/Users/uthlekan/Library/CloudStorage/Dropbox/00Todo/00_ToReview/vacSeries/01_zero-dose/website/tailwind.config.js`):

- Delete `colors.primary.glow`.
- Delete `colors.background.card`, `colors.background.card-hover` (replace usage with `neutral-50`).
- Delete `backdropBlur.card`, `backdropBlur.hero`.
- Delete `boxShadow.hover`; keep `shadow-sm` only.
- Delete `keyframes.heroGradient`, `keyframes.pulse`, and the matching `animation` entries.
- Delete `borderRadius.pill` and `borderRadius.2xl` (no rounded pills, no super-rounded cards in the new system).
- Replace `fontFamily.inter` with `fontFamily.display` (GT Sectra) and `fontFamily.body` (Söhne) — actual injection is `/typeset`'s job.

**Inline-style anti-patterns to remove from JSX** (these stay as files but lose the offending styles; `/distill` rewrites with the new components):

- `Landing.jsx` — entire `<StageCard>` inner function (replace with `EditorialBlock`).
- `Landing.jsx` — `hero-stats` block (replace with `KeyFiguresList`).
- `Story.jsx:226` — `DecisionTreeSVG` is *moved*, not deleted, into `src/components/shared/DecisionTreeFigure.jsx`; recoloured per §3.
- `Story.jsx` `btnStyle` const and the two CTA buttons it powers (replace with text links per §6).
- `Policy.jsx` — pill tab implementation (lines ~40–60) replaced with shared `Tabs`.
- `Policy.jsx` — `MetricCard` strip (replace with `KeyFiguresList` or remove; the metrics are duplicated in the recipe panel anyway).
- `Explorer.jsx` — rounded-top NavLink tab implementation (lines ~36–55) replaced with shared `Tabs` two-tier grouping.
- `SiteNav.jsx` — `backdropFilter: blur(12px)` and rgba background (becomes solid white with hairline rule).

**CSS classes that must die after `glass-morphism.css` is deleted:** `glass-card`, `nav-card`, `nav-card-*`, `pipeline-card`, `policy-brief-card-*` (becomes plain `<article>` with semantic hooks), `coverage-tier-*` (replaced by `CoverageTierTag`), `scenario-card-*` headers, `hero-section`, `hero-stats`, `hero-stat`, `count-up*`, `badge-pill-*`. All references must be search-and-replaced before the file is deleted (otherwise the build will compile-pass but visually break).

---

## 11. Acceptance criteria

The rebuild is complete when **every one** of the following is true:

1. **Impeccable score:** `npx impeccable --json src` returns `0` hits (currently 16). Run from `/Users/uthlekan/Library/CloudStorage/Dropbox/00Todo/00_ToReview/vacSeries/01_zero-dose/website`. Output file `impeccable-final.json` is committed alongside the polish commit.
2. **Nielsen heuristic re-score ≥ 30/40** (currently 17). The `/polish` skill runs the same heuristic checklist used in `/critique` and records per-heuristic scores in `docs/design-brief-editorial.md` under a new `Re-score` section.
3. **All 5 priority issues from `/critique` resolved** — each addressed issue carries an inline reference in the commit message of the skill that fixed it (e.g. `closes critique #P1`).
4. **Reduced-motion variant of every choreographed sequence** — `/animate` ships a paired `useReducedMotion` branch for every Story act and every Policy panel transition. Verified by Playwright test that toggles the media query and asserts identical final-state DOM.
5. **Print stylesheet preserved and updated** — `glass-morphism.css`'s `@media print` block is migrated into a dedicated `src/styles/print.css` (loaded only via `<link media="print">`), rewritten against the new typographic system: A4 page geometry, 11 pt body, 16 pt headings, hairline rules, no shadows, `MethodsDrawer` content prints as appendix, `OperationalHeadline` prints as the front page of any Policy brief.
6. **Source-of-truth coverage ≥ 95%** — automated check (`npm run check:sources`) walks every JSX file, finds every numeric literal that matches `\d+(\.\d+)?%?`, and asserts that ≥95% of those literals are wrapped in either a `<MetricWithCI>` or a `<MetricWithSource>` component. The `/clarify` skill writes that script.
7. **Branch is merge-ready against `main`** — no `console.log`, no `TODO` comments lacking owners, `npm run build` succeeds with zero warnings on `polish/editorial-rebuild`.

---

## Pipeline of execution after this brief

1. `/typeset` — install GT Sectra + Söhne (or Source Serif 4 + Source Sans 3 if budget blocks), wire the type scale, replace every `font-family: 'Inter'` reference, ship `font-display: swap` and self-hosted woff2.
2. `/quieter` — execute the cut list against `glass-morphism.css` and `tailwind.config.js`; introduce the OKLCH neutrals; remove every gradient, glow, blur, and pulse.
3. `/distill` — build the new editorial components (`EditorialBlock`, `EditorialHero`, `KeyFiguresList`, `AudienceEntryBlock`, `CoverageTierTag`, `OperationalHeadline`, `DecisionTreeFigure`, `MetricWithCI`); replace JSX usage of the cut components.
4. `/clarify` — implement the source-of-truth tooltip system, the methods drawer + route, the inline-CI helper, the glossary tooltip + route; write the `check:sources` script.
5. `/harden` — error states, empty states, the per-state policy brief generator (downstream of the new component grammar), text-overflow handling on long state names, i18n hooks where Hausa/Igbo/Yoruba transliteration may be needed.
6. `/layout` — execute the IA per route per §2; install the unified `Tabs` component; restructure Explorer into three sections; wire the persistent operational-headline strip.
7. `/animate` — implement Story scroll choreography per §8; wire reduced-motion branches; add the Policy slider→trajectory tween.
8. `/polish` — final consistency pass; rerun `impeccable`; rerun heuristic scoring; verify the seven acceptance criteria; commit `impeccable-final.json` and the re-score record.

---

*This brief is the bible for `polish/editorial-rebuild`. If a downstream skill needs to deviate, it edits this document first and notes the change in its commit message.*
