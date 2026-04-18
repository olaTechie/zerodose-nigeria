# Branch status: `polish/editorial-rebuild`

**Status: PARKED — do not merge.**

This branch contains a full editorial rebuild of the website (OWID/Pew language, glass-morphism deleted, source-of-truth pattern, scroll choreography, etc.). It was reviewed by the project owner on 2026-04-18 and the design was deemed **too simplified** for the dashboard's audience.

The canonical published design remains on `main` (commit `f3a4c8d`).

## What's here

- 11 commits implementing 9 sequential `impeccable:*` skills
- `docs/design-brief-editorial.md` (343 lines) — the design rationale
- `docs/rebuild-completion-report.md` — gate-by-gate verification + Nielsen re-score (17 → 33 / 40)
- All-pass acceptance gates: `npx impeccable --json src` returns 0; `npm run build` clean

## Why it's preserved

If a future redesign is contemplated, this branch is the most thorough exploration of an alternative direction available — particularly the source-of-truth pattern, the `MethodsDrawer`, and the per-zone scroll choreography. Several pieces are cherry-pick candidates into `main` without adopting the full editorial language; see the closed PR #1 comment for the list.

## Why it was rejected

The editorial language was *too restrained* for a dashboard whose audience (NPHCDA programme managers, state commissioners, academic researchers) signals seriousness through visible information density rather than typographic minimalism. The OWID/Pew aesthetic suits long-form prose; this product is closer to an operational console.
