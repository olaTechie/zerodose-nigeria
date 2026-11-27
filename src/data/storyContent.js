/**
 * storyContent.js — Narrative text, policy copy and explorer descriptions
 * for the Zero-Dose Nigeria dashboard.
 *
 * Updated 2026-11-24 to match the revised Paper 1 manuscript. Sources:
 *   - outputs/twin/abm_to_cna_matrix.csv (simulated coverage, months 36 and 60)
 *   - outputs/twin/abm_validation_report.md (calibration fit)
 *   - outputs/tables/shap_global_importance.csv, cna_*.csv
 *   - revision_analysis/paper1/output/04_frontier.csv, 04_table2_rebuilt.csv (economics)
 *   - revision_analysis/paper1/output/03c_zero_dose_by_published_class.csv (classes)
 */

// ---------------------------------------------------------------------------
// 1. storySections — Scrollytelling narrative (7 sections)
// ---------------------------------------------------------------------------

export const storySections = [
  {
    id: 'crisis',
    title: 'The Crisis',
    narrativeBlocks: [
      'More than one in three Nigerian children aged 12 to 23 months has received no dose of a DTP-containing vaccine. In our nationally representative sample of 4,875 children, the weighted zero-dose prevalence is 36.8%.',
      'Globally, an estimated 13.5 million infants were zero-dose in 2025, receiving no dose of a DTP-containing vaccine, and Nigeria carries one of the largest such populations worldwide.',
      'Zero-dose children are the clearest sign of where routine immunisation is not reaching families.',
    ],
    statHighlight: { value: '36.8%', label: 'Zero-dose prevalence (weighted)' },
    caption:
      'NDHS 2024 analytic sample: 4,875 children across 1,283 clusters, weighted by DHS survey design.',
  },
  {
    id: 'geography',
    title: 'The Geography',
    narrativeBlocks: [
      'Zero-dose children are not scattered randomly across Nigeria. A steep north–south gradient concentrates the burden in the North West, where five states form a contiguous high-high hotspot: Sokoto (85.1%), Kebbi (84.1%), Zamfara (83.1%), Niger (55.9%) and Katsina (38.5%).',
      'Global spatial autocorrelation is strong: Moran’s I = 0.607 (z = 5.99, p < 0.001). States with high zero-dose rates are surrounded by other high-rate states, forming pockets of under-vaccination.',
      'In the South East and South South, five states form low-low coldspots (Abia, Akwa Ibom, Anambra, Ebonyi and Rivers), where zero-dose rates fall below 20%. The gap between Nigeria’s best- and worst-performing states exceeds 80 percentage points.',
    ],
    statHighlight: { value: '0.607', label: "Moran's I (spatial clustering)" },
    caption:
      'LISA cluster analysis identifies 5 High-High hotspots (all NW) and 5 Low-Low coldspots (all SE/SS). 27 states not significant.',
  },
  {
    id: 'drivers',
    title: 'Who Is at Risk',
    narrativeBlocks: [
      'A gradient-boosted machine learning model (XGBoost) predicts zero-dose status well on held-out children (AUC 0.947, 95% CI 0.930 to 0.961). The strongest predictor is vaccination card possession (mean absolute SHAP 1.46), 2.7 times the next variable.',
      'The next four are the maternal health-seeking composite (0.53), antenatal care visits (0.27), maternal education (0.19) and a facility visit in the past 12 months (0.18): markers of a household’s prior contact with the health system. Without any card information the model still discriminates well (AUC 0.842, 95% CI 0.814 to 0.869).',
      'The pattern is consistent with zero-dose status reflecting low engagement with the health system rather than refusal alone. SHAP values describe how the model uses each variable; they do not identify causes.',
    ],
    statHighlight: { value: '0.947', label: 'Model AUC (held-out test set)' },
    caption:
      'Top 5 SHAP predictors: vaccination card (1.46), health-seeking composite (0.53), ANC visits (0.27), maternal education (0.19), facility visit in past 12 months (0.18).',
  },
  {
    id: 'linked-simulation',
    title: 'The Linked Simulation',
    narrativeBlocks: [
      'The risk model, the engagement classes and the community typology parameterise an agent-based simulation of 38,490 virtual children, 30 in each of 1,283 survey clusters. Each month a child’s probability of vaccination depends on their engagement score, access, any intervention and the share of vaccinated neighbours.',
      'Starting from the 2013 survey, 14 parameters were calibrated by rejection approximate Bayesian computation to DTP1 coverage in NDHS 2018 and 2024. Both surveys were calibration targets, so the simulation has no independent validation. It came within 3.9 percentage points of 2018 national coverage and overestimated 2024 national coverage by 7.0 points (70.2% against 63.2%).',
      'Latent class analysis identified four caregiver engagement classes: Class 1, low engagement (28.4%; 81.9% of its children zero-dose); Class 2, intermediate, COVID-19 vaccinated or unwilling (26.6%); Class 3, high engagement (29.2%); and Class 4, intermediate, willing but unvaccinated for COVID-19 (15.7%). Most zero-dose children are in Class 1, which records no refusal.',
    ],
    statHighlight: { value: '1,283', label: 'Survey clusters simulated' },
    caption:
      'Initialised at NDHS 2013; calibrated to NDHS 2018 and 2024 (calibration fit, not validation). 6,000 runs: 6 scenarios × 2 community types × 500 replicates.',
  },
  {
    id: 'disruption',
    title: 'Zone Disruption',
    narrativeBlocks: [
      'The calibration also estimated a disruption parameter for each geopolitical zone, representing extra stress on supply, health-worker presence and rumour arrival.',
      'The six posterior medians were similar, from 1.40 (North East) to 1.73 (North West), and their 95% intervals were wide and overlapping (about 0.52 to 2.48).',
      'The parameters therefore do not identify a distinct effect of insecurity, or of any single shock, in any zone. They are a device for fitting the simulation to both surveys, not measured quantities.',
    ],
    statHighlight: { value: '1.40 to 1.73', label: 'Zone disruption parameters (posterior medians)' },
    caption:
      'Posterior medians from the joint 2018 and 2024 calibration; 95% intervals about 0.52 to 2.48. Inferred, not measured.',
  },
  {
    id: 'packages',
    title: 'The Packages',
    narrativeBlocks: [
      'Six intervention packages were simulated in each community type over five years. Under the status quo (S0), coverage at month 36 is 69.4% in Reference communities and 43.9% in Access-Constrained communities; neither reaches the 80% target.',
      'Mobile outreach alone (S1) lifts Reference communities past 80% within three years (82.0% at month 36; 87.5% at month 60). In Access-Constrained communities it reaches 67.6% at month 36 and 78.4% at month 60, short of the target even after five years. Community engagement alone (S2) changes coverage little in either setting.',
      'In Access-Constrained communities only the full package (S5: outreach, community engagement and supply-chain reinforcement) reaches 80%, and only by month 60 (83.7%). Outreach with engagement did not reach it, and outreach with supply reinforcement alone was not simulated. Of the 12 simulated scenario-typology cells, 4 reach 80% by month 60.',
    ],
    statHighlight: { value: '4/12', label: 'Simulated cells reaching 80% by month 60' },
    caption:
      'Coincidence Analysis of the simulated scenarios: outreach was present in every configuration reaching 80% by month 60 (necessity consistency 1.00). The configurations inherit the simulation’s assumptions.',
  },
  {
    id: 'trade-off',
    title: 'The Trade-Off',
    narrativeBlocks: [
      'Supply-chain reinforcement alone was cost-saving in both community types, a no-regret step. Mobile outreach was the efficient choice at USD 800 per disability-adjusted life year (DALY) averted, and in Reference communities it reaches the 80% target on its own.',
      'Reaching 80% in Access-Constrained communities needed the full package, at USD 1,094 per DALY averted beyond outreach alone (USD 1,889 in Reference communities): above USD 800 but below USD 2,400 per DALY averted.',
      'The full package’s gains are concentrated where coverage is lowest (+35.8 percentage points by month 60 in Access-Constrained against +19.4 in Reference communities), so equity and efficiency point in different directions. The size of that trade-off rests on the assumed DALYs averted per zero-dose child (median 0.060).',
    ],
    statHighlight: { value: 'USD 1,094', label: 'Per DALY averted beyond outreach (Access-Constrained)' },
    caption:
      'Incremental analysis: societal perspective, five years, 3% discounting, 5,000 probabilistic draws. Unit costs and DALYs averted per zero-dose child are literature-informed assumptions.',
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
      'Simulated DTP1 coverage for 6 packages in 2 community types at months 36 and 60, against the 80% target.',
  },
  {
    id: 'scenario-explorer',
    title: 'Scenario Explorer',
    subtitle:
      'Choose a community type and intervention components to see the simulated coverage and cost per DALY averted. Only simulated combinations are shown.',
  },
  {
    id: 'action',
    title: 'Action Plans',
    subtitle:
      'Priority states, typology-specific policy briefs and intervention configurations.',
  },
];

