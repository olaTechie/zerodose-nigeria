"""
refresh_paper1_revision.py
==========================
Rebuilds the dashboard data files that changed with the revised Paper 1
(November 2026). Reads only; writes JSON into public/data/.

Sources
  --outputs   committed pipeline outputs (01_zero-dose/outputs/)
  --revision  revision re-analysis outputs (Manuscripts/revision_analysis/paper1/output/)

Files written
  abm_scenarios.json          12 simulated scenario-typology cells, months 36 and 60,
                              medians and 95% simulation intervals (no interpolated curves)
  shap_importance.json        committed model's global and zone-stratified mean |SHAP|
  meta.json                   headline metrics used across the site
  lca_profiles.json           four caregiver engagement classes (no three-state collapse)
  calibration_posteriors.json 200 accepted draws of the 14 calibrated parameters
  economics.json              against-status-quo table and incremental frontier
  fairness.json               equal-opportunity gaps and sensitivity by subgroup
  moran_scatter.json          state z-scores and true spatial lags for the Moran scatterplot
  cna_solutions.json          plain-language block removed; numeric tables unchanged

Maps, Table 1 and the CNA solution files are unchanged: they already match the
committed outputs (see prepare_website_data.py for those builders).

Run from the repository root:
    python scripts/refresh_paper1_revision.py \
        --outputs  /path/to/01_zero-dose/outputs \
        --revision /path/to/revision_analysis/paper1/output
"""

import argparse
import json
import math
from pathlib import Path

import numpy as np
import pandas as pd

HERE = Path(__file__).resolve().parent
OUT = HERE.parent / "public" / "data"

SCENARIO_LABELS = {
    "S0": "Status quo",
    "S1": "Mobile outreach only",
    "S2": "Community engagement only",
    "S3": "Supply-chain reinforcement only",
    "S4": "Outreach + engagement",
    "S5": "Full package (outreach + engagement + supply)",
}

CLASS_LABELS = {
    "Class_1": ("Class 1", "Low engagement", "Low"),
    "Class_2": ("Class 2", "Intermediate engagement, COVID-19 vaccinated or unwilling", "Intermediate A"),
    "Class_3": ("Class 3", "High engagement", "High"),
    "Class_4": ("Class 4", "Intermediate engagement, willing but unvaccinated for COVID-19", "Intermediate B"),
}

INDICATOR_LABELS = {
    "anc_4plus": "Four or more antenatal visits",
    "facility_del": "Facility delivery",
    "has_card": "Vaccination card",
    "formal_care": "Formal care for a recent illness",
    "fw_visit": "Family-planning fieldworker visit",
    "facility_visit": "Facility visit in past 12 months",
    "self_decides": "Mother takes part in own health-care decisions",
    "covid_received": "Received COVID-19 vaccine",
    "covid_willing": "Willing to receive COVID-19 vaccine",
}

CALIBRATED_PARAMS = [
    "delta_p", "delta_r", "beta_rumour", "delta_l", "alpha", "logit_shift",
    "beta_peer", "beta_supply",
    "disruption_NC", "disruption_NE", "disruption_NW",
    "disruption_SE", "disruption_SS", "disruption_SW",
]


def r(v, n=4):
    if v is None:
        return None
    try:
        f = float(v)
    except (TypeError, ValueError):
        return None
    if math.isnan(f):
        return None
    return round(f, n)


def write(name, obj):
    path = OUT / name
    with open(path, "w") as fh:
        json.dump(obj, fh, indent=2)
    print(f"  wrote {path.name:30s} {path.stat().st_size / 1024:7.1f} KB")


