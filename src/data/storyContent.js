/**
 * storyContent.js — All narrative text, policy copy, and explorer descriptions
 * for the Zero-Dose Nigeria React dashboard.
 *
 * Every number is sourced from pipeline outputs (2026-03-24).
 * Source files:
 *   - outputs/stage1/ml_to_abm_params.json
 *   - outputs/stage2/abm_to_cna_matrix.csv
 *   - outputs/stage3/cna_policy_translations.md
 *   - outputs/stage1/eda/eda_summary_stats.csv
 *   - integrated_results_summary.md
 */

// ---------------------------------------------------------------------------
// 1. storySections — Scrollytelling narrative (6 sections)
// ---------------------------------------------------------------------------

export const storySections = [
  {
    id: 'crisis',
    title: 'The Crisis',
    narrativeBlocks: [
      'More than one in three Nigerian children never receives a single dose of the pentavalent vaccine. In our nationally representative sample of 4,875 children aged 12\u201323 months, the weighted zero-dose prevalence is 36.8%.',
      'Nigeria carries the largest zero-dose burden in sub-Saharan Africa. Globally, an estimated 14.3 million children are zero-dose \u2014 and Nigeria accounts for a disproportionate share. These are children invisible to the health system, unreached by even the most basic immunisation services.',
      'Behind every statistic is a child whose community, geography, or circumstances placed them beyond the reach of a vaccine that costs less than a dollar to deliver.',
    ],
    statHighlight: { value: '36.8%', label: 'Zero-dose prevalence (weighted)' },
    caption:
      'NDHS 2024 analytic sample: 4,875 children across 1,283 clusters, weighted by DHS survey design.',
  },
  {
    id: 'geography',
    title: 'The Geography',
    narrativeBlocks: [
      'Zero-dose children are not scattered randomly across Nigeria. A steep north\u2013south gradient concentrates the burden in the North West, where five states form a contiguous high-high hotspot: Sokoto (85.1%), Kebbi (84.1%), Zamfara (83.1%), Niger (55.9%), and Katsina (38.5%).',
      'Global spatial autocorrelation is strong: Moran\u2019s I = 0.608 (z = 5.99, p < 0.001). Communities with high zero-dose rates are surrounded by other high-rate communities, forming self-reinforcing pockets of under-vaccination.',
      'In the South East and South South, five states form low-low coldspots \u2014 Abia, Akwa Ibom, Anambra, Ebonyi, and Rivers \u2014 where zero-dose rates fall below 20%. The gap between Nigeria\u2019s best- and worst-performing states exceeds 80 percentage points.',
    ],
    statHighlight: { value: '0.608', label: "Moran's I (spatial clustering)" },
    caption:
      'LISA cluster analysis identifies 5 High-High hotspots (all NW) and 5 Low-Low coldspots (all SE/SS). 27 states not significant.',
  },
  {
    id: 'drivers',
    title: 'The Why',
    narrativeBlocks: [
      'A gradient-boosted machine learning model (XGBoost, AUC = 0.972) identifies which factors matter most. The single strongest predictor is cluster-level DPT1 coverage (SHAP = 1.62): a child\u2019s chance of being zero-dose depends heavily on whether other children in the same community are vaccinated.',
      'Vaccination card possession is the second most important factor (SHAP = 1.34), followed by antenatal care attendance (0.23) and a composite health-seeking score (0.19). These are markers of a mother\u2019s engagement with the formal health system.',
      'The pattern is clear: zero-dose status is driven by community-level systems failure and household-level disconnection from health services \u2014 not by individual refusal alone.',
    ],
    statHighlight: { value: '0.972', label: 'ML model accuracy (AUC-ROC)' },
    caption:
      'Top 5 SHAP features: cluster DPT1 coverage (1.62), vaccination card (1.34), cluster ZD prevalence (0.37), ANC visits (0.23), health-seeking composite (0.19).',
  },
  {
    id: 'digital-twin',
    title: 'The Digital Twin',
    narrativeBlocks: [
      'We built a digital replica of 1,283 Nigerian communities \u2014 38,490 simulated households whose vaccination decisions are shaped by trust, access, peer influence, rumour exposure, and community leader endorsement.',
      'The agent-based model is initialised from 2013 survey data, calibrated against 2018 coverage patterns (RMSE = 0.033), and validated out-of-sample against 2024 results (Spearman r = 0.943). It faithfully reproduces how vaccination coverage evolves over time in both well-served and underserved communities.',
      'Latent class analysis assigns each household to one of three trust states \u2014 Willing (15.7%), Hesitant (55.9%), or Refusing (28.4%) \u2014 that shift dynamically as neighbours vaccinate, rumours circulate, and health workers visit.',
    ],
    statHighlight: { value: '1,283', label: 'Communities simulated' },
    caption:
      'ABM calibrated on NDHS 2013/2018, validated on NDHS 2024. 6,000 simulation replicates (6 scenarios \u00d7 2 typologies \u00d7 500 runs).',
  },
  {
    id: 'recipes',
    title: 'The Recipes',
    narrativeBlocks: [
      'Six intervention strategies were tested across two community types. Under the status quo (S0), Reference communities reach 71.5% coverage and Access-Constrained communities reach only 50.8% \u2014 neither meets the 80% target.',
      'Mobile outreach alone (S1) lifts Reference communities to 86.1%, crossing the 80% threshold. But for Access-Constrained communities it achieves only 77.2% \u2014 close, but not enough. Community engagement alone (S2) has negligible effect in both settings.',
      'Only the full combined strategy \u2014 outreach plus community engagement plus supply reinforcement (S5) \u2014 pushes Access-Constrained communities past the target to 82.0%. Of 12 scenario-typology combinations tested, just 4 reach the 80% goal.',
    ],
    statHighlight: { value: '4/12', label: 'Scenarios reaching 80% coverage' },
    caption:
      'Coincidence Analysis confirms: outreach is necessary (necessity = 1.0) and sufficient for Reference communities; the full package is required for Access-Constrained communities.',
  },
  {
    id: 'action',
    title: 'What To Do',
    narrativeBlocks: [
      'The evidence points to a simple binary decision. For Reference communities \u2014 predominantly in southern Nigeria, where health infrastructure exists but coverage has stalled \u2014 deploying mobile outreach teams alone raises coverage from 71.5% to 86.1%.',
      'For Access-Constrained communities \u2014 concentrated in the North West and North East, where distance, trust deficits, and supply gaps compound \u2014 outreach alone falls short. These communities need the full package: mobile outreach, community engagement through trusted leaders, and supply chain reinforcement.',
      'This is not a one-size-fits-all problem, but the targeting rule is clear. Identify the community type, deploy the matching intervention bundle, and monitor coverage monthly. The digital twin can guide resource allocation in real time.',
    ],
    statHighlight: { value: '86.1%', label: 'Reference coverage with outreach' },
    caption:
      'Reference (60.9% of communities): outreach alone sufficient. Access-Constrained (39.1%): full S5 package required to reach 82.0%.',
  },
];

