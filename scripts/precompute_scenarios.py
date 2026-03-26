"""
precompute_scenarios.py
=======================
Generate the interpolation grid for the counterfactual explorer.

5 outreach_mult x 4 engagement_rate x 4 supply_reduction x 2 typologies = 160 combos.
For each, compute expected coverage trajectory using the decision function betas
(from ml_to_abm_params.json) and logistic growth model.

Output: website/public/data/scenarios_interpolation_grid.json

Run from project root:
    python website/scripts/precompute_scenarios.py
"""

import json
import os
import sys
from pathlib import Path

import numpy as np

ROOT = Path(__file__).resolve().parent.parent.parent
OUT = ROOT / "website" / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)

PARAMS_PATH = ROOT / "outputs" / "stage1" / "ml_to_abm_params.json"
CNA_MATRIX_PATH = ROOT / "outputs" / "stage2" / "abm_to_cna_matrix.csv"

SEED = 42
np.random.seed(SEED)

# ── Parameter ranges ──────────────────────────────────────────────────────
OUTREACH_MULT = [0, 1, 2, 3, 4]          # multiplier (0x = no outreach, 4x = max)
ENGAGEMENT_RATE = [0, 0.05, 0.10, 0.15]  # additional engagement per month
SUPPLY_REDUCTION = [0, 0.25, 0.50, 0.75] # fraction of supply barriers removed
TYPOLOGIES = ["Reference", "Access-Constrained"]

# Trajectory length (months)
T_MAX = 60


