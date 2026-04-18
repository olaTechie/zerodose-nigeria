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
      'A statistical method that groups individuals into unobserved (latent) classes based on their answers to multiple categorical indicators. Used here to derive Willing/Hesitant/Refusing trust states from 10 manifest indicators.',
  },
  shap: {
    term: 'SHAP',
    expansion: 'SHapley Additive exPlanations',
    definition:
      'A method from cooperative game theory that allocates a machine-learning model\u2019s prediction fairly across input features. Used here to rank which features most influence zero-dose risk.',
  },
  cna: {
    term: 'CNA',
    expansion: 'Coincidence Analysis',
    definition:
      'A configurational comparative method that identifies the minimal sufficient combinations of conditions associated with an outcome. Used here to identify which intervention bundles produce \u226580% coverage.',
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
      'A measure of binary classification performance from 0.5 (random) to 1.0 (perfect). 0.972 indicates excellent discrimination.',
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
  dpt1: {
    term: 'DPT1',
    expansion: 'First dose of diphtheria-pertussis-tetanus vaccine',
    definition:
      'WHO operational definition of zero-dose status: a child is "zero-dose" if they have not received the first dose of any DTP-containing vaccine.',
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
      'A combined vaccine protecting against five diseases: diphtheria, pertussis, tetanus, hepatitis B, and Haemophilus influenzae type b. Pentavalent-1 is equivalent to DTP1 for zero-dose tracking.',
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
      'Full combined package: mobile outreach + community engagement + supply reinforcement, deployed simultaneously.',
  },
  'access-constrained': {
    term: 'Access-Constrained',
    definition:
      'A community typology identified by k-means clustering: communities with low static-facility access. 39.1% of clusters in NDHS 2024.',
  },
  reference: {
    term: 'Reference',
    definition:
      'A community typology identified by k-means clustering: communities with normative levels of static-facility access. 60.9% of clusters in NDHS 2024.',
  },
  abm: {
    term: 'ABM',
    expansion: 'Agent-Based Model',
    definition:
      'A simulation that represents individual decision-makers (here, caregivers and clusters) and runs forward in time under specified rules. The "digital twin" of Nigeria\u2019s 1,283 DHS clusters.',
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
      'In CNA, the proportion of cases sharing a condition that also have the outcome. A consistency of 1.0 means the condition is necessary.',
  },
  'cna-coverage': {
    term: 'Coverage (CNA sense)',
    definition:
      'In CNA, the proportion of cases with the outcome that also share the condition. Distinct from vaccination coverage.',
  },
  'posterior-median': {
    term: 'Posterior median',
    definition:
      'The 50th percentile of a parameter\u2019s posterior distribution from Bayesian calibration. Reported with a 95% credible interval.',
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
      'Caregiver-targeted communication and trust-building activities led by local leaders or community health workers.',
  },
  'supply-reinforcement': {
    term: 'Supply reinforcement',
    definition:
      'Cold-chain repair, vaccine stock buffering, and routine restock to eliminate stock-outs at static facilities.',
  },
  'zero-dose': {
    term: 'Zero-dose',
    definition:
      'WHO definition: a child aged 12\u201323 months who has not received the first dose of any DTP-containing vaccine (h3 = 0 in DHS).',
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
