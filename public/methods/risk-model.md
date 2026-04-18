# Stage 1 — Risk model

## Sample

- **Source** — NDHS 2024 Children's Recode (`NGKR8BFL`).
- **Inclusion** — children aged 12–23 months (`v008 - b3`), alive (`b5 == 1`), with valid `h3`.
- **Analytic n** — 4,875 children across 1,283 DHS clusters; weighted by `v005 / 1e6`.
- **Outcome** — `zerodose = 1` if `h3 == 0` (no DTP1 received), else `0`.

## Features

40 candidate features grouped as:

- **Caregiver & household** — maternal age, education, parity, religion, ethnicity, wealth quintile, urban/rural.
- **Access** — log-transformed travel time `v483a`, distance/cost/permission barriers `v467b–d`.
- **Care-seeking** — vaccination card (`h1a`), ANC visits (`m14`), facility delivery (`m15` ∈ 20–46), tetanus injection.
- **Trust proxies (NDHS 2024-only)** — `s1112s` (willing to receive COVID-19 vaccine), `s1112p` (received COVID-19 vaccine).
- **Cluster-level** — DPT1 coverage, ZD prevalence aggregates.
- **GPS covariates** — malaria prevalence, ITN coverage, travel time to nearest city, nightlights, population density (135 variables from `NGGC8AFL`).

## Models

### XGBoost classifier

- **Split** — 70/30 train/test, stratified by `zerodose` and `szone`.
- **Hyperparameters** — Bayesian optimisation, 5-fold CV on training set.
- **Test performance** — AUC-ROC = **0.972** (on held-out 30%, n = 1,463).
- **Feature attribution** — TreeSHAP. Top features: cluster DPT1 coverage (mean |SHAP| = 1.62), vaccination card possession (1.34), cluster ZD prevalence (0.37).

### Latent Class Analysis (LCA)

- **Indicators** — 10 dichotomous trust + care-seeking variables (`h1a`, `m14`, `m15`, `s1112s`, `s1112p`, `v393`, `v394`, `v467b`, `v467c`, `v467d`).
- **Selection** — k = 2..6 by BIC; **k = 4** optimal (BIC = 52,150.1).
- **Mapping to ABM trust states** — the four LCA classes were mapped post-hoc to three ABM trust states:
  - **Willing** (15.7%, mean trust = 0.953)
  - **Hesitant** (55.9%, mean trust = 0.487)
  - **Refusing** (28.4%, mean trust = 0.063)

### Cluster typology

- **Method** — k-means on cluster-aggregated features (silhouette-optimal k = 2; silhouette = 0.32).
- **Result** — **Reference (60.9%)** and **Access-Constrained (39.1%)**.

## Outputs

- `outputs/stage1/xgb_metrics.json` — AUC, calibration, confusion matrix.
- `outputs/stage1/lca_summary.json` — class profiles + BIC.
- `outputs/stage1/typology_summary.json` — cluster-level assignments.
- `outputs/stage1/ml_to_abm_params.json` — handoff payload to Stage 2.
