"""
prepare_website_data.py
=======================
Reads all pipeline outputs and produces 10 optimised JSON/GeoJSON files
in website/public/data/ for the React dashboard.

Run from project root:
    python website/scripts/prepare_website_data.py
"""

import json
import os
import re
import sys
from pathlib import Path

import geopandas as gpd
import numpy as np
import pandas as pd
from libpysal.weights import Queen
from esda.moran import Moran, Moran_Local

# ── Paths ──────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent.parent
OUT = ROOT / "website" / "public" / "data"
OUT.mkdir(parents=True, exist_ok=True)

STAGE1 = ROOT / "outputs" / "stage1"
EDA = STAGE1 / "eda"
STAGE2 = ROOT / "outputs" / "stage2"
STAGE3 = ROOT / "outputs" / "stage3"

GPS_SHP = ROOT / "data" / "dhs" / "raw" / "nga_2024" / "NGGE8BFL" / "NGGE8AFL.shp"
GADM_SHP = ROOT / "data" / "shapefiles" / "gadm" / "gadm41_NGA_1.shp"

# Zone numeric → label mapping (NDHS szone)
ZONE_MAP = {1: "NW", 2: "NE", 3: "NC", 4: "SE", 5: "SS", 6: "SW"}

SEED = 42
np.random.seed(SEED)


def _round(v, n=4):
    """Round a value, handling None/NaN."""
    if v is None or (isinstance(v, float) and np.isnan(v)):
        return None
    return round(float(v), n)


# ════════════════════════════════════════════════════════════════════════════
# 1. meta.json
# ════════════════════════════════════════════════════════════════════════════
def build_meta():
    print("1/10  meta.json ...")
    with open(STAGE1 / "ml_to_abm_params.json") as f:
        params = json.load(f)

    meta = {
        "studyTitle": "Trust, Access, and Causal Recipes for Vaccination Coverage Recovery in Nigeria",
        "dataSource": "Nigeria DHS 2024",
        "n_children": params["metadata"]["n_children_analytic_sample"],
        "n_clusters": params["metadata"]["n_clusters"],
        "auc_roc": params["metadata"]["model_auc_roc"],
        "weighted_zd_prevalence": 0.368,
        "lca_k": params["metadata"]["lca_n_classes"],
        "lca_bic": params["metadata"]["lca_bic"],
        "typology_silhouette": params["metadata"]["typology_silhouette"],
        "calibration_rmse": 0.033,
        "validation_spearman": 0.943,
        "moran_I": 0.6075,
        "decisionCoefficients": params["decision_function_coefficients"],
        "trustClassProfiles": params["trust_class_profiles"],
        "typologyDistribution": params["cluster_typology_distribution"],
        "featureImportanceTop20": params["feature_importance_top20"],
    }
    with open(OUT / "meta.json", "w") as f:
        json.dump(meta, f, indent=2)
    print("       OK")


# ════════════════════════════════════════════════════════════════════════════
# 2. table_one.json
# ════════════════════════════════════════════════════════════════════════════
def build_table_one():
    print("2/10  table_one.json ...")
    df = pd.read_csv(EDA / "table_one.csv", header=[0, 1])

    # Flatten the multi-level header
    rows = []
    for _, row in df.iterrows():
        # First two cols are the variable name and category
        vals = row.values.tolist()
        variable = str(vals[0]) if pd.notna(vals[0]) else ""
        category = str(vals[1]) if pd.notna(vals[1]) else ""
        missing = str(vals[2]) if pd.notna(vals[2]) else ""
        overall = str(vals[3]) if pd.notna(vals[3]) else ""
        vaccinated = str(vals[4]) if pd.notna(vals[4]) else ""
        zerodose = str(vals[5]) if pd.notna(vals[5]) else ""
        pvalue = str(vals[6]) if pd.notna(vals[6]) else ""
        test = str(vals[7]) if pd.notna(vals[7]) else ""

        # Clean up 'nan' strings
        for field in [variable, category, missing, overall, vaccinated, zerodose, pvalue, test]:
            if field == "nan":
                field = ""

        rows.append({
            "variable": variable if variable != "nan" else "",
            "category": category if category != "nan" else "",
            "missing": missing if missing != "nan" else "",
            "overall": overall if overall != "nan" else "",
            "vaccinated": vaccinated if vaccinated != "nan" else "",
            "zerodose": zerodose if zerodose != "nan" else "",
            "pvalue": pvalue if pvalue != "nan" else "",
            "test": test if test != "nan" else "",
        })

    with open(OUT / "table_one.json", "w") as f:
        json.dump({"rows": rows}, f, indent=2)
    print("       OK")