def build_abm(outputs):
    m = pd.read_csv(outputs / "twin" / "abm_to_cna_matrix.csv")
    # The configuration outcome is median coverage >= 0.80 at month 60.
    assert ((m["coverage_month60_median"] >= 0.80).astype(int) == m["outcome_binary"]).all()
    # Medians and percentiles from the raw replicates, so that displayed values are
    # rounded once (the matrix CSV is already rounded to 4 dp). Checked against the matrix.
    raw = pd.read_parquet(outputs / "twin" / "abm_raw_results.parquet")
    rows = []
    for _, x in m.iterrows():
        rep = raw[(raw["scenario_id"] == x["scenario_id"]) & (raw["typology"] == x["typology"])]
        assert len(rep) == 500
        stats = {}
        for month in ("36", "60"):
            v = rep[f"coverage_month{month}"].to_numpy()
            for name, val in (("median", np.median(v)), ("p025", np.percentile(v, 2.5)), ("p975", np.percentile(v, 97.5))):
                key = f"coverage_month{month}_{name}"
                assert abs(val - x[key]) < 6e-5, (key, val, x[key])
                stats[key] = r(val, 6)
        rows.append({
            "scenario_id": x["scenario_id"],
            "typology": x["typology"],
            "outreach": int(x["outreach"]),
            "comm_engage": int(x["comm_engage"]),
            "supply_reinf": int(x["supply_reinf"]),
            **stats,
            "reaches_80_by_month60": int(x["outcome_binary"]),
        })
    write("abm_scenarios.json", {
        "source": "outputs/twin/abm_raw_results.parquet, checked against abm_to_cna_matrix.csv (500 replicates per cell)",
        "note": "Simulated coverage at months 36 and 60 only; no monthly trajectories were saved.",
        "matrix": rows,
        "scenarioLabels": SCENARIO_LABELS,
    })


def build_shap(outputs):
    g = pd.read_csv(outputs / "tables" / "shap_global_importance.csv")
    z = pd.read_csv(outputs / "tables" / "shap_zone_stratified.csv")
    global_list = [
        {"feature": x["feature"], "display": x["feature_display"],
         "shap": r(x["mean_abs_shap"]), "rank": int(x["rank"])}
        for _, x in g.sort_values("rank").iterrows()
    ]
    by_zone = {}
    for zone, d in z.groupby("zone"):
        d = d.sort_values("mean_abs_shap", ascending=False).reset_index(drop=True)
        by_zone[zone] = [
            {"feature": x["feature"], "display": x["feature_display"],
             "shap": r(x["mean_abs_shap"]), "rank": i + 1}
            for i, x in d.iterrows()
        ]
    write("shap_importance.json", {
        "source": "outputs/tables/shap_global_importance.csv, shap_zone_stratified.csv",
        "note": "Mean absolute SHAP value (log-odds). SHAP describes the model's predictions, not causal effects.",
        "global": global_list,
        "byZone": by_zone,
    })
    return global_list


def build_lca(outputs, revision):
    prof = pd.read_csv(outputs / "tables" / "lca_trust_profiles.csv")
    zd = pd.read_csv(revision / "03c_zero_dose_by_published_class.csv")
    side = pd.read_csv(revision / "03c_profiles_side_by_side.csv", header=[0, 1], index_col=0)
    classes = []
    for _, p in prof.iterrows():
        cid = p["assigned_class"]
        name, label, short = CLASS_LABELS[cid]
        zrow = zd[zd["assigned_class"] == cid].iloc[0]
        items = {}
        for ind, lab in INDICATOR_LABELS.items():
            v = side.loc[ind, ("with_card", cid)]
            items[ind] = r(v, 3)
        classes.append({
            "id": cid,
            "name": name,
            "label": label,
            "shortLabel": short,
            "share": r(p["proportion"]),
            "n": int(zrow["n"]),
            "zeroDoseUnweighted": r(zrow["zero_dose_unweighted"]),
            "zeroDoseWeighted": r(zrow["zero_dose_weighted"]),
            "simulationEngagementScore": r(p["mean_trust"], 3),
            "itemResponse": items,
        })
    write("lca_profiles.json", {
        "source": ("outputs/tables/lca_trust_profiles.csv (class shares, published fit); "
                   "revision_analysis 03c_zero_dose_by_published_class.csv; "
                   "03c_profiles_side_by_side.csv (item-response probabilities, refit with card)"),
        "bic": 52150.1,
        "nFitted": 4898,
        "indicatorLabels": INDICATOR_LABELS,
        "classes": classes,
    })