// ---------------------------------------------------------------------------
// 2. policyPanelTitles — Titles + subtitles for 4 policy dashboard panels
// ---------------------------------------------------------------------------

export const policyPanelTitles = [
  {
    id: 'geographic',
    title: 'Geographic Targeting',
    subtitle:
      'State-level zero-dose prevalence and spatial clustering to identify priority geographies.',
  },
  {
    id: 'intervention',
    title: 'Intervention Scenarios',
    subtitle:
      'Coverage outcomes for 6 strategies across 2 community types, with 80% target benchmarking.',
  },
  {
    id: 'counterfactual',
    title: 'What-If Explorer',
    subtitle:
      'Adjust outreach intensity, engagement rate, and supply reinforcement to see projected coverage in real time.',
  },
  {
    id: 'action',
    title: 'Action Plans',
    subtitle:
      'Priority state rankings, typology-specific policy briefs, and causal recipes for download.',
  },
];

// ---------------------------------------------------------------------------
// 3. typologyGuidance — Intervention guidance per community type
// ---------------------------------------------------------------------------

export const typologyGuidance = {
  'Access-Constrained': {
    primary: 'Full combined strategy (S5)',
    rationale:
      'Access-Constrained communities face compounding barriers: long travel times, trust deficits from limited health system contact, and inconsistent vaccine supply. Mobile outreach alone raises coverage to 77.2% \u2014 close to, but below the 80% target. Only when outreach is combined with community engagement through trusted local leaders and supply chain reinforcement does coverage reach 82.0%.',
    aloneSufficient: false,
    expectedCoverage: '82.0%',
    components: [
      {
        name: 'Mobile outreach',
        description:
          'Deploy vaccination teams to communities beyond 60 minutes from the nearest health facility, on a monthly rotating schedule.',
      },
      {
        name: 'Community engagement',
        description:
          'Partner with religious and traditional leaders to endorse vaccination, counter rumours, and mobilise households before outreach visits.',
      },
      {
        name: 'Supply reinforcement',
        description:
          'Ensure cold chain integrity and vaccine stock availability at outreach points through pre-positioned supplies and real-time inventory monitoring.',
      },
    ],
  },
  Reference: {
    primary: 'Mobile outreach only (S1)',
    rationale:
      'Reference communities have adequate health infrastructure and moderate trust levels, but coverage has stalled at 71.5% due to residual access gaps. Mobile outreach alone is both necessary and sufficient, raising coverage to 86.1%. Adding community engagement (S4: 86.1%) provides no additional benefit, confirming that trust is not the binding constraint in these communities.',
    aloneSufficient: true,
    expectedCoverage: '86.1%',
    components: [
      {
        name: 'Mobile outreach',
        description:
          'Extend vaccination services to under-served pockets within otherwise well-served communities through periodic outreach sessions at markets, schools, and community centres.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 4. recipePlainLanguage — Expanded translations of CNA formulas
// ---------------------------------------------------------------------------

export const recipePlainLanguage = {
  'outreach -> outcome': {
    formula: 'outreach <-> outcome_binary',
    translation:
      'Mobile outreach is the single necessary condition for reaching 80% coverage. Every scenario that achieves the target includes outreach. For Reference communities, outreach alone is sufficient.',
    consistency: 1.0,
    coverage: 0.75,
    necessity: 1.0,
    interpretation:
      'Outreach appears in all four positive outcome cases. No community reaches 80% without it.',
  },
  'supply_reinf -> outcome': {
    formula: 'supply_reinf <-> outcome_binary',
    translation:
      'Supply reinforcement is associated with the outcome but is not necessary on its own. It is a critical component of the full package needed for Access-Constrained communities.',
    consistency: 0.75,
    coverage: 0.75,
    necessity: 0.5,
    interpretation:
      'Present in 3 of 4 positive cases. Required for Access-Constrained communities but not for Reference.',
  },
  'NOT access_constrained -> outcome': {
    formula: 'ACCESS_CONSTRAINED <-> outcome_binary',
    translation:
      'Being a Reference community (i.e., NOT Access-Constrained) is itself associated with positive outcomes, reflecting the structural advantage of existing health infrastructure.',
    consistency: 0.833,
    coverage: 0.625,
    necessity: null,
    interpretation:
      'Reference communities achieve the target under 3 of 6 scenarios; Access-Constrained communities under only 1 of 6.',
  },
  'comm_engage -> outcome': {
    formula: 'comm_engage <-> outcome_binary',
    translation:
      'Community engagement alone has negligible standalone effect (S2 coverage: 71.5% Reference, 51.2% Access-Constrained). It adds value only as part of the full S5 package for Access-Constrained settings.',
    consistency: 0.833,
    coverage: 0.625,
    necessity: 0.75,
    interpretation:
      'Present in 3 of 4 positive cases, but S1 (outreach alone) succeeds without it for Reference communities.',
  },
};

// ---------------------------------------------------------------------------
// 5. policyBriefContent — Per-typology policy brief content
// ---------------------------------------------------------------------------

export const policyBriefContent = {
  'Access-Constrained': {
    title: 'Policy Brief: Access-Constrained Communities',
    keyFinding:
      'Access-Constrained communities (39.1% of all communities, concentrated in North West and North East Nigeria) require the full combined intervention strategy to reach the 80% Pentavalent-1 coverage target. Under the status quo, coverage is only 50.8%. Mobile outreach alone raises this to 77.2%, but the target is only met with the full S5 package (outreach + community engagement + supply reinforcement), which achieves 82.0%.',
    recommendedAction:
      'Deploy the full S5 intervention bundle in all communities classified as Access-Constrained. Prioritise the five LISA high-high hotspot states: Sokoto, Kebbi, Zamfara, Niger, and Katsina. Implementation should sequence outreach first (immediate coverage gains), then layer community engagement and supply reinforcement within the first 12 months.',
    expectedImpact:
      'Coverage increase from 50.8% to 82.0% (+31.2 percentage points). 95% credible interval: 81.6% to 82.4%. This represents approximately 1,900 additional children vaccinated per 10,000 in the eligible cohort.',
    evidenceQuality:
      'Strong. Based on 500 simulation replicates per scenario, calibrated against three waves of nationally representative DHS data (2013, 2018, 2024). Coincidence Analysis confirms robustness across all coverage thresholds from 70% to 90%. Validation Spearman r = 0.943.',
  },
  Reference: {
    title: 'Policy Brief: Reference Communities',
    keyFinding:
      'Reference communities (60.9% of all communities, predominantly in southern Nigeria) respond to mobile outreach alone. Under the status quo, coverage is 71.5%. Outreach raises this to 86.1%, well above the 80% target. Adding community engagement provides no additional benefit (S4: 86.1%), confirming that trust is not the binding constraint.',
    recommendedAction:
      'Deploy mobile outreach teams to under-served pockets within Reference communities. Focus on periurban areas and communities with above-average travel times to health facilities. Community engagement resources should be redirected to Access-Constrained settings where they are needed.',
    expectedImpact:
      'Coverage increase from 71.5% to 86.1% (+14.6 percentage points). 95% credible interval: 85.7% to 86.5%. This is the most cost-effective intervention configuration, achieving the target with a single intervention component.',
    evidenceQuality:
      'Strong. CNA identifies outreach as both necessary and sufficient (consistency = 1.0, coverage = 1.0 within Reference typology). Result is robust across all coverage thresholds tested (0.70 to 0.90).',
  },
};

// ---------------------------------------------------------------------------
// 6. explorerTabDescriptions — Subtitle for each of the 7 technical tabs
// ---------------------------------------------------------------------------

export const explorerTabDescriptions = {
  descriptive:
    'Weighted sample characteristics for 4,875 children: demographics, health-seeking behaviour, and access barriers, stratified by zero-dose status.',
  spatial:
    'State-level zero-dose prevalence, global Moran\u2019s I spatial autocorrelation (0.608), and LISA cluster classification for 37 states + FCT.',
  risk:
    'XGBoost SHAP feature importance (AUC = 0.972): global rankings, zone-stratified comparisons, and cluster-level risk mapping.',
  trust:
    'Latent class profiles for 3 trust states (Willing 15.7%, Hesitant 55.9%, Refusing 28.4%) and posterior class assignment distributions.',
  abm:
    'Agent-based model trajectories for 6 intervention scenarios across 2 community typologies, with ABC calibration posterior distributions.',
  cna:
    'Coincidence Analysis solutions: causal recipes, necessity scores, robustness across coverage thresholds (0.70\u20130.90), and typology-stratified formulas.',
  export:
    'Download pipeline outputs: data tables, model parameters, scenario results, and publication-quality figures in CSV, JSON, and PDF formats.',
};