// ---------------------------------------------------------------------------
// 3. typologyGuidance — Package guidance per community type
// ---------------------------------------------------------------------------

export const typologyGuidance = {
  'Access-Constrained': {
    primary: 'Full package (S5), reaching 80% by month 60',
    rationale:
      'Access-Constrained communities have longer travel times and lower engagement with services. In the simulation, outreach alone reached 67.6% at month 36 and 78.4% at month 60. Only the full package (outreach, community engagement and supply-chain reinforcement) reached 80%, and only by month 60 (83.7%), at USD 1,094 per DALY averted beyond outreach.',
    aloneSufficient: false,
    expectedCoverage: '83.7% by month 60',
  },
  Reference: {
    primary: 'Mobile outreach (S1), reaching 80% by month 36',
    rationale:
      'Reference communities have shorter travel times and higher engagement with services. In the simulation, outreach alone reached 82.0% at month 36 and 87.5% at month 60; adding community engagement (S4) changed coverage little (82.1% and 87.5%). Outreach was the efficient choice at USD 800 per DALY averted.',
    aloneSufficient: true,
    expectedCoverage: '82.0% by month 36',
  },
};

// ---------------------------------------------------------------------------
// 4. configurationSummaries — Plain-language summaries of the CNA output
// ---------------------------------------------------------------------------

