# Pipeline overview

This study uses an integrated three-stage pipeline grounded in the **Nigeria Demographic and Health Survey 2024** (NDHS 2024) to identify operational recipes for vaccination-coverage recovery in zero-dose communities.

## Data

- **Primary wave** — NDHS 2024 (n = 4,875 children aged 12–23 months across 1,283 clusters).
- **Calibration waves** — NDHS 2013 and 2018 used only to fit the agent-based model.
- **Outcome variable** — `h3 = 0` (no DTP1 received). This is the WHO operational definition of "zero-dose".
- **Survey design** — case weights `v005 / 1e6` applied throughout; PSU `v021`, strata `v023`.

## Three stages

1. **Risk model (Stage 1)** — XGBoost classifier predicts zero-dose status from caregiver, household, and cluster-level features. SHAP attributes feature importance. Latent Class Analysis derives Willing/Hesitant/Refusing trust states. K-means produces the two community typologies (Reference, Access-Constrained).

2. **Digital twin (Stage 2)** — agent-based model with one agent per child, calibrated against 2013 and 2018 cluster-level coverage and validated out-of-sample against 2024. Twelve scenarios (six intervention combinations × two typologies) are simulated forward 60 months.

3. **Causal recipes (Stage 3)** — Coincidence Analysis identifies the minimal sufficient combinations of intervention components that recover coverage to ≥80%.

## Key results

- National weighted zero-dose prevalence: **36.8%**.
- Spatial autocorrelation: **Moran's I = 0.608** (z = 5.99, p < 1×10⁻⁶).
- Two community typologies — **Reference (60.9%)** and **Access-Constrained (39.1%)**.
- Reference communities reach 80% coverage with **outreach alone (S1)**.
- Access-Constrained communities require the **full package (S5)**: outreach + community engagement + supply reinforcement.

See the per-stage methods drawers for full detail.
