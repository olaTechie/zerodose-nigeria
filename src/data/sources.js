/**
 * sources.js — Central registry of citable source pointers for every metric
 * shown on the site. Per design brief Section 7 (source-of-truth pattern):
 * every number on screen has a citable source.
 *
 * Each entry is keyed by a short id used in `<SourceMark id="..." />` and
 * `<MetricWithCI sourceId="..." />`.
 *
 * Schema:
 *   label  — what the value measures (sentence-case, no period)
 *   value  — the canonical printed value (string), with units
 *   detail — optional short caveat, sample size, p-value, n
 *   file   — relative path to the pipeline output file the value comes from
 *   wave   — optional NDHS wave qualifier
 *   methods — optional methods drawer section id (`useMethods('id')`)
 */

export const SOURCES = {
  // -----------------------------------------------------------------------
  // Stage 1 — ML
  // -----------------------------------------------------------------------
  auc: {
    label: 'XGBoost test AUC-ROC',
    value: '0.972',
    detail: 'Held-out 30% test set, n = 1,463; gradient-boosted trees with cluster-level features',
    file: 'outputs/stage1/xgb_metrics.json',
    methods: 'risk-model',
  },
  prevalence: {
    label: 'National weighted zero-dose prevalence',
    value: '36.8%',
    detail: 'Children 12–23 months with h3 = 0; weighted by v005/1e6',
    file: 'outputs/stage1/eda/eda_summary_stats.csv',
    wave: 'NDHS 2024',
    methods: 'overview',
  },
  'morans-i': {
    label: "Moran's I (state-level prevalence)",
    value: '0.608',
    detail: 'z = 5.99, p < 1×10⁻⁶; queen contiguity, 999 permutations',
    file: 'outputs/stage1/eda/moran_lisa_clusters.csv',
    methods: 'overview',
  },
  'lca-classes': {
    label: 'LCA optimal class count',
    value: 'k = 4',
    detail: 'BIC-optimal among k = 2..6; mapped to Willing/Hesitant/Refusing',
    file: 'outputs/stage1/lca_summary.json',
    methods: 'risk-model',
  },
  'typology-silhouette': {
    label: 'Cluster typology silhouette',
    value: '0.32',
    detail: 'k-means k = 2; Reference 60.9% / Access-Constrained 39.1%',
    file: 'outputs/stage1/typology_summary.json',
    methods: 'risk-model',
  },
  'n-children': {
    label: 'Analytic sample size',
    value: 'n = 4,875',
    detail: 'Children 12–23 months, alive, with valid h3',
    file: 'outputs/stage1/eda/eda_summary_stats.csv',
    wave: 'NDHS 2024',
  },
  'n-clusters': {
    label: 'DHS clusters analysed',
    value: '1,283',
    file: 'outputs/stage1/eda/eda_summary_stats.csv',
    wave: 'NDHS 2024',
  },

  // -----------------------------------------------------------------------
  // Stage 2 — ABM
  // -----------------------------------------------------------------------
  'nw-disruption': {
    label: 'NW disruption posterior median',
    value: '1.73 (95% CrI 0.56 – 2.48)',
    detail: 'ABC-PMC posterior; multiplicative effect on access in NW zone',
    file: 'outputs/stage2/calibrated_params.json',
    methods: 'digital-twin',
  },
  'rmse-2024-national': {
    label: '2024 national validation RMSE',
    value: '0.070',
    detail: 'Out-of-sample; coverage units (0–1 scale)',
    file: 'outputs/stage2/abm_validation_report.md',
    methods: 'digital-twin',
  },
  'rmse-2024-zone': {
    label: '2024 zone validation RMSE',
    value: '0.075',
    file: 'outputs/stage2/abm_validation_report.md',
    methods: 'digital-twin',
  },
  'spearman-2024': {
    label: '2024 zone Spearman r',
    value: '0.943',
    detail: 'p = 0.005; six geopolitical zones',
    file: 'outputs/stage2/abm_validation_report.md',
    methods: 'digital-twin',
  },
  'calibration-rmse': {
    label: '2018 calibration RMSE',
    value: '0.033',
    detail: 'In-sample fit, target ≤ 0.10',
    file: 'outputs/stage2/abm_validation_report.md',
    methods: 'digital-twin',
  },

  // Scenario coverages — month-36 medians from abm_to_cna_matrix.csv
  's0-reference': {
    label: 'S0 month-36 coverage, Reference',
    value: '71.5%',
    detail: 'Status quo; median over 200 simulation draws',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },
  's0-access': {
    label: 'S0 month-36 coverage, Access-Constrained',
    value: '50.8%',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },
  's1-reference': {
    label: 'S1 month-36 coverage, Reference',
    value: '86.1%',
    detail: 'Mobile outreach only',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },
  's1-access': {
    label: 'S1 month-36 coverage, Access-Constrained',
    value: '77.2%',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },
  's5-reference': {
    label: 'S5 month-60 coverage, Reference',
    value: '90.7% (95% sim CI 90.3 – 91.1)',
    detail: 'Full combined package; median over 200 draws',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },
  's5-access': {
    label: 'S5 month-60 coverage, Access-Constrained',
    value: '83.7% (95% sim CI 83.1 – 84.2)',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },
  's5-reference-36': {
    label: 'S5 month-36 coverage, Reference',
    value: '89.2%',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },
  's5-access-36': {
    label: 'S5 month-36 coverage, Access-Constrained',
    value: '82.0%',
    file: 'outputs/stage2/abm_to_cna_matrix.csv',
    methods: 'digital-twin',
  },

  // -----------------------------------------------------------------------
  // Stage 3 — CNA
  // -----------------------------------------------------------------------
  'cna-necessity': {
    label: 'Outreach necessity consistency',
    value: '1.000',
    detail: 'Coverage = 0.75; robust at thresholds 0.70–0.90',
    file: 'outputs/stage3/cna_necessity_analysis.csv',
    methods: 'causal-recipes',
  },
  'cna-solutions': {
    label: 'CNA primary solutions',
    value: '4',
    detail: 'All single-condition; complexity = 1',
    file: 'outputs/stage3/cna_primary_solution.csv',
    methods: 'causal-recipes',
  },
};

/**
 * Look up a source by id with a tolerant fallback. Returns `null` when the id
 * is unknown — callers should render nothing rather than throw.
 */
export function getSource(id) {
  if (!id) return null;
  return SOURCES[id] || null;
}