export const configurationSummaries = {
  outreach: {
    formula: 'outreach <-> outcome_binary',
    translation:
      'Outreach was present in every simulated configuration reaching 80% DTP1 coverage by month 60 (necessity consistency 1.00). In Reference communities outreach alone reached the target.',
    consistency: 1.0,
    coverage: 0.75,
  },
  supply_reinf: {
    formula: 'supply_reinf <-> outcome_binary',
    translation:
      'Supply-chain reinforcement was present in 2 of the 4 cells reaching the target (necessity consistency 0.50). Alone it reached 76.8% (Reference) and 56.1% (Access-Constrained) by month 60. Outreach with supply reinforcement but without engagement was not simulated, so whether supply reinforcement or engagement is required in Access-Constrained communities cannot be determined.',
    consistency: 0.75,
    coverage: 0.75,
  },
  community_type: {
    formula: 'ACCESS_CONSTRAINED <-> outcome_binary',
    translation:
      'Community type: Reference communities reached the target under 3 of the 6 simulated packages (S1, S4, S5), Access-Constrained communities under 1 of 6 (the full package, S5).',
    consistency: 0.833,
    coverage: 0.625,
  },
  comm_engage: {
    formula: 'comm_engage <-> outcome_binary',
    translation:
      'Community engagement was present in 3 of the 4 cells reaching the target (necessity consistency 0.75), but alone (S2) it changed coverage little (71.4% Reference and 48.4% Access-Constrained by month 60, against 71.3% and 47.8% under the status quo). Outreach with engagement (S4) did not reach 80% in Access-Constrained communities (78.7% by month 60).',
    consistency: 0.833,
    coverage: 0.625,
  },
};

// ---------------------------------------------------------------------------
// 5. policyBriefContent — Per-typology policy brief content
// ---------------------------------------------------------------------------

