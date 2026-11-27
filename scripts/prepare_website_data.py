"""
prepare_website_data.py
=======================
Reads pipeline outputs and produces the state map, Table 1 and CNA data files
in website/public/data/ for the React dashboard.

Since the November 2026 revision of Paper 1, the scenario, SHAP, metadata,
engagement-class, calibration, economics and fairness files are built by
scripts/refresh_paper1_revision.py instead. The builders removed from this
file drew interpolated trajectory curves that were not simulation output and
collapsed the four latent classes into three labelled trust states. The
survey-cluster point map (cluster_map.geojson) was removed on 2026-11-27: it
published DHS cluster coordinates with cluster-level observed values.

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

# v2 canonical layout: outputs/{tables,figures,models,twin}/
TABLES = ROOT / "outputs" / "tables"
FIGURES = ROOT / "outputs" / "figures"
MODELS = ROOT / "outputs" / "models"
TWIN = ROOT / "outputs" / "twin"

GADM_SHP = ROOT / "data" / "shapefiles" / "gadm" / "gadm41_NGA_1.shp"

# Zone numeric -> label mapping, NDHS 2024 szone order (value labels in NGKR8BFL).
# v024 uses a different order (1 NW, 2 NE, 3 NC, ...); do not use it with szone.
ZONE_MAP = {1: "NC", 2: "NE", 3: "NW", 4: "SE", 5: "SS", 6: "SW"}

SEED = 42
np.random.seed(SEED)


def _round(v, n=4):
    """Round a value, handling None/NaN."""
    if v is None or (isinstance(v, float) and np.isnan(v)):
        return None
    return round(float(v), n)


# ════════════════════════════════════════════════════════════════════════════
# 2. table_one.json
# ════════════════════════════════════════════════════════════════════════════
def build_table_one():
    print("2/10  table_one.json ...")
    df = pd.read_csv(TABLES / "table_one_by_outcome.csv", header=[0, 1])

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
# 5. state_prevalence.json (GeoJSON-compatible JSON, not TopoJSON)
# ════════════════════════════════════════════════════════════════════════════
def build_state_prevalence():
    print("5/10  state_prevalence.json ...")
    stats = pd.read_csv(TABLES / "eda_summary_stats.csv")
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
    stats = pd.read_csv(TABLES / "eda_summary_stats.csv")
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
# 9. cna_solutions.json
# ════════════════════════════════════════════════════════════════════════════
def build_cna():
    print("9/10  cna_solutions.json ...")

    # Primary solutions
    sol_df = pd.read_csv(TABLES / "cna_primary_solution.csv")
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
    nec_df = pd.read_csv(TABLES / "cna_necessity_analysis.csv")
    necessity = []
    for _, r in nec_df.iterrows():
        necessity.append({
            "condition": r["condition"],
            "necessity_consistency": _round(r["necessity_consistency"]),
        })

    # Robustness table
    rob_df = pd.read_csv(TABLES / "cna_robustness_table.csv")
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
    with open(TABLES / "cna_policy_translations.md") as f:
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
# Main
# ════════════════════════════════════════════════════════════════════════════
def main():
    print("=" * 60)
    print("PREPARE WEBSITE DATA")
    print(f"  Source: {ROOT}")
    print(f"  Output: {OUT}")
    print("=" * 60)
    print()

    build_table_one()
    build_state_prevalence()
    build_lisa()
    build_cna()
    print("Now run scripts/refresh_paper1_revision.py for the remaining files.")

    print()
    print("=" * 60)
    print("MAP, TABLE 1 AND CNA FILES PRODUCED")
    total_size = 0
    for f in sorted(OUT.iterdir()):
        size = f.stat().st_size
        total_size += size
        print(f"  {f.name:40s}  {size / 1024:8.1f} KB")
    print(f"  {'TOTAL':40s}  {total_size / 1024:8.1f} KB")
    print("=" * 60)


if __name__ == "__main__":
    main()
