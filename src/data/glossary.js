/**
 * glossary.js — Central registry of jargon used on the site.
 * Per design brief Section 7 (jargon glossary tooltip): every acronym is
 * explained inline via dotted-underline tooltip; full glossary route lists
 * every term alphabetically.
 *
 * Each entry is keyed by a short id used in `<GlossaryTerm id="..." />`.
 *
 * Schema:
 *   term       — the surface form to render (e.g. "LCA", "Moran's I")
 *   expansion  — optional acronym expansion (e.g. "Latent Class Analysis")
 *   definition — 1–2 sentence plain-language definition
 */

export const GLOSSARY = {
  lca: {
    term: 'LCA',
    expansion: 'Latent Class Analysis',
    definition:
      'A statistical method that groups individuals into unobserved (latent) classes based on several categorical indicators. Used here to describe caregivers\u2019 engagement with services: ten indicators specified, nine used, four classes.',
  },
  shap: {
    term: 'SHAP',
    expansion: 'SHapley Additive exPlanations',
    definition:
      'A method from cooperative game theory that allocates a machine-learning model\u2019s prediction across its input variables. It describes how the model uses each variable, not causal effects.',
  },
  cna: {
    term: 'CNA',
    expansion: 'Coincidence Analysis',
    definition:
      'A configurational method that identifies which combinations of conditions are necessary and sufficient for an outcome. Used here to identify which simulated intervention packages reach 80% DTP1 coverage by month 60.',
  },
  'morans-i': {
    term: "Moran's I",
    definition:
      'A scalar measure of spatial autocorrelation. Values near +1 indicate strong clustering of similar values; values near 0 indicate spatial randomness.',
  },
  'auc-roc': {
    term: 'AUC-ROC',
    expansion: 'Area Under the Receiver Operating Characteristic curve',
    definition:
      'A measure of classification performance from 0.5 (random) to 1.0 (perfect). The risk model\u2019s held-out AUC is 0.947 (95% CI 0.930 to 0.961).',
  },
  rmse: {
    term: 'RMSE',
    expansion: 'Root Mean Square Error',
    definition:
      'Square root of the mean squared error between simulated and observed values; lower is better. Reported here in coverage units (0\u20131 scale).',
  },
  ia2030: {
    term: 'IA2030',
    expansion: 'Immunization Agenda 2030',
    definition:
      "WHO\u2019s framework for global immunization 2021\u20132030. Sets a target of \u226590% national coverage for routine vaccines and \u226580% subnational coverage.",
  },
  dtp1: {
    term: 'DTP1',
    expansion: 'First dose of diphtheria-tetanus-pertussis vaccine',
    definition:
      'In Nigeria given as pentavalent vaccine. A child with no DTP-containing dose is zero-dose.',
  },
  dhs: {
    term: 'DHS',
    expansion: 'Demographic and Health Survey',
    definition:
      'Nationally representative household surveys conducted in low- and middle-income countries; Nigeria has waves in 2003, 2008, 2013, 2018, and 2024.',
  },
  ndhs: {
    term: 'NDHS',
    expansion: 'Nigeria Demographic and Health Survey',
    definition:
      'Nigerian instance of the DHS programme; the primary data source for this study.',
  },
  pentavalent: {
    term: 'Pentavalent',
    definition:
      'A combined vaccine protecting against five diseases: diphtheria, pertussis, tetanus, hepatitis B and Haemophilus influenzae type b. Its first dose counts as DTP1.',
  },
  s0: {
    term: 'S0',
    definition: 'Status quo scenario: no intervention beyond current routine practice.',
  },
  s1: {
    term: 'S1',
    definition:
      'Mobile outreach intervention: deploy mobile vaccination teams to communities with low static-facility access.',
  },
  s5: {
    term: 'S5',
    definition:
      'The full package: mobile outreach + community engagement + supply-chain reinforcement.',
  },
  'access-constrained': {
    term: 'Access-Constrained',
    definition:
      'A community type identified by k-means clustering: survey clusters with longer travel times and lower engagement with services. 39.1% of clusters in NDHS 2024.',
  },
  reference: {
    term: 'Reference',
    definition:
      'A community type identified by k-means clustering: survey clusters with shorter travel times and higher engagement with services. 60.9% of clusters in NDHS 2024.',
  },
  abm: {
    term: 'ABM',
    expansion: 'Agent-Based Model',
    definition:
      'A simulation that represents individual decision-makers and runs forward in time under specified rules. Here, 38,490 virtual children in 1,283 survey clusters, linked to the risk model and the economic model.',
  },
  daly: {
    term: 'DALY',
    expansion: 'Disability-adjusted life year',
    definition:
      'A measure of health loss combining years of life lost and years lived with disability. Costs are reported per DALY averted.',
  },
  icer: {
    term: 'ICER',
    expansion: 'Incremental cost-effectiveness ratio',
    definition: 'The extra cost per extra DALY averted when moving from one package to the next along the efficiency frontier.',
  },
  'engagement-class': {
    term: 'Engagement class',
    definition:
      'One of four caregiver classes from latent class analysis, distinguished mainly by contact with routine services. The classes describe engagement, not attitudes.',
  },
  lisa: {
    term: 'LISA',
    expansion: 'Local Indicators of Spatial Association',
    definition:
      'Per-location version of Moran\u2019s I that flags hotspots (High-High) and coldspots (Low-Low) of an outcome.',
  },
  consistency: {
    term: 'Consistency',
    definition:
      'In CNA, how reliably a condition goes with the outcome. A necessity consistency of 1.0 means every case with the outcome has the condition.',
  },
  'cna-coverage': {
    term: 'Coverage (CNA sense)',
    definition:
      'In CNA, the proportion of cases with the outcome that also share the condition. Distinct from vaccination coverage.',
  },
  'posterior-median': {
    term: 'Posterior median',
    definition:
      'The 50th percentile of a parameter\u2019s posterior distribution from the simulation\u2019s calibration (rejection approximate Bayesian computation).',
  },
  'credible-interval': {
    term: 'Credible interval',
    definition:
      'A Bayesian interval (95% CrI) within which a parameter lies with 95% probability given the data and prior.',
  },
  outreach: {
    term: 'Outreach',
    definition:
      'Mobile vaccination teams that travel to communities outside fixed facility catchment. The "S1" intervention component.',
  },
  'community-engagement': {
    term: 'Community engagement',
    definition:
      'Caregiver-targeted communication and mobilisation led by local leaders or community health workers.',
  },
  'supply-reinforcement': {
    term: 'Supply reinforcement',
    definition:
      'Cold-chain repair, stock buffering and routine restocking to prevent stock-outs.',
  },
  'zero-dose': {
    term: 'Zero-dose',
    definition:
      'A child aged 12 to 23 months who has received no dose of a DTP-containing vaccine.',
  },
};

export function getTerm(id) {
  if (!id) return null;
  return GLOSSARY[id] || null;
}

/**
 * Sorted list for the glossary route (alphabetical by `term`).
 */
export function getSortedGlossary() {
  return Object.entries(GLOSSARY)
    .map(([id, entry]) => ({ id, ...entry }))
    .sort((a, b) => a.term.localeCompare(b.term, 'en', { sensitivity: 'base' }));
}
