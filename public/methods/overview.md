# Pipeline overview

This study links a machine learning risk model to an agent-based simulation and a health economic model, using the **2024 Nigeria Demographic and Health Survey** (NDHS 2024). It asks who the zero-dose children are and which intervention packages could reach them.

## Data

- **Primary wave**: NDHS 2024 (n = 4,875 children aged 12 to 23 months, one per mother, across 1,283 survey clusters).
- **Simulation waves**: NDHS 2013 supplied the simulation's starting state; NDHS 2018 and 2024 were calibration targets.
- **Outcome**: zero-dose status, no dose of a DTP-containing (pentavalent) vaccine by card or maternal recall.
- **Survey design**: weights `v005 / 1e6` applied to prevalence estimates and model fitting; the latent class and causal analyses were unweighted.

## Stages

1. **Risk model (Stage 1)**: an XGBoost classifier with 30 predictors organised by the Three Delays framework estimates zero-dose risk; SHAP describes which variables the model uses. Latent class analysis describes caregivers' engagement with services (four classes). K-means groups survey clusters into two community types (Reference, Access-Constrained).
2. **Linked simulation (Stage 2)**: an agent-based simulation of 38,490 virtual children, calibrated to NDHS 2018 and 2024, runs six intervention packages in each community type for 60 months. Because 2024 was a calibration target, the simulation has no independent validation.
3. **Intervention configurations (Stage 3)**: Coincidence Analysis identifies which simulated packages reach 80% DTP1 coverage by month 60.
4. **Economic evaluation (Stage 4)**: each package is compared with the status quo and then incrementally along the efficiency frontier.

## Key results

- National weighted zero-dose prevalence: **36.8%**; spatially clustered (Moran's I = 0.607, p < 0.001).
- Risk model AUC **0.947** (95% CI 0.930 to 0.961); **0.842** (95% CI 0.814 to 0.869) without any card information. Markers of prior health-system contact were the strongest predictors.
- Most zero-dose children were in the low-engagement class (Class 1; 81.9% zero-dose).
- Reference communities (60.9%) reached 80% with **outreach alone (S1)** within three years. Access-Constrained communities (39.1%) reached 80% only with the **full package (S5)**, and only by month 60.
- Supply-chain reinforcement alone was cost-saving. Outreach was the efficient choice at USD 800 per DALY averted; the full package cost **USD 1,094** (Access-Constrained) and **USD 1,889** (Reference) per DALY averted beyond outreach.

All outputs are pre-computed; the dashboard is not connected to live health-system data. See the per-stage methods drawers for detail.