def build_posteriors(outputs):
    d = pd.read_csv(outputs / "twin" / "abm_calibration_posteriors.csv")
    assert len(d) == 200
    posteriors = [{c: r(x[c]) for c in CALIBRATED_PARAMS} for _, x in d.iterrows()]
    summary = {}
    for c in CALIBRATED_PARAMS:
        v = d[c]
        summary[c] = {"median": r(v.median()), "p025": r(v.quantile(0.025)), "p975": r(v.quantile(0.975))}
    write("calibration_posteriors.json", {
        "source": "outputs/twin/abm_calibration_posteriors.csv",
        "method": ("Rejection approximate Bayesian computation: 2,000 prior draws, 200 (10%) accepted "
                   "on the mean distance to NDHS 2018 and 2024 DTP1 coverage. Scenarios use posterior medians."),
        "parameters": CALIBRATED_PARAMS,
        "posteriors": posteriors,
        "summary": summary,
    })


def build_economics(revision):
    t2 = pd.read_csv(revision / "04_table2_rebuilt.csv")
    fr = pd.read_csv(revision / "04_frontier.csv")
    vs = []
    for _, x in t2.iterrows():
        vs.append({
            "scenario_id": x["scenario"],
            "label": x["label"],
            "typology": x["typology"],
            "cost": r(x["mean_cost"], 0), "cost_low": r(x["cost_ui_low"], 0), "cost_high": r(x["cost_ui_high"], 0),
            "dalys": r(x["mean_dalys"], 0), "dalys_low": r(x["dalys_ui_low"], 0), "dalys_high": r(x["dalys_ui_high"], 0),
            "icer": r(x["icer"], 2),
            "cost_saving": bool(x["mean_cost"] < 0 and x["mean_dalys"] > 0),
            "p_dominant": r(x["p_dominant"], 3),
            "p_ce_800": r(x["p_ce_800"], 3), "p_ce_2400": r(x["p_ce_2400"], 3), "p_ce_7200": r(x["p_ce_7200"], 3),
        })
    frontier = []
    for _, x in fr.iterrows():
        frontier.append({
            "typology": x["typology"],
            "scenario_id": x["scenario"],
            "cost": r(x["mean_cost"], 0),
            "dalys": r(x["mean_dalys_averted"], 0),
            "status": x["status"],
            "compared_with": None if pd.isna(x["compared_with"]) else x["compared_with"],
            "incremental_icer": r(x["incremental_icer"], 2),
            "breakeven_800": r(x["breakeven_daly_median_800"], 8),
            "breakeven_2400": r(x["breakeven_daly_median_2400"], 8),
            "breakeven_7200": r(x["breakeven_daly_median_7200"], 8),
        })
    write("economics.json", {
        "source": "revision_analysis/paper1/output/04_table2_rebuilt.csv, 04_frontier.csv",
        "settings": {
            "perspective": "societal",
            "horizon_years": 5,
            "discount_rate": 0.03,
            "psa_draws": 5000,
            "thresholds_usd": [800, 2400, 7200],
            "daly_per_zero_dose_child_median": 0.060,
        },
        "vsStatusQuo": vs,
        "frontier": frontier,
    })


