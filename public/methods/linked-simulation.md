# Stage 2: Linked simulation (agent-based model)

## Structure

- **Agents**: 38,490 virtual children, 30 in each of 1,283 survey clusters.
- **State per agent**: an engagement score from the child's latent class, distance to the nearest facility, neighbourhood vaccination coverage and intervention exposure.
- **Time step**: monthly, for five years (60 months).
- **Social influence**: an agent's engagement score rises by a peer-influence increment when the share of vaccinated neighbours exceeds a threshold.

## Decision rule

Each month a virtual child's probability of vaccination depends on their engagement score (the trust score in the simulation code), access difficulty, the intensity of any simulated intervention and the share of vaccinated neighbours. The coefficients were estimated from the survey data by logistic regression, using an access score derived from the risk model's SHAP values: engagement score 0.434, access score 0.193, outreach 0.241, intercept 0.552.

## Calibration

- **Method**: rejection approximate Bayesian computation. Starting from the 2013 survey, 2,000 parameter sets were drawn from their priors and the 200 (10%) closest to observed DTP1 coverage, on the mean of the distances to NDHS 2018 and 2024, were accepted.
- **Parameters**: 14 calibrated (scenarios use the posterior medians); two fixed (theta_p 0.4, lambda_r 0.025).
- **Fit to 2018**: simulated national coverage 61.1% against 65.0% observed (error 3.9 percentage points); zone root mean squared error 4.3 points.
- **Fit to 2024**: simulated 70.2% against 63.2% observed (an overestimate of 7.0 points); zone root mean squared error 7.5 points; largest in North-Central (16.0 points).
- **Zone rank correlation**: 0.943 for both surveys (six zones).

Because NDHS 2024 was a calibration target, these figures are calibration fit and the simulation has **no independent validation**.

## Zone disruption parameters

Six zone parameters were similar (posterior medians 1.40 to 1.73) with wide, overlapping intervals (about 0.52 to 2.48). They do not identify a distinct effect of insecurity in any zone.

## Scenarios

| Code | Outreach | Community engagement | Supply-chain reinforcement |
|------|----------|----------------------|----------------------------|
| S0 | no | no | no |
| S1 | yes | no | no |
| S2 | no | yes | no |
| S3 | no | no | yes |
| S4 | yes | yes | no |
| S5 | yes | yes | yes |

Each scenario was simulated in both community types (12 cells, 500 stochastic replicates each). Coverage was saved at months 36 and 60.