# ════════════════════════════════════════════════════════════════════════════
# 3. shap_importance.json
# ════════════════════════════════════════════════════════════════════════════
def build_shap():
    print("3/10  shap_importance.json ...")
    glob_df = pd.read_csv(STAGE1 / "shap_global_importance.csv")
    zone_df = pd.read_csv(STAGE1 / "shap_zone_stratified.csv")

    global_list = []
    for _, r in glob_df.iterrows():
        global_list.append({
            "feature": r["feature"],
            "display": r["feature_display"],
            "shap": _round(r["mean_abs_shap"]),
            "rank": int(r["rank"]),
        })

    by_zone = {}
    for zone, gdf in zone_df.groupby("zone"):
        zone_list = []
        sorted_gdf = gdf.sort_values("mean_abs_shap", ascending=False).reset_index(drop=True)
        for rank, (_, r) in enumerate(sorted_gdf.iterrows(), 1):
            zone_list.append({
                "feature": r["feature"],
                "display": r["feature_display"],
                "shap": _round(r["mean_abs_shap"]),
                "rank": rank,
            })
        by_zone[zone] = zone_list

    with open(OUT / "shap_importance.json", "w") as f:
        json.dump({"global": global_list, "byZone": by_zone}, f, indent=2)
    print("       OK")


# ════════════════════════════════════════════════════════════════════════════
# 4. cluster_map.geojson
# ════════════════════════════════════════════════════════════════════════════
def build_cluster_map():
    print("4/10  cluster_map.geojson ...")
    typology = pd.read_csv(STAGE1 / "cluster_typology_labels.csv")
    gps = gpd.read_file(str(GPS_SHP))

    # Join: v001 in typology = DHSCLUST in GPS
    gps["DHSCLUST"] = gps["DHSCLUST"].astype(int)
    typology["v001"] = typology["v001"].astype(int)

    merged = gps.merge(typology, left_on="DHSCLUST", right_on="v001", how="inner")
    print(f"       Merged clusters: {len(merged)}")

    # Map zone numeric to labels
    merged["zone_label"] = merged["zone"].map(ZONE_MAP)

    # Build GeoJSON FeatureCollection
    features = []
    for _, row in merged.iterrows():
        # Use the point geometry from GPS
        geom = row["geometry"]
        props = {
            "cluster_id": int(row["DHSCLUST"]),
            "typology": row["typology"],
            "zero_dose_rate": _round(row["zero_dose_rate"]),
            "zone": row["zone_label"] if pd.notna(row.get("zone_label")) else ZONE_MAP.get(int(row["zone"]), "Unknown"),
            "trust_score": _round(row["cluster_trust_score"]),
            "travel_time": _round(row["mean_travel_time"]),
            "wealth": _round(row["mean_wealth"]),
            "urban_rural": row["URBAN_RURA"] if pd.notna(row.get("URBAN_RURA")) else None,
        }
        features.append({
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [round(geom.x, 5), round(geom.y, 5)],
            },
            "properties": props,
        })

    geojson = {"type": "FeatureCollection", "features": features}
    with open(OUT / "cluster_map.geojson", "w") as f:
        json.dump(geojson, f)
    print(f"       OK  ({len(features)} features)")


