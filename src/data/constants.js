/**
 * constants.js — All label mappings, colour palettes, and classification tiers
 * for the Zero-Dose Nigeria React dashboard.
 *
 * Numbers updated 2026-11-24 to match the revised Paper 1 manuscript.
 * Source files:
 *   - outputs/models/ml_to_abm_params.json, outputs/tables/decision_function_betas.csv
 *   - outputs/twin/abm_to_cna_matrix.csv (scenario definitions)
 *   - outputs/twin/abm_validation_report.md (calibration fit)
 *   - revision_analysis/paper1/output/ (engagement classes, card-free AUC)
 */

// ---------------------------------------------------------------------------
// Scenario labels and colours
// ---------------------------------------------------------------------------

export const SCENARIO_LABELS = {
  S0: 'Status quo',
  S1: 'Mobile outreach only',
  S2: 'Community engagement only',
  S3: 'Supply-chain reinforcement only',
  S4: 'Outreach + engagement',
  S5: 'Full package',
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

// NDHS 2024 szone codes (value labels in NGKR8BFL): 1 NC, 2 NE, 3 NW, 4 SE, 5 SS, 6 SW.
// (v024 uses a different order; do not use it with szone.)
export const ZONE_CODE_MAP = {
  1: 'NC',
  2: 'NE',
  3: 'NW',
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
// Caregiver engagement classes (latent class analysis, four classes).
// Shares from the published fit; zero-dose prevalence unweighted
// (revision_analysis/paper1/output/03c_zero_dose_by_published_class.csv).
// The classes describe engagement with services, not attitudes.
// ---------------------------------------------------------------------------

export const ENGAGEMENT_CLASSES = [
  { id: 'Class_1', name: 'Class 1', label: 'Low engagement', short: 'Low', share: 0.284, zeroDose: 0.819, color: '#8b0000', bg: '#fce4ec' },
  { id: 'Class_2', name: 'Class 2', label: 'Intermediate engagement, COVID-19 vaccinated or unwilling', short: 'Intermediate A', share: 0.266, zeroDose: 0.191, color: '#cc8400', bg: '#fff8e1' },
  { id: 'Class_3', name: 'Class 3', label: 'High engagement', short: 'High', share: 0.292, zeroDose: 0.130, color: '#2e7d32', bg: '#e8f5e9' },
  { id: 'Class_4', name: 'Class 4', label: 'Intermediate engagement, willing but unvaccinated for COVID-19', short: 'Intermediate B', share: 0.157, zeroDose: 0.224, color: '#1565c0', bg: '#e3f2fd' },
];

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
// Key pipeline metrics, as reported in the revised Paper 1 manuscript.
// Simulation calibration: rejection ABC, 2,000 prior draws, 200 accepted on the
// mean distance to NDHS 2018 and 2024 DTP1 coverage. Both surveys were
// calibration targets, so the fit figures below are calibration fit, not
// validation (outputs/twin/abm_validation_report.md).
// ---------------------------------------------------------------------------

export const PIPELINE_METRICS = {
  n_children: 4875,
  n_clusters: 1283,
  n_virtual_children: 38490,        // 30 per cluster
  n_replicates: 500,                // per scenario-typology cell
  weighted_zd_prevalence: 0.368,
  model_auc_roc: 0.947,             // 95% CI 0.930 to 0.961 (cluster bootstrap)
  model_auc_ci: [0.930, 0.961],
  model_auc_card_free: 0.842,       // 95% CI 0.814 to 0.869
  model_auc_card_free_ci: [0.814, 0.869],
  lca_n_classes: 4,
  lca_bic: 52150.1,
  typology_silhouette: 0.321,
  calib_2018_observed: 0.650,
  calib_2018_simulated: 0.611,      // error 3.9 points; zone RMSE 4.3 points
  calib_2018_zone_rmse: 0.043,
  calib_2024_observed: 0.632,
  calib_2024_simulated: 0.702,      // overestimate 7.0 points; zone RMSE 7.5 points
  calib_2024_zone_rmse: 0.075,
  calib_zone_rank_correlation: 0.943,
  morans_i: 0.607,                  // outputs/figures/morans_i.pdf
  morans_z: 5.99,
  morans_p: 0.000001,
  n_lisa_hotspots: 5,
  n_lisa_coldspots: 5,
  n_positive_outcomes: 4,           // cells reaching 80% DTP1 coverage by month 60
  n_total_scenarios: 12,
  pipeline_run_date: '2026-04-17',
  // Per-zone disruption parameters (posterior medians). Similar across zones,
  // with wide, overlapping 95% intervals (about 0.52 to 2.48); they do not
  // identify a distinct effect of insecurity in any zone.
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
// Simulation decision rule coefficients: logistic regression on the survey data,
// with an access score derived from the risk model's SHAP values
// (outputs/tables/decision_function_betas.csv).
// ---------------------------------------------------------------------------

export const DECISION_COEFFICIENTS = {
  intercept: 0.552,
  engagement_score: 0.434,
  access_score: 0.193,
  outreach: 0.241,
};
