# Stage 2 — Digital twin (Agent-Based Model)

## Setup

- **Agents** — one per simulated child; 30 children per cluster across 1,283 NDHS clusters (38,490 agents per simulation).
- **Time step** — monthly; horizon 60 months.
- **State variables per agent** — trust (Willing / Hesitant / Refusing), distance to facility, peer exposure, intervention exposure (outreach × engagement × supply).

## Decision rule

Each month an agent decides whether to vaccinate via a logistic decision function:

```
P(vaccinate) = sigmoid(
    β₀
  + β_trust    × trust_score
  + β_access   × (1 − access_friction)
  + β_outreach × outreach_intensity
  + β_supply   × supply_quality
  + β_peer     × peer_coverage
)
```

Coefficients (`β`) are inherited from the Stage-1 ML decision-function fit (`outputs/stage1/ml_to_abm_params.json`) and re-scaled during ABC calibration.

## Calibration

- **Method** — Approximate Bayesian Computation – Population Monte Carlo (ABC-PMC).
- **Targets** — NDHS 2018 cluster-level DTP1 coverage (national + LGA stratification).
- **Acceptance threshold** — RMSE ≤ 0.10 over 5 PMC generations.
- **In-sample fit** — RMSE = **0.033** (target ≤ 0.10, easily met).
- **NW disruption parameter** — posterior median = 1.73 (95% CrI 0.56 – 2.48), capturing the residual structural effect of insecurity in the North-West zone.

## Validation

- **Out-of-sample** — held-out NDHS 2024 national + zone coverage.
- **National RMSE** — **0.070**.
- **Zone RMSE** — **0.075**.
- **Zone Spearman r** — **0.943** (p = 0.005 across six zones).

The model marginally exceeds the 0.10 RMSE budget at the zone level for NW and NC, attributable to structural shocks (insecurity, displacement) outside the model's parameter set; sensitivity analyses are reported in the supplementary material.

## Scenarios

| Code | Outreach | Community engagement | Supply reinforcement |
|------|----------|----------------------|----------------------|
| S0 | × | × | × |
| S1 | ✓ | × | × |
| S2 | × | ✓ | × |
| S3 | × | × | ✓ |
| S4 | ✓ | ✓ | × |
| S5 | ✓ | ✓ | ✓ |

Each scenario × typology combination is run for 200 stochastic draws.

## Outputs

- `outputs/stage2/calibrated_params.json` — ABC-PMC posterior draws.
- `outputs/stage2/abm_validation_report.md` — out-of-sample fit.
- `outputs/stage2/abm_to_cna_matrix.csv` — month-36 + month-60 coverage with simulation CIs (handoff payload to Stage 3).