def build_fairness(revision):
    gaps = pd.read_csv(revision / "05_fairness_gaps.csv")
    sub = pd.read_csv(revision / "05_fairness_by_subgroup.csv")
    order = {
        "Poorest (Q1)": 1, "Poorer (Q2)": 2, "Middle (Q3)": 3, "Richer (Q4)": 4, "Richest (Q5)": 5,
        "No education": 1, "Primary": 2, "Secondary": 3, "Higher": 4,
        "Rural": 1, "Urban": 2,
        "North Central": 1, "North East": 2, "North West": 3, "South East": 4, "South South": 5, "South West": 6,
    }
    axis_order = {a: i for i, a in enumerate(sub["axis"].drop_duplicates())}
    sub = sub.assign(
        _a=sub["axis"].map(axis_order),
        _g=sub["group"].map(lambda g: order.get(g, 100 if g.startswith("Other") else 50)),
    ).sort_values(["_a", "_g", "group"])
    write("fairness.json", {
        "source": "revision_analysis/paper1/output/05_fairness_gaps.csv, 05_fairness_by_subgroup.csv",
        "note": ("Committed model, held-out test set, 0.5 threshold. Equal-opportunity gap = highest minus lowest "
                 "sensitivity; 95% CIs from a cluster bootstrap. Ethnicity reported by raw NDHS v131 code; codes "
                 "with fewer than 20 test-set zero-dose children merged."),
        "gaps": [
            {"axis": x["axis"], "max_group": x["max_tpr_group"], "min_group": x["min_tpr_group"],
             "gap": r(x["equal_opportunity_gap"], 3), "ci_low": r(x["gap_ci_low"], 3), "ci_high": r(x["gap_ci_high"], 3)}
            for _, x in gaps.iterrows()
        ],
        "subgroups": [
            {"axis": x["axis"], "group": x["group"], "n": int(x["n"]), "events": int(x["events"]),
             "tpr": r(x["tpr"], 3), "tpr_low": r(x["tpr_ci_low"], 3), "tpr_high": r(x["tpr_ci_high"], 3),
             "auc": r(x["auc"], 3), "observed": r(x["observed"], 3), "mean_predicted": r(x["mean_predicted"], 3)}
            for _, x in sub.iterrows()
        ],
    })


def build_meta(outputs, revision, shap_top):
    params = json.load(open(outputs / "models" / "ml_to_abm_params.json"))
    betas = pd.read_csv(outputs / "tables" / "decision_function_betas.csv").iloc[0]
    hold = pd.read_csv(revision / "02_card_free_delta_auc.csv")
    primary = hold[(hold["split"] == "committed_70_30") & (hold["comparison"] == "with_card minus card_free")].iloc[0]
    write("meta.json", {
        "studyTitle": ("Who are the zero-dose children, and how do we reach them? Machine learning, linked "
                       "simulation and cost-effectiveness analysis of the 2024 Nigeria Demographic and Health Survey"),
        "dataSource": "Nigeria DHS 2024",
        "n_children": params["metadata"]["n_children_analytic_sample"],
        "n_clusters": params["metadata"]["n_clusters"],
        "weighted_zd_prevalence": 0.368,
        "auc_roc": r(primary["auc_with"]),
        "auc_ci": [r(primary["auc_with_ci_low"], 3), r(primary["auc_with_ci_high"], 3)],
        "auc_card_free": r(primary["auc_arm"]),
        "auc_card_free_ci": [r(primary["auc_arm_ci_low"], 3), r(primary["auc_arm_ci_high"], 3)],
        "morans_i": 0.607,
        "lca_k": 4,
        "lca_bic": 52150.1,
        "typology_silhouette": params["metadata"]["typology_silhouette"],
        "typologyDistribution": params["cluster_typology_distribution"],
        "calibrationFit": {
            "note": "NDHS 2018 and 2024 were both calibration targets; this is calibration fit, not validation.",
            "2018": {"observed_national": 0.650, "simulated_national": 0.611, "zone_rmse": 0.0432},
            "2024": {"observed_national": 0.632, "simulated_national": 0.702, "zone_rmse": 0.0747},
            "zone_rank_correlation": 0.943,
        },
        "decisionCoefficients": {
            "note": "Logistic regression on the survey data; the access score is derived from the risk model's SHAP values.",
            "intercept": r(betas["beta_0"], 3),
            "engagement_score": r(betas["beta_trust_score"], 3),
            "access_score": r(betas["beta_access_score"], 3),
            "outreach": r(betas["beta_outreach"], 3),
        },
        "featureImportanceTop20": shap_top[:20],
    })