# ════════════════════════════════════════════════════════════════════════════
# 5. state_prevalence.json (GeoJSON-compatible JSON, not TopoJSON)
# ════════════════════════════════════════════════════════════════════════════
def build_state_prevalence():
    print("5/10  state_prevalence.json ...")
    stats = pd.read_csv(EDA / "eda_summary_stats.csv")
    gadm = gpd.read_file(str(GADM_SHP))
    # Simplify polygons to reduce file size (~0.005 degrees ~ 500m tolerance)
    gadm["geometry"] = gadm["geometry"].simplify(tolerance=0.005, preserve_topology=True)

    # Name mapping: GADM -> DHS
    name_overrides = {
        "Federal Capital Territory": "FCT Abuja",
    }
    gadm["state_match"] = gadm["NAME_1"].map(lambda x: name_overrides.get(x, x))
    stats["state_match"] = stats["state_name"].copy()

    merged = gadm.merge(stats, on="state_match", how="left")

    # Case-insensitive fallback for unmatched
    unmatched = merged["weighted_prevalence"].isna()
    if unmatched.any():
        dhs_lower = {s.lower(): s for s in stats["state_match"].values}
        for idx in merged[unmatched].index:
            gadm_lower = merged.at[idx, "NAME_1"].lower()
            if gadm_lower in dhs_lower:
                match_name = dhs_lower[gadm_lower]
                matched_row = stats[stats["state_match"] == match_name].iloc[0]
                for col in stats.columns:
                    if col != "state_match":
                        merged.at[idx, col] = matched_row[col]

    # Convert to simplified GeoJSON
    merged["weighted_prevalence"] = pd.to_numeric(merged["weighted_prevalence"], errors="coerce")

    features = []
    for _, row in merged.iterrows():
        geom = row["geometry"].__geo_interface__
        geom = _simplify_geojson_coords(geom, precision=3)
        props = {
            "state_name": row.get("state_name") if pd.notna(row.get("state_name")) else row["NAME_1"],
            "gadm_name": row["NAME_1"],
            "weighted_prevalence": _round(row["weighted_prevalence"], 2) if pd.notna(row["weighted_prevalence"]) else None,
            "n_children": int(row["n_children"]) if pd.notna(row.get("n_children")) else None,
            "n_zerodose": int(row["n_zerodose"]) if pd.notna(row.get("n_zerodose")) else None,
            "zone": row["zone"] if pd.notna(row.get("zone")) else None,
        }
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": props,
        })

    geojson = {"type": "FeatureCollection", "features": features}
    with open(OUT / "state_prevalence.json", "w") as f:
        json.dump(geojson, f)
    print(f"       OK  ({len(features)} states)")


def _simplify_geojson_coords(geom_dict, precision=3):
    """Recursively round coordinates in a GeoJSON geometry dict."""
    def _round_coords(coords):
        if isinstance(coords, (list, tuple)):
            if len(coords) > 0 and isinstance(coords[0], (int, float)):
                return [round(c, precision) for c in coords]
            else:
                return [_round_coords(c) for c in coords]
        return coords

    result = dict(geom_dict)
    if "coordinates" in result:
        result["coordinates"] = _round_coords(result["coordinates"])
    return result


