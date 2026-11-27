# Stage 1: Risk model

## Sample

- **Source**: NDHS 2024 Children's Recode.
- **Inclusion**: children aged 12 to 23 months, alive at the survey, one child per mother, with known outcome.
- **Analytic n**: 4,875 children across 1,283 survey clusters.
- **Outcome**: zero-dose, no dose of a DTP-containing vaccine (card or recall).
- **Split**: training 70% (n = 3,412) and test 30% (n = 1,463), stratified by geopolitical zone and zero-dose status; a second split kept every survey cluster wholly in one set.

## Predictors

Thirty predictors, chosen before analysis and organised by the Three Delays framework:

- **Delay 1, deciding to seek**: card possession, antenatal visits, place of delivery, a health-seeking composite (card, antenatal care, facility delivery, maternal tetanus vaccination), facility visit in the past 12 months, permission and money barriers, religion, women's health-care decision-making, maternal education and literacy.
- **Delay 2, reaching a facility**: residence, distance as a barrier, reported and modelled travel time.
- **Delay 3, receiving the service**: no direct supply or quality measure was available; COVID-19 vaccine receipt and willingness served as proxies, with a family-planning fieldworker visit and radio listening.
- **Context**: wealth, maternal age, parity, ethnicity (NDHS `v131` code), population density, elevation, malaria prevalence, insecticide-treated net coverage, state and zone.

## XGBoost classifier

- **Tuning**: Optuna, 50 candidate configurations, 5-fold cross-validation repeated 20 times; survey weights as sample weights; missing values (1.5% of cells) imputed by chained equations.
- **Test performance**: AUC **0.947** (95% CI 0.930 to 0.961, cluster bootstrap); accuracy 90.1%; precision-recall AUC 0.927 (survey-weighted).
- **Calibration**: slope 1.01, Brier score 0.081; the Hosmer-Lemeshow test showed miscalibration across risk deciles (chi-square 25.56, p = 0.001).
- **Without card information** (card variable removed, composite rebuilt without it; post hoc): AUC **0.842** (95% CI 0.814 to 0.869).
- **SHAP**: card possession (mean absolute SHAP 1.46), health-seeking composite (0.53), antenatal visits (0.27), maternal education (0.19), facility visit (0.18). SHAP describes how the model uses each variable, not causal effects.
- **Fairness**: at a 0.5 threshold, sensitivity ranged from 0.964 (poorest quintile) to 0.333 (richest); equal-opportunity gap 0.631 (95% CI 0.365 to 0.964).

## Latent class analysis of caregiver engagement

- **Indicators**: four or more antenatal visits, facility delivery, card possession, formal care for a recent illness, family-planning fieldworker visit, facility visit in the past 12 months, mother's participation in her own health-care decisions, no permission barrier, COVID-19 vaccine receipt and willingness. The permission indicator was constant and dropped, leaving nine.
- **Fit**: 4,898 children (the analytic sample plus 23 with unknown DTP1 status); four classes selected by BIC (52,150.1).
- **Classes**: Class 1, low engagement (28.4%; 81.9% zero-dose); Class 2, intermediate, COVID-19 vaccinated or unwilling (26.6%; 19.1%); Class 3, high engagement (29.2%; 13.0%); Class 4, intermediate, willing but unvaccinated for COVID-19 (15.7%; 22.4%).
- The classes describe engagement with services, not attitudes. The two COVID-19 items are linked by the survey's skip pattern.

## Community typology

- **Method**: k-means (k = 2) on three cluster-level measures: a SHAP-derived access score, insecticide-treated net coverage and median travel time (silhouette 0.321).
- **Result**: Reference (60.9%, n = 781) and Access-Constrained (39.1%, n = 502).