export const policyBriefContent = {
  'Access-Constrained': {
    title: 'Policy Brief: Access-Constrained Communities',
    keyFinding:
      'Access-Constrained communities (39.1% of survey clusters, with longer travel times and lower engagement with services) reached 80% DTP1 coverage in the simulation only with the full package of outreach, community engagement and supply-chain reinforcement, and only by month 60. Under the status quo, simulated coverage was 43.9% at month 36; outreach alone reached 78.4% by month 60.',
    recommendedAction:
      'Where reaching 80% in these communities is the goal, the full package is the only simulated option that did so, at USD 1,094 per DALY averted beyond outreach alone: efficient at USD 2,400 but not at USD 800 per DALY averted. Supply-chain reinforcement was cost-saving and is a no-regret first step. A cluster-randomised trial of the full package against outreach alone in these communities is the logical next step.',
    expectedImpact:
      'Simulated coverage by month 60: 83.7% (95% simulation interval 83.1% to 84.2%) with the full package, against 47.8% under the status quo (+35.8 percentage points).',
    evidenceQuality:
      'Simulation-based: 500 replicates per scenario. The simulation was calibrated to NDHS 2018 and 2024 and has no independent validation; it overestimated 2024 national coverage by 7.0 percentage points. Unit costs and DALYs averted per zero-dose child are literature-informed assumptions, and the DALY value drives the economic conclusion.',
  },
  Reference: {
    title: 'Policy Brief: Reference Communities',
    keyFinding:
      'Reference communities (60.9% of survey clusters) reached 80% DTP1 coverage with mobile outreach alone within three years in the simulation. Under the status quo, simulated coverage was 69.4% at month 36; outreach raised it to 82.0% at month 36 and 87.5% at month 60. Adding community engagement changed coverage little (S4: 82.1% at month 36).',
    recommendedAction:
      'Mobile outreach, with supply-chain reinforcement as a cost-saving addition. Outreach was the efficient choice at USD 800 per DALY averted (USD 11.16 per DALY averted beyond supply reinforcement); the full package would cost USD 1,889 per DALY averted beyond outreach.',
    expectedImpact:
      'Simulated coverage with outreach alone: 82.0% at month 36 (95% simulation interval 81.5% to 82.6%) and 87.5% at month 60, against 69.4% and 71.3% under the status quo.',
    evidenceQuality:
      'Simulation-based: 500 replicates per scenario, calibrated to NDHS 2018 and 2024 with no independent validation. Coincidence Analysis describes the simulated packages, not empirical causal effects.',
  },
};

// ---------------------------------------------------------------------------
// 6. explorerTabDescriptions — Subtitle for each technical tab
// ---------------------------------------------------------------------------

export const explorerTabDescriptions = {
  descriptive:
    'Weighted sample characteristics for 4,875 children: demographics, health-seeking behaviour and access barriers, stratified by zero-dose status.',
  spatial:
    'State-level zero-dose prevalence, global Moran’s I spatial autocorrelation (0.607), and LISA cluster classification for 36 states and the FCT.',
  risk:
    'XGBoost risk model (AUC 0.947, 95% CI 0.930 to 0.961; 0.842 without card information): global and zone-stratified SHAP rankings. SHAP describes the model’s predictions, not causal effects.',
  classes:
    'Four caregiver engagement classes from latent class analysis (nine indicators, 4,898 children, BIC 52,150.1). The classes describe engagement with services, not attitudes.',
  simulation:
    'Linked agent-based simulation: coverage at months 36 and 60 for 6 packages in 2 community types (500 replicates each), calibration fit to NDHS 2018 and 2024, and the calibrated parameters.',
  configurations:
    'Coincidence Analysis of the 12 simulated scenario-typology cells: intervention configurations reaching 80% DTP1 coverage by month 60, necessity, and robustness across coverage thresholds (0.70 to 0.90). Configurations describe simulated packages and are not empirical causal effects.',
  economics:
    'Cost-effectiveness over five years (societal perspective, 3% discounting, 5,000 probabilistic draws): each package against the status quo, and the incremental analysis along the efficiency frontier.',
  fairness:
    'Fairness audit of the risk model on the held-out test set: sensitivity at a 0.5 threshold by subgroup and the equal-opportunity gap (highest minus lowest sensitivity).',
  export:
    'Download the pre-computed outputs behind this dashboard as JSON files.',
};