# ════════════════════════════════════════════════════════════════════════════
# 6. lisa_clusters.json
# ════════════════════════════════════════════════════════════════════════════
def build_lisa():
    print("6/10  lisa_clusters.json ...")
    stats = pd.read_csv(EDA / "eda_summary_stats.csv")
    gadm = gpd.read_file(str(GADM_SHP))

    # Same name matching as above
    name_overrides = {"Federal Capital Territory": "FCT Abuja"}
    gadm["state_match"] = gadm["NAME_1"].map(lambda x: name_overrides.get(x, x))
    stats["state_match"] = stats["state_name"].copy()
    merged = gadm.merge(stats, on="state_match", how="left")

    # Case-insensitive fallback
    unmatched = merged["weighted_prevalence"].isna()
    if unmatched.any():
        dhs_lower = {s.lower(): s for s in stats["state_match"].values}
        for idx in merged[unmatched].index:
            gadm_lower = merged.at[idx, "NAME_1"].lower()
            if gadm_lower in dhs_lower:
                match_name = dhs_lower[gadm_lower]
                matched_row = stats[stats["state_match"] == match_name].iloc[0]
                for col in stats.columns:
                    if col != "state_match":
                        merged.at[idx, col] = matched_row[col]

    merged["weighted_prevalence"] = pd.to_numeric(merged["weighted_prevalence"], errors="coerce")

    # Spatial analysis: LISA — use UNSIMPLIFIED geometry for weights (scientific accuracy)
    spatial = merged.dropna(subset=["weighted_prevalence"]).copy().reset_index(drop=True)
    w = Queen.from_dataframe(spatial, use_index=False)
    w.transform = "r"

    y = spatial["weighted_prevalence"].values
    moran_global = Moran(y, w, permutations=999)
    lisa = Moran_Local(y, w, permutations=999, seed=SEED)

    sig = lisa.p_sim < 0.05
    lisa_labels_map = {0: "Not Significant", 1: "High-High", 2: "Low-High", 3: "Low-Low", 4: "High-Low"}

    spatial["lisa_cluster"] = 0
    spatial.loc[sig, "lisa_cluster"] = lisa.q[sig]
    spatial["lisa_label"] = spatial["lisa_cluster"].map(lisa_labels_map)

    # Simplify geometry ONLY for output, after spatial analysis is done
    spatial["geometry"] = spatial["geometry"].simplify(tolerance=0.005, preserve_topology=True)

    # Build GeoJSON with LISA info
    features = []
    for i, row in spatial.iterrows():
        geom = row["geometry"].__geo_interface__
        geom = _simplify_geojson_coords(geom, precision=3)
        state_name = row.get("state_name") if pd.notna(row.get("state_name")) else row["NAME_1"]
        props = {
            "state_name": state_name,
            "cluster_type": row["lisa_label"],
            "lisa_quadrant": int(row["lisa_cluster"]),
            "p_value": _round(lisa.p_sim[i]),
            "local_I": _round(lisa.Is[i]),
            "weighted_prevalence": _round(row["weighted_prevalence"], 2),
            "zone": row["zone"] if pd.notna(row.get("zone")) else None,
        }
        features.append({
            "type": "Feature",
            "geometry": geom,
            "properties": props,
        })

    result = {
        "type": "FeatureCollection",
        "features": features,
        "globalMoran": {
            "I": _round(moran_global.I),
            "EI": _round(moran_global.EI),
            "z_score": _round(moran_global.z_norm),
            "p_value": _round(moran_global.p_norm, 6),
        },
    }

    with open(OUT / "lisa_clusters.json", "w") as f:
        json.dump(result, f)
    print(f"       OK  ({len(features)} states, Moran I={moran_global.I:.4f})")


