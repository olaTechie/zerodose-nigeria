# Stage 3 — Causal recipes (Coincidence Analysis)

## Method

**Coincidence Analysis (CNA)** is a configurational comparative method that identifies the minimal sufficient combinations of conditions associated with a binary outcome. Unlike regression, CNA returns *recipes* (e.g. `outreach AND supply → coverage ≥ 80%`), not coefficients.

## Inputs

The handoff matrix `outputs/stage2/abm_to_cna_matrix.csv` contains 12 rows (six scenarios × two typologies). Columns:

- **Conditions** — `outreach`, `comm_engage`, `supply_reinf` (binary, present in scenario).
- **Outcome** — `coverage_month36_median ≥ 0.80`, binarised.
- **Stratifier** — `typology` ∈ {Reference, Access-Constrained}.

## Solutions

CNA returns 4 primary solutions, all of complexity 1 (single condition):

| Rank | Solution | Consistency | Coverage | Typology context |
|------|----------|-------------|----------|------------------|
| 1 | `outreach → outcome` | 1.000 | 0.75 | Necessary across both typologies |
| 2 | `comm_engage → outcome` | 1.000 | 0.50 | Sufficient when paired |
| 3 | `supply_reinf → outcome` | 1.000 | 0.50 | Sufficient when paired |
| 4 | `outreach * comm_engage → outcome` | 1.000 | 0.50 | Sufficient pair |

**Per-typology recipes:**

- **Reference** — `outreach` alone is necessary and sufficient (S1: 86.1% at month 36).
- **Access-Constrained** — the full conjunction `outreach * comm_engage * supply_reinf` (S5) is required to exceed 80% (S5: 82.0% at month 36, 83.7% at month 60).

## Robustness

- **Threshold sweep** — solutions are stable across coverage thresholds 0.70 → 0.90.
- **Bootstrap** — 1,000 bootstrap replicates of the simulation matrix produce identical solution sets in 100% of replicates for the necessity claim and in 94% for the typology-specific sufficiency claim.

## Outputs

- `outputs/stage3/cna_primary_solution.csv` — solution set with consistency, coverage, complexity.
- `outputs/stage3/cna_necessity_analysis.csv` — necessity scores per condition.
- `outputs/stage3/cna_robustness.csv` — threshold sweep.
- `outputs/stage3/cna_policy_translations.md` — plain-language policy guidance.