def build_moran(outputs, gadm_shp):
    """Moran scatterplot points: standardised state prevalence (z) against its
    spatial lag, using the same row-standardised queen weights and the same
    GADM/state matching as the LISA builder in prepare_website_data.py."""
    import geopandas as gpd
    from libpysal.weights import Queen

    stats = pd.read_csv(outputs / "tables" / "eda_summary_stats.csv")
    gadm = gpd.read_file(str(gadm_shp))
    overrides = {"Federal Capital Territory": "FCT Abuja"}
    gadm["state_match"] = gadm["NAME_1"].map(lambda x: overrides.get(x, x))
    stats["state_match"] = stats["state_name"]
    merged = gadm.merge(stats, on="state_match", how="left")
    miss = merged["weighted_prevalence"].isna()
    if miss.any():
        lower = {s.lower(): s for s in stats["state_match"]}
        for idx in merged[miss].index:
            key = merged.at[idx, "NAME_1"].lower()
            if key in lower:
                row = stats[stats["state_match"] == lower[key]].iloc[0]
                for col in stats.columns:
                    if col != "state_match":
                        merged.at[idx, col] = row[col]
    merged["weighted_prevalence"] = pd.to_numeric(merged["weighted_prevalence"], errors="coerce")
    sp = merged.dropna(subset=["weighted_prevalence"]).reset_index(drop=True)
    w = Queen.from_dataframe(sp, use_index=False)
    w.transform = "r"
    y = sp["weighted_prevalence"].to_numpy(dtype=float)
    z = (y - y.mean()) / y.std()
    lag = np.array([sum(wt * z[j] for j, wt in zip(w.neighbors[i], w.weights[i])) for i in range(len(z))])
    moran_i = float((z * lag).sum() / (z * z).sum())
    assert abs(moran_i - 0.607) < 0.001, moran_i
    pts = [
        {"state_name": (sp.at[i, "state_name"] if pd.notna(sp.at[i, "state_name"]) else sp.at[i, "NAME_1"]),
         "weighted_prevalence": r(y[i], 2), "z": r(z[i]), "lag": r(lag[i])}
        for i in range(len(z))
    ]
    write("moran_scatter.json", {
        "source": "outputs/tables/eda_summary_stats.csv; GADM 4.1 level-1 boundaries; row-standardised queen contiguity",
        "morans_i": r(moran_i),
        "points": pts,
    })


def clean_cna():
    """Drop the plain-language block parsed from cna_policy_translations.md (it states
    a month-36 endpoint and typology-stratified solutions the revised paper does not
    report). The solution, necessity and robustness tables are kept unchanged."""
    path = OUT / "cna_solutions.json"
    d = json.load(open(path))
    d.pop("translations", None)
    d["note"] = ("Coincidence Analysis of the 12 simulated scenario-typology cells; outcome: median simulated "
                 "DTP1 coverage of at least 80% at month 60. Configurations describe simulated packages, "
                 "not empirical causal effects.")
    write("cna_solutions.json", d)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--outputs", required=True, type=Path)
    ap.add_argument("--revision", required=True, type=Path)
    ap.add_argument("--gadm", type=Path, default=None,
                    help="GADM level-1 shapefile (default: <outputs>/../data/shapefiles/gadm/gadm41_NGA_1.shp)")
    a = ap.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    print("Refreshing dashboard data for the revised Paper 1")
    build_abm(a.outputs)
    shap_top = build_shap(a.outputs)
    build_lca(a.outputs, a.revision)
    build_posteriors(a.outputs)
    build_economics(a.revision)
    build_fairness(a.revision)
    build_meta(a.outputs, a.revision, shap_top)
    gadm = a.gadm or (a.outputs.parent / "data" / "shapefiles" / "gadm" / "gadm41_NGA_1.shp")
    build_moran(a.outputs, gadm)
    clean_cna()
    grid = OUT / "scenarios_interpolation_grid.json"
    if grid.exists():
        grid.unlink()
        print("  removed scenarios_interpolation_grid.json (not simulation output)")


if __name__ == "__main__":
    main()