# ════════════════════════════════════════════════════════════════════════════
# 7. lca_profiles.json
# ════════════════════════════════════════════════════════════════════════════
def build_lca():
    print("7/10  lca_profiles.json ...")
    profiles = pd.read_csv(STAGE1 / "lca_trust_profiles.csv")
    posteriors = pd.read_csv(STAGE1 / "lca_posterior_probs.csv")

    # 4-class → 3 trust state mapping:
    # Class_1 → Refusing, Class_2+Class_3 → Hesitant, Class_4 → Willing
    trust_states = []

    # Refusing (Class 1)
    c1 = profiles[profiles["assigned_class"] == "Class_1"].iloc[0]
    trust_states.append({
        "label": "Refusing",
        "originalClass": "Class_1",
        "proportion": _round(c1["proportion"]),
        "meanTrust": _round(c1["mean_trust"]),
        "sd": _round(c1["sd_trust"]),
    })

    # Hesitant (Classes 2 + 3 combined)
    c2 = profiles[profiles["assigned_class"] == "Class_2"].iloc[0]
    c3 = profiles[profiles["assigned_class"] == "Class_3"].iloc[0]
    combined_prop = c2["proportion"] + c3["proportion"]
    combined_mean = (c2["mean_trust"] * c2["proportion"] + c3["mean_trust"] * c3["proportion"]) / combined_prop
    # Pooled SD (weighted)
    combined_var = (
        c2["proportion"] * (c2["sd_trust"] ** 2 + c2["mean_trust"] ** 2)
        + c3["proportion"] * (c3["sd_trust"] ** 2 + c3["mean_trust"] ** 2)
    ) / combined_prop - combined_mean ** 2
    combined_sd = np.sqrt(max(combined_var, 0))
    trust_states.append({
        "label": "Hesitant",
        "originalClasses": ["Class_2", "Class_3"],
        "proportion": _round(combined_prop),
        "meanTrust": _round(combined_mean),
        "sd": _round(combined_sd),
    })

    # Willing (Class 4)
    c4 = profiles[profiles["assigned_class"] == "Class_4"].iloc[0]
    trust_states.append({
        "label": "Willing",
        "originalClass": "Class_4",
        "proportion": _round(c4["proportion"]),
        "meanTrust": _round(c4["mean_trust"]),
        "sd": _round(c4["sd_trust"]),
    })

    # Also keep original 4-class profiles for the radar chart
    original_profiles = []
    for _, r in profiles.iterrows():
        original_profiles.append({
            "class": r["assigned_class"],
            "meanTrust": _round(r["mean_trust"]),
            "sd": _round(r["sd_trust"]),
            "proportion": _round(r["proportion"]),
        })

    # Sample 500 posteriors for scatter plot
    sample_n = min(500, len(posteriors))
    sampled = posteriors.sample(n=sample_n, random_state=SEED)

    # Map zone numeric to labels
    sampled_list = []
    for _, r in sampled.iterrows():
        zone_num = int(r["szone"]) if pd.notna(r["szone"]) else None
        sampled_list.append({
            "caseid": str(r["caseid"]).strip(),
            "cluster": int(r["v001"]),
            "zone": ZONE_MAP.get(zone_num, "Unknown") if zone_num else None,
            "trustScore": _round(r["trust_score"]),
            "assignedClass": r["assigned_class"],
        })

    result = {
        "trustStates": trust_states,
        "originalProfiles": original_profiles,
        "posteriors": sampled_list,
    }

    with open(OUT / "lca_profiles.json", "w") as f:
        json.dump(result, f, indent=2)
    print(f"       OK  (3 trust states, {len(sampled_list)} sampled posteriors)")