def main():
    print("=" * 60)
    print("PRECOMPUTE SCENARIO INTERPOLATION GRID")
    print("=" * 60)

    # ── Load decision function coefficients ──────────────────────────────
    with open(PARAMS_PATH) as f:
        params = json.load(f)

    betas = params["decision_function_coefficients"]
    beta_0 = betas["beta_0"]
    beta_trust = betas["beta_trust"]
    beta_access = betas["beta_access"]
    beta_outreach = betas["beta_outreach"]
    beta_supply = betas["beta_supply"]
    beta_peer = betas["beta_peer"]

    print(f"  Decision function betas loaded:")
    print(f"    beta_0={beta_0}, beta_trust={beta_trust}, beta_access={beta_access}")
    print(f"    beta_outreach={beta_outreach}, beta_supply={beta_supply}, beta_peer={beta_peer}")

    # ── Typology baseline parameters ─────────────────────────────────────
    # From the ABM CNA matrix: S0 baselines
    # Reference:        baseline_engagement=0.1604, baseline_access=0.5825, S0 coverage=0.7146
    # Access-Constrained: baseline_engagement=0.1184, baseline_access=0.4786, S0 coverage=0.5081
    typology_params = {
        "Reference": {
            "baseline_engagement": 0.1604,
            "baseline_access": 0.5825,
            "mean_trust": 0.55,         # weighted average trust across classes
            "s0_coverage_m36": 0.7146,
            "initial_coverage": 0.40,   # approximate 2013 starting coverage
        },
        "Access-Constrained": {
            "baseline_engagement": 0.1184,
            "baseline_access": 0.4786,
            "mean_trust": 0.35,         # lower trust in access-constrained
            "s0_coverage_m36": 0.5081,
            "initial_coverage": 0.25,   # approximate 2013 starting coverage
        },
    }

    # ── Generate grid ────────────────────────────────────────────────────
    grid = []
    for typology in TYPOLOGIES:
        tp = typology_params[typology]
        for outreach_mult in OUTREACH_MULT:
            for engagement_rate in ENGAGEMENT_RATE:
                for supply_reduction in SUPPLY_REDUCTION:
                    # Compute intervention effect using decision function
                    # The decision function gives probability of vaccination acceptance:
                    # logit(p) = beta_0 + beta_trust*trust + beta_access*access
                    #          + beta_outreach*outreach + beta_supply*supply + beta_peer*peer
                    #
                    # We model the interventions as modifying the input variables:
                    # - outreach_mult: scales the outreach term (0 = none, 1 = baseline ABM, 4 = max)
                    # - engagement_rate: additive to trust (community engagement raises trust)
                    # - supply_reduction: reduces supply barriers (improves access)

                    # Effective values after intervention
                    effective_trust = np.clip(
                        tp["mean_trust"] + engagement_rate * 3.0,  # engagement boosts trust
                        0, 1,
                    )
                    effective_access = np.clip(
                        tp["baseline_access"] + supply_reduction * (1.0 - tp["baseline_access"]) * 0.5,
                        0, 1,
                    )
                    outreach_val = outreach_mult / 4.0  # normalise to [0, 1]

                    # Peer effect: increases with coverage (self-reinforcing)
                    # Use S0 coverage as starting peer estimate
                    peer_effect = tp["s0_coverage_m36"]

                    # Compute logit
                    logit_p = (
                        beta_0
                        + beta_trust * effective_trust
                        + beta_access * effective_access
                        + beta_outreach * outreach_val
                        + beta_supply * supply_reduction
                        + beta_peer * peer_effect
                    )

                    # Sigmoid to get steady-state acceptance probability
                    steady_state_p = 1.0 / (1.0 + np.exp(-logit_p))

                    # Map acceptance probability to coverage
                    # Coverage = acceptance * access * (1 - supply_barrier_remaining)
                    supply_barrier_remaining = max(0, 1.0 - supply_reduction)
                    effective_coverage = steady_state_p * effective_access * (
                        1.0 - 0.15 * supply_barrier_remaining  # 15% max supply penalty
                    )

                    # Clip to plausible range
                    final_coverage = np.clip(effective_coverage, 0.05, 0.98)

                    # Generate logistic trajectory
                    initial = tp["initial_coverage"]
                    amplitude = final_coverage - initial

                    if abs(amplitude) < 0.001:
                        trajectory = [round(initial, 4)] * T_MAX
                    else:
                        # Midpoint and growth rate
                        t_mid = 18
                        # Solve for k from month 36 target
                        ratio = np.clip(0.92, 0.01, 0.99)  # 92% of amplitude reached by month 36
                        k = -np.log(1.0 / ratio - 1.0) / (36 - t_mid)

                        trajectory = []
                        for t in range(1, T_MAX + 1):
                            cov = initial + amplitude / (1 + np.exp(-k * (t - t_mid)))
                            trajectory.append(round(float(cov), 4))

                    # Compute month 36 stats (median, p025, p975)
                    # Add small uncertainty band (+-2% at 95% CI)
                    m36 = trajectory[35] if len(trajectory) >= 36 else trajectory[-1]
                    uncertainty = 0.02 * m36  # 2% relative uncertainty
                    p025 = round(max(0, m36 - 1.96 * uncertainty), 4)
                    p975 = round(min(1, m36 + 1.96 * uncertainty), 4)

                    grid.append({
                        "outreach_mult": outreach_mult,
                        "engagement_rate": engagement_rate,
                        "supply_reduction": supply_reduction,
                        "typology": typology,
                        "trajectory": trajectory,
                        "median_m36": round(m36, 4),
                        "p025_m36": p025,
                        "p975_m36": p975,
                    })

    result = {
        "grid": grid,
        "param_ranges": {
            "outreach_mult": OUTREACH_MULT,
            "engagement_rate": ENGAGEMENT_RATE,
            "supply_reduction": SUPPLY_REDUCTION,
        },
        "typologies": TYPOLOGIES,
        "trajectory_months": T_MAX,
        "decision_coefficients": betas,
    }

    outfile = OUT / "scenarios_interpolation_grid.json"
    with open(outfile, "w") as f:
        json.dump(result, f)

    file_size = outfile.stat().st_size
    print(f"\n  Grid points: {len(grid)}")
    print(f"  Typologies: {TYPOLOGIES}")
    print(f"  Sample trajectory length: {len(grid[0]['trajectory'])}")
    print(f"  File size: {file_size / 1024:.0f} KB")
    print(f"  Output: {outfile}")

    # Validate
    assert len(grid) == len(OUTREACH_MULT) * len(ENGAGEMENT_RATE) * len(SUPPLY_REDUCTION) * len(TYPOLOGIES), \
        f"Expected {len(OUTREACH_MULT) * len(ENGAGEMENT_RATE) * len(SUPPLY_REDUCTION) * len(TYPOLOGIES)} grid points, got {len(grid)}"
    assert len(grid[0]["trajectory"]) == T_MAX, \
        f"Expected trajectory length {T_MAX}, got {len(grid[0]['trajectory'])}"
    assert file_size < 500 * 1024, \
        f"File too large: {file_size / 1024:.0f} KB (target < 500 KB)"

    print("\n  All validations passed.")
    print("=" * 60)


if __name__ == "__main__":
    main()
