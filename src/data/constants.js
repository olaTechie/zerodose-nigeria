/**
 * constants.js — All label mappings, colour palettes, and classification tiers
 * for the Zero-Dose Nigeria React dashboard.
 *
 * Every number is sourced from pipeline outputs (2026-03-24).
 * Source files:
 *   - outputs/stage1/ml_to_abm_params.json (trust state proportions, trust scores)
 *   - outputs/stage2/abm_to_cna_matrix.csv (scenario definitions)
 *   - CLAUDE.md (variable definitions, zone labels)
 */

// ---------------------------------------------------------------------------
// Scenario labels and colours
// ---------------------------------------------------------------------------

export const SCENARIO_LABELS = {
  S0: 'Status quo',
  S1: 'Mobile outreach only',
  S2: 'Community engagement only',
  S3: 'Supply reinforcement only',
  S4: 'Outreach + engagement',
  S5: 'Full combined strategy',
};

export const SCENARIO_COLOURS = {
  S0: '#d32f2f',
  S1: '#fbc02d',
  S2: '#f57c00',
  S3: '#0288d1',
  S4: '#7b1fa2',
  S5: '#388e3c',
};

// ---------------------------------------------------------------------------
// Geopolitical zone labels and colours
// ---------------------------------------------------------------------------

export const ZONE_LABELS = {
  NW: 'North West',
  NE: 'North East',
  NC: 'North Central',
  SE: 'South East',
  SS: 'South South',
  SW: 'South West',
};

export const ZONE_COLOURS = {
  NW: '#8b0000',
  NE: '#cc4400',
  NC: '#cc8400',
  SE: '#006633',
  SS: '#1565c0',
  SW: '#4a148c',
};

export const ZONE_CODE_MAP = {
  1: 'NW',
  2: 'NE',
  3: 'NC',
  4: 'SE',
  5: 'SS',
  6: 'SW',
};

// ---------------------------------------------------------------------------
// Community typology colours
// ---------------------------------------------------------------------------

export const TYPOLOGY_COLOURS = {
  'Access-Constrained': '#1565c0',
  Reference: '#2e7d32',
};

// ---------------------------------------------------------------------------
// Coverage tier classification
// ---------------------------------------------------------------------------

export const COVERAGE_TIERS = {
  ontrack: {
    min: 0.80,
    max: 1.01,
    color: '#006633',
    bg: '#e8f5e9',
    label: 'On Track',
    icon: '\u2713',
  },
  atrisk: {
    min: 0.60,
    max: 0.80,
    color: '#cc8400',
    bg: '#fff8e1',
    label: 'At Risk',
    icon: '\u26a0',
  },
  critical: {
    min: 0.40,
    max: 0.60,
    color: '#b33000',
    bg: '#fbe9e7',
    label: 'Critical',
    icon: '\u2717',
  },
  crisis: {
    min: 0.00,
    max: 0.40,
    color: '#6b1a1a',
    bg: '#fce4ec',
    label: 'ZD Crisis',
    icon: '\ud83d\udea8',
  },
};

// ---------------------------------------------------------------------------
// Trust state labels (from ml_to_abm_params.json)
// ---------------------------------------------------------------------------

export const TRUST_STATE_LABELS = {
  Willing: {
    color: '#2e7d32',
    bg: '#e8f5e9',
    proportion: 0.157,
    meanTrust: 0.953,
  },
  Hesitant: {
    color: '#cc8400',
    bg: '#fff8e1',
    proportion: 0.559,
    meanTrust: 0.487,
  },
  Refusing: {
    color: '#8b0000',
    bg: '#fce4ec',
    proportion: 0.284,
    meanTrust: 0.063,
  },
};

// ---------------------------------------------------------------------------
// LISA cluster type colours
// ---------------------------------------------------------------------------

export const LISA_COLOURS = {
  'High-High': '#d32f2f',
  'Low-Low': '#1565c0',
  'High-Low': '#f57c00',
  'Low-High': '#7b1fa2',
  'Not Significant': '#bdbdbd',
};

// ---------------------------------------------------------------------------
// ABM scenario component flags (from abm_to_cna_matrix.csv)
// ---------------------------------------------------------------------------

export const SCENARIO_COMPONENTS = {
  S0: { outreach: 0, comm_engage: 0, supply_reinf: 0 },
  S1: { outreach: 1, comm_engage: 0, supply_reinf: 0 },
  S2: { outreach: 0, comm_engage: 1, supply_reinf: 0 },
  S3: { outreach: 0, comm_engage: 0, supply_reinf: 1 },
  S4: { outreach: 1, comm_engage: 1, supply_reinf: 0 },
  S5: { outreach: 1, comm_engage: 1, supply_reinf: 1 },
};

// ---------------------------------------------------------------------------
// Key pipeline metrics (from ml_to_abm_params.json and pipeline outputs).
// Refreshed 2026-04-17 with the polish-pass values:
//   - XGBoost refit excluded cluster-aggregated features → AUC 0.9719 → 0.9467
//   - Joint 2018+2024 ABC calibration with per-zone disruption multipliers
//     → 2024 zone RMSE 0.107 → 0.075; 2024 national RMSE 0.070
//   - Six per-zone disruption multipliers (NW highest at 1.73)
// Source files:
//   - outputs/stage1/ml_to_abm_params.json
//   - outputs/stage2/calibrated_params.json
//   - outputs/stage2/abm_validation_report.md
// ---------------------------------------------------------------------------

export const PIPELINE_METRICS = {
  n_children: 4875,
  n_clusters: 1283,
  n_households_simulated: 38490,
  weighted_zd_prevalence: 0.368,
  model_auc_roc: 0.9467,
  lca_n_classes: 4,
  lca_bic: 52150.1,
  typology_silhouette: 0.3209,
  calibration_rmse_2018: 0.039,    // in-sample national
  calibration_rmse: 0.039,          // back-compat alias for any consumer of the old key
  validation_spearman_r: 0.943,
  validation_rmse: 0.070,           // 2024 national RMSE (joint posterior)
  validation_zone_rmse: 0.075,      // 2024 zone RMSE
  morans_i: 0.6075,
  morans_z: 5.99,
  morans_p: 0.000001,
  n_lisa_hotspots: 5,
  n_lisa_coldspots: 5,
  n_positive_outcomes: 4,
  n_total_scenarios: 12,
  pipeline_run_date: '2026-04-17',  // last polish-pass execution
  // Per-zone disruption multipliers (joint 2018+2024 ABC posterior medians).
  // > 1.0 indicates inferred zone-specific shock stress; NW is the highest,
  // consistent with documented post-2018 security and service deterioration.
  // These are model-internal inferred parameters, not measured against any
  // external shock-event time series.
  disruption_NC: 1.50,
  disruption_NE: 1.40,
  disruption_NW: 1.73,
  disruption_SE: 1.45,
  disruption_SS: 1.49,
  disruption_SW: 1.49,
};

// ---------------------------------------------------------------------------
// Typology distribution (from ml_to_abm_params.json)
// ---------------------------------------------------------------------------

export const TYPOLOGY_DISTRIBUTION = {
  Reference: 0.6087,
  'Access-Constrained': 0.3913,
};

// ---------------------------------------------------------------------------
// Decision function coefficients (from ml_to_abm_params.json)
// ---------------------------------------------------------------------------

export const DECISION_COEFFICIENTS = {
  beta_0: 0.8621,
  beta_trust: 0.16,
  beta_access: 0.0416,
  beta_outreach: 0.0964,
  beta_supply: 0.0732,
  beta_peer: 2.1726,
};