# ════════════════════════════════════════════════════════════════════════════
# 8. abm_scenarios.json
# ════════════════════════════════════════════════════════════════════════════
def build_abm_scenarios():
    print("8/10  abm_scenarios.json ...")
    cna_matrix = pd.read_csv(STAGE2 / "abm_to_cna_matrix.csv")

    # Read the matrix rows
    matrix_rows = []
    for _, r in cna_matrix.iterrows():
        matrix_rows.append({
            "scenario_id": r["scenario_id"],
            "typology": r["typology"],
            "baseline_engagement": _round(r["baseline_engagement"]),
            "baseline_access": _round(r["baseline_access"]),
            "outreach": int(r["outreach"]),
            "comm_engage": int(r["comm_engage"]),
            "supply_reinf": int(r["supply_reinf"]),
            "coverage_month36_median": _round(r["coverage_month36_median"]),
            "coverage_month36_p025": _round(r["coverage_month36_p025"]),
            "coverage_month36_p975": _round(r["coverage_month36_p975"]),
            "outcome_binary": int(r["outcome_binary"]),
        })

    # Generate synthetic monthly trajectories using logistic growth
    # coverage(t) = baseline + (final - baseline) / (1 + exp(-k*(t - t_mid)))
    # Baseline estimates by typology (from NDHS 2013-era equivalent — roughly S0 initial)
    # Use ~0.40 for Reference and ~0.25 for Access-Constrained as 2013 starting points
    baseline_by_typology = {
        "Reference": 0.40,
        "Access-Constrained": 0.25,
    }

    trajectories = {}
    for _, r in cna_matrix.iterrows():
        scenario_id = r["scenario_id"]
        typology = r["typology"]
        key = f"{scenario_id}_{typology.replace('-', '').replace(' ', '')}"

        final = r["coverage_month36_median"]
        baseline = baseline_by_typology[typology]

        # Fit k and t_mid:  at t=36, coverage should be `final`
        # We want a smooth logistic from baseline to a slightly higher asymptote
        # Let asymptote be final * 1.02 (room to plateau slightly above month-36 value)
        asymptote = min(final * 1.02, 0.98)
        amplitude = asymptote - baseline
        t_mid = 18  # midpoint of growth
        # Solve for k:  final = baseline + amplitude / (1 + exp(-k*(36 - t_mid)))
        # => (final - baseline) / amplitude = 1 / (1 + exp(-k*18))
        ratio = (final - baseline) / amplitude if amplitude > 0 else 0.99
        ratio = np.clip(ratio, 0.01, 0.99)
        k = -np.log(1.0 / ratio - 1.0) / (36 - t_mid)

        trajectory = []
        for t in range(1, 61):
            cov = baseline + amplitude / (1 + np.exp(-k * (t - t_mid)))
            trajectory.append(_round(cov))

        trajectories[key] = trajectory

    result = {
        "matrix": matrix_rows,
        "trajectories": trajectories,
        "scenarioLabels": {
            "S0": "Status quo (no intervention)",
            "S1": "Mobile outreach only",
            "S2": "Community engagement only",
            "S3": "Supply reinforcement only",
            "S4": "Outreach + engagement",
            "S5": "Full combined strategy",
        },
    }

    with open(OUT / "abm_scenarios.json", "w") as f:
        json.dump(result, f, indent=2)
    print(f"       OK  ({len(matrix_rows)} matrix rows, {len(trajectories)} trajectories)")


# ════════════════════════════════════════════════════════════════════════════
# 9. cna_solutions.json
# ════════════════════════════════════════════════════════════════════════════
def build_cna():
    print("9/10  cna_solutions.json ...")

    # Primary solutions
    sol_df = pd.read_csv(STAGE3 / "cna_primary_solution.csv")
    solutions = []
    for _, r in sol_df.iterrows():
        solutions.append({
            "outcome": r["outcome"],
            "condition": r["condition"],
            "consistency": _round(r["con"]),
            "coverage": _round(r["cov"]),
            "complexity": int(r["complexity"]),
        })

    # Necessity analysis
    nec_df = pd.read_csv(STAGE3 / "cna_necessity_analysis.csv")
    necessity = []
    for _, r in nec_df.iterrows():
        necessity.append({
            "condition": r["condition"],
            "necessity_consistency": _round(r["necessity_consistency"]),
        })

    # Robustness table
    rob_df = pd.read_csv(STAGE3 / "cna_robustness_table.csv")
    robustness = []
    for _, r in rob_df.iterrows():
        robustness.append({
            "threshold": _round(r["threshold"], 2),
            "n_solutions": int(r["n_solutions"]),
            "has_solution": bool(r["has_solution"]),
            "top_formula": r["top_formula"],
            "top_con": _round(r["top_con"]),
            "top_cov": _round(r["top_cov"]),
        })

    # Policy translations (parse markdown)
    with open(STAGE3 / "cna_policy_translations.md") as f:
        md_text = f.read()

    translations = {
        "raw_markdown": md_text,
        "recipes": [],
    }

    # Parse recipes from markdown
    recipe_pattern = re.compile(
        r"\*\*Formula:\*\*\s*`([^`]+)`\s*\n\n"
        r"\*\*Translation:\*\*\s*(.+?)\s*\n\n"
        r"\*\*Consistency:\*\*\s*([\d.]+)\s*\|\s*\*\*Coverage:\*\*\s*([\d.]+)",
        re.MULTILINE,
    )
    for m in recipe_pattern.finditer(md_text):
        translations["recipes"].append({
            "formula": m.group(1),
            "translation": m.group(2),
            "consistency": float(m.group(3)),
            "coverage": float(m.group(4)),
        })

    # Parse typology-stratified results
    typology_results = {}
    type_section = md_text.split("## Typology-Stratified Results")
    if len(type_section) > 1:
        type_text = type_section[1].split("## Robustness")[0] if "## Robustness" in type_section[1] else type_section[1]
        current_typology = None
        for line in type_text.strip().split("\n"):
            line = line.strip()
            if line.startswith("### "):
                current_typology = line.replace("### ", "")
                typology_results[current_typology] = []
            elif line.startswith("- `") and current_typology:
                # Parse: - `formula` (con=X, cov=Y)
                formula_match = re.search(r"`([^`]+)`\s*\(con=([\d.]+),\s*cov=([\d.]+)\)", line)
                translation_line_idx = type_text.strip().split("\n").index(line)
                translation = ""
                remaining_lines = type_text.strip().split("\n")[translation_line_idx + 1:]
                for tl in remaining_lines:
                    tl = tl.strip()
                    if tl.startswith("Translation:"):
                        translation = tl.replace("Translation:", "").strip()
                        break
                if formula_match:
                    typology_results[current_typology].append({
                        "formula": formula_match.group(1),
                        "consistency": float(formula_match.group(2)),
                        "coverage": float(formula_match.group(3)),
                        "translation": translation,
                    })

    translations["typologyStratified"] = typology_results

    result = {
        "solutions": solutions,
        "necessity": necessity,
        "robustness": robustness,
        "translations": translations,
    }

    with open(OUT / "cna_solutions.json", "w") as f:
        json.dump(result, f, indent=2)
    print(f"       OK  ({len(solutions)} solutions, {len(necessity)} necessity, {len(robustness)} robustness)")


