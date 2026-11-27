# Stage 3: Intervention configurations (Coincidence Analysis)

## Method

**Coincidence Analysis (CNA)** is a configurational method that identifies which combinations of conditions are necessary and sufficient for an outcome. It was applied to the 12 simulated scenario-by-community-type cells.

- **Conditions**: `outreach`, `comm_engage`, `supply_reinf` (present in the scenario or not), and community type.
- **Outcome**: median simulated DTP1 coverage of at least 80% at **month 60**.
- **Robustness**: 200 bootstrap resamples, and a sweep of coverage thresholds from 0.70 to 0.90.

## Results

Four of the 12 cells reached the target by month 60: Reference S1, S4 and S5, and Access-Constrained S5.

| Condition | Necessity consistency |
|-----------|-----------------------|
| outreach | 1.00 |
| comm_engage | 0.75 |
| supply_reinf | 0.50 |

Solution set (consistency, coverage): `outreach` (1.00, 0.75); `supply_reinf` (0.75, 0.75); `ACCESS_CONSTRAINED` (0.83, 0.63); `comm_engage` (0.83, 0.63).

- Outreach was present in every configuration reaching 80% by month 60.
- Outreach alone sufficed in Reference communities.
- In Access-Constrained communities only the full package reached the target; outreach with engagement did not, and outreach with supply reinforcement alone was not simulated, so whether engagement is required cannot be determined.

## Interpretation

The configurations describe which simulated packages reach the target and inherit the simulation's assumptions. They are not empirical causal effects.