# ════════════════════════════════════════════════════════════════════════════
# 10. calibration_posteriors.json
# ════════════════════════════════════════════════════════════════════════════
def build_calibration_posteriors():
    print("10/10 calibration_posteriors.json ...")
    df = pd.read_csv(STAGE2 / "abm_calibration_posteriors.csv")

    # Extract only the 6 core ABM parameters (ignore columns with numpy repr strings)
    param_cols = ["delta_p", "delta_r", "beta_rumour", "delta_l", "alpha", "logit_shift"]

    posteriors = []
    for _, r in df.iterrows():
        row_dict = {}
        for col in param_cols:
            row_dict[col] = _round(r[col])
        posteriors.append(row_dict)

    # Also compute summary stats for each parameter
    summary = {}
    for col in param_cols:
        vals = df[col].values
        summary[col] = {
            "mean": _round(np.mean(vals)),
            "median": _round(np.median(vals)),
            "sd": _round(np.std(vals)),
            "p025": _round(np.percentile(vals, 2.5)),
            "p975": _round(np.percentile(vals, 97.5)),
        }

    result = {
        "parameters": param_cols,
        "posteriors": posteriors,
        "summary": summary,
    }

    with open(OUT / "calibration_posteriors.json", "w") as f:
        json.dump(result, f, indent=2)
    print(f"       OK  ({len(posteriors)} draws, {len(param_cols)} parameters)")


# ════════════════════════════════════════════════════════════════════════════
# Main
# ════════════════════════════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("PREPARE WEBSITE DATA")
    print(f"  Source: {ROOT}")
    print(f"  Output: {OUT}")
    print("=" * 60)
    print()

    build_meta()
    build_table_one()
    build_shap()
    build_cluster_map()
    build_state_prevalence()
    build_lisa()
    build_lca()
    build_abm_scenarios()
    build_cna()
    build_calibration_posteriors()

    print()
    print("=" * 60)
    print("ALL 10 FILES PRODUCED")
    total_size = 0
    for f in sorted(OUT.iterdir()):
        size = f.stat().st_size
        total_size += size
        print(f"  {f.name:40s}  {size / 1024:8.1f} KB")
    print(f"  {'TOTAL':40s}  {total_size / 1024:8.1f} KB")
    print("=" * 60)


if __name__ == "__main__":
    main()
