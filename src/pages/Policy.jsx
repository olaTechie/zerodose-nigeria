import { useState, useEffect } from 'react';
import EditorialBlock from '../components/shared/EditorialBlock';
import PageHeader from '../components/shared/PageHeader';
import KeyFigure from '../components/shared/KeyFigure';
import GlossaryTerm from '../components/shared/GlossaryTerm';
import { MethodsLink } from '../components/shared/MethodsDrawer';
import OperationalHeadline from '../components/shared/OperationalHeadline';
import CoverageGauge from '../components/shared/CoverageGauge';
import CoverageTierBadge from '../components/shared/CoverageTierBadge';
import TypologyBadge from '../components/shared/TypologyBadge';
import ScenarioCard from '../components/shared/ScenarioCard';
import RecipeCard from '../components/shared/RecipeCard';
import PolicyBriefCard from '../components/shared/PolicyBriefCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorState from '../components/shared/ErrorState';
import StateBrief from '../components/shared/StateBrief';
import NigeriaMap from '../components/maps/NigeriaMap';
import CoverageHeatmap from '../components/charts/CoverageHeatmap';
import TrajectoryChart from '../components/charts/TrajectoryChart';
import NecessityBar from '../components/charts/NecessityBar';
import SiteNav from '../components/shared/SiteNav';
import UnderlineTabNav from '../components/shared/UnderlineTabNav';
import SectionToc from '../components/shared/SectionToc';
import { useData } from '../hooks/useData';
import { useCounterfactual } from '../hooks/useCounterfactual';
import { policyPanelTitles, typologyGuidance, recipePlainLanguage, policyBriefContent } from '../data/storyContent';
import { getPrevalenceColorScale } from '../components/maps/ChoroplethLayer';
import { thStyle, tdStyle } from '../styles/tableStyles';

export default function Policy() {
  const tabs = policyPanelTitles.map((t) => ({ id: t.id, label: t.title }));
  const [activeId, setActiveId] = useState(tabs[0].id);
  const activeIdx = tabs.findIndex((t) => t.id === activeId);

  return (
    <div style={{ background: '#fbfcfb', minHeight: '100vh' }}>
      {/* Nav */}
      <SiteNav activePage="policy" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <PageHeader
          title="Policy Dashboard"
          subtitle="Pick a community type. Read the recipe. Allocate the resource."
        />

        {/* Operational headline — the page lede (per design brief §2 Policy) */}
        <div id="recipe">
          <OperationalHeadline mode="hero" />
        </div>

        {/* Single underline-tab pattern (design brief §9) */}
        <div style={{ marginTop: '1.5rem' }}>
          <UnderlineTabNav
            ariaLabel="Policy panels"
            tabs={tabs}
            activeId={activeId}
            onChange={setActiveId}
          />
        </div>

        {/* Calm panel swap — instant render per the /animate budget; no scroll or fade. */}
        <div key={activeId}>
          {activeIdx === 0 && <GeographicPanel />}
          {activeIdx === 1 && <InterventionPanel />}
          {activeIdx === 2 && <CounterfactualPanel />}
          {activeIdx === 3 && <ActionPanel />}
        </div>
      </div>
    </div>
  );
}

// ---- Panel 1: Geographic Targeting ----
function GeographicPanel() {
  const { data: stateData, loading: l1, error: e1, retry: r1 } = useData('state_prevalence.json');
  const { data: lisaData, loading: l2, error: e2, retry: r2 } = useData('lisa_clusters.json');
  const { data: clusterData, loading: l3, error: e3, retry: r3 } = useData('cluster_map.geojson');
  const [showLisa, setShowLisa] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [briefState, setBriefState] = useState(null);
  const colorScale = getPrevalenceColorScale(90);

  const anyError = e1 || e2 || e3;
  if (l1 || l2 || l3) return <LoadingSpinner />;
  if (anyError)
    return (
      <ErrorState
        source="Policy · geographic targeting"
        title="Geographic data unavailable"
        message="State prevalence, LISA clusters, or the cluster map failed to load."
        onRetry={() => { r1(); r2(); r3(); }}
      />
    );

  return (
    <div>
      <dl style={{ display: 'flex', gap: '2.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <KeyFigure
          label={<GlossaryTerm id="morans-i">Moran&rsquo;s I</GlossaryTerm>}
          value="0.608"
          sublabel="Strong spatial clustering"
          color="green"
          sourceId="morans-i"
        />
        <KeyFigure label="HH Hotspots" value="5" sublabel="NW states" color="red" />
        <KeyFigure label="LL Coldspots" value="5" sublabel="SE/SS states" color="blue" />
      </dl>

      <EditorialBlock>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: '#1c211d' }}>
            {showLisa ? 'LISA Cluster Map' : 'Zero-Dose Prevalence by State'}
          </h3>
          <button
            onClick={() => setShowLisa(!showLisa)}
            style={toggleBtnStyle(showLisa)}
          >
            {showLisa ? 'Show Prevalence' : 'Show LISA'}
          </button>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: '1 1 70%' }}>
            <NigeriaMap
              stateData={!showLisa ? stateData : null}
              lisaData={showLisa ? lisaData : null}
              showLisa={showLisa}
              colorScale={colorScale}
              colorByField="weighted_prevalence"
              onStateClick={setSelectedState}
              height={420}
            />
          </div>
          {selectedState && (
            <div style={{ flex: '1 1 28%' }}>
              <EditorialBlock>
                <h4 style={{ fontWeight: 700, fontSize: '1rem', marginBottom: '0.5rem' }}>{selectedState.state_name}</h4>
                <div style={{ fontSize: '0.85rem', lineHeight: 1.8 }}>
                  <div><strong>Zone:</strong> {selectedState.zone}</div>
                  <div><strong>ZD Prevalence:</strong> {selectedState.weighted_prevalence?.toFixed(1)}%</div>
                  <div><strong>Sample:</strong> {selectedState.n_children} children</div>
                  <div><strong>Zero-dose:</strong> {selectedState.n_zerodose} children</div>
                  {selectedState.cluster_type && (
                    <div><strong>LISA:</strong> {selectedState.cluster_type}</div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setBriefState(selectedState)}
                  style={{
                    marginTop: '0.75rem',
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    color: '#003d1e',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textDecoration: 'underline',
                    textUnderlineOffset: '3px',
                    fontFamily: 'inherit',
                  }}
                >
                  Generate brief for {selectedState.state_name} {'\u2192'}
                </button>
              </EditorialBlock>
            </div>
          )}
        </div>
      </EditorialBlock>

      {briefState && (
        <StateBrief
          stateProps={briefState}
          onClose={() => setBriefState(null)}
        />
      )}
    </div>
  );
}

// ---- Panel 2: Intervention Scenarios ----
function InterventionPanel() {
  const { data: abmData, loading, error, retry } = useData('abm_scenarios.json');
  const [selectedCell, setSelectedCell] = useState(null);

  if (error)
    return (
      <ErrorState
        source="Policy · intervention scenarios"
        title="Scenario data unavailable"
        message="The ABM scenario matrix (abm_scenarios.json) failed to load."
        onRetry={retry}
      />
    );
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {/* Typology callout — the only sanctioned use of the side stripe (brief §6) */}
        <aside
          style={{
            flex: '1 1 280px',
            paddingLeft: '1rem',
            borderLeft: '2px solid #2e7d32',
          }}
        >
          <TypologyBadge typology="Reference" />
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#697269' }}>
            60.9% of communities
          </div>
          <p style={{ fontSize: '0.9375rem', marginTop: '0.4rem', color: '#1c211d', lineHeight: 1.55 }}>
            {typologyGuidance.Reference.primary}
          </p>
        </aside>
        <aside
          style={{
            flex: '1 1 280px',
            paddingLeft: '1rem',
            borderLeft: '2px solid #1565c0',
          }}
        >
          <TypologyBadge typology="Access-Constrained" />
          <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#697269' }}>
            39.1% of communities
          </div>
          <p style={{ fontSize: '0.9375rem', marginTop: '0.4rem', color: '#1c211d', lineHeight: 1.55 }}>
            {typologyGuidance['Access-Constrained'].primary}
          </p>
        </aside>
      </div>

      <EditorialBlock>
        <h3 className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1c211d' }}>
          Coverage by Scenario and Typology
        </h3>
        {abmData && (
          <CoverageHeatmap matrix={abmData.matrix} onCellClick={setSelectedCell} />
        )}
      </EditorialBlock>

      {selectedCell && (
        <div style={{ marginTop: '1rem' }}>
          <ScenarioCard
            scenario={selectedCell.scenario_id}
            typology={selectedCell.typology}
            coverage={selectedCell.coverage_month36_median}
            p025={selectedCell.coverage_month36_p025}
            p975={selectedCell.coverage_month36_p975}
          />
        </div>
      )}
    </div>
  );
}

// ---- Panel 3: What-If Explorer ----
function CounterfactualPanel() {
  const { data: abmData, loading, error: dataError, retry: dataRetry } = useData('abm_scenarios.json');
  const { result, compute, ready, error: workerError } = useCounterfactual();
  const [typology, setTypology] = useState('Reference');
  const [outreach, setOutreach] = useState(1);
  const [engagement, setEngagement] = useState(0);
  const [supply, setSupply] = useState(0);

  useEffect(() => {
    if (ready) {
      compute({
        outreach_mult: outreach,
        engagement_rate: engagement,
        supply_reduction: supply,
        typology,
      });
    }
  }, [ready, outreach, engagement, supply, typology, compute]);

  const coverageValue = result?.median_m36 ?? 0;

  if (dataError)
    return (
      <ErrorState
        source="Policy · what-if explorer"
        title="Counterfactual data unavailable"
        message="The ABM scenario matrix (abm_scenarios.json) failed to load."
        onRetry={dataRetry}
      />
    );
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {workerError && (
        <div style={{ padding: '1rem 1.5rem', color: '#b33000', background: '#fbe9e7', marginBottom: '1rem' }}>
          Counterfactual engine error: {workerError}
        </div>
      )}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Controls */}
        <div style={{ flex: '1 1 350px' }}>
          <EditorialBlock>
            <h3 className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', color: '#1c211d' }}>
              Adjust Intervention Parameters
            </h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Community Type</label>
              <UnderlineTabNav
                ariaLabel="Community type"
                tabs={[
                  { id: 'Reference', label: 'Reference' },
                  { id: 'Access-Constrained', label: 'Access-Constrained' },
                ]}
                activeId={typology}
                onChange={setTypology}
                size="compact"
              />
            </div>

            <SliderControl
              label="Outreach intensity"
              value={outreach}
              min={0} max={4} step={1}
              onChange={(v) => setOutreach(parseInt(v, 10))}
              display={`${outreach}x`}
            />
            <SliderControl
              label="Engagement rate"
              value={engagement}
              min={0} max={0.15} step={0.05}
              onChange={(v) => setEngagement(parseFloat(v))}
              display={`${(engagement * 100).toFixed(0)}%`}
            />
            <SliderControl
              label="Supply reduction"
              value={supply}
              min={0} max={0.75} step={0.25}
              onChange={(v) => setSupply(parseFloat(v))}
              display={`${(supply * 100).toFixed(0)}%`}
            />
          </EditorialBlock>
        </div>

        {/* Results */}
        <div style={{ flex: '1 1 400px' }}>
          <EditorialBlock>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <CoverageGauge value={coverageValue} size={220} />
            </div>
            {result?.trajectory && abmData && (
              <TrajectoryChart
                trajectories={abmData.trajectories}
                selectedScenarios={['S0']}
                typology={typology}
                customTrajectory={result.trajectory}
                customLabel={`Custom ${(coverageValue * 100).toFixed(1)}%`}
                height={280}
              />
            )}
            {!ready && !workerError && (
              <p style={{ textAlign: 'center', fontSize: '0.85rem', color: '#78909c' }}>
                Loading interpolation engine...
              </p>
            )}
          </EditorialBlock>
        </div>
      </div>
    </div>
  );
}

function SliderControl({ label, value, min, max, step, onChange, display }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
        <label style={labelStyle}>{label}</label>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#006633' }}>{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{ width: '100%', accentColor: '#006633' }}
        aria-label={label}
      />
    </div>
  );
}

// ---- Panel 4: Action Plans ----
// Restructured per design brief §2: 17 atomic regions consolidated into 4
// named sections with stable ids that drive a left-rail TOC + scroll-spy.
//
// Order follows the operational logic:
//   1. Priority states (necessity bar + table)
//   2. Recipes per typology (RecipeCard pair)
//   3. Policy briefs (PolicyBriefCard pair)
//   4. State-specific brief generator (Tunde affordance from /harden)
const ACTION_SECTIONS = [
  { id: 'priority-states', label: 'Priority states' },
  { id: 'causal-recipes', label: 'Causal recipes' },
  { id: 'policy-briefs', label: 'Policy briefs' },
  { id: 'state-brief', label: 'State-specific brief' },
];

function ActionPanel() {
  const { data: stateData, loading: l1, error: e1, retry: r1 } = useData('state_prevalence.json');
  const { data: cnaData, loading: l2, error: e2, retry: r2 } = useData('cna_solutions.json');
  const [briefStateName, setBriefStateName] = useState('');
  const [briefStateProps, setBriefStateProps] = useState(null);

  const anyError = e1 || e2;
  if (l1 || l2) return <LoadingSpinner />;
  if (anyError)
    return (
      <ErrorState
        source="Policy · action plans"
        title="Priority data unavailable"
        message="State prevalence or CNA solution data failed to load."
        onRetry={() => { r1(); r2(); }}
      />
    );

  const allStates = (stateData?.features ?? []).map((f) => f.properties);

  const priorityStates = allStates
    .filter((p) => p.weighted_prevalence > 30)
    .sort((a, b) => b.weighted_prevalence - a.weighted_prevalence)
    .slice(0, 10);

  function handleGenerate() {
    if (!briefStateName) return;
    const match = allStates.find(
      (s) => s.state_name?.toLowerCase() === briefStateName.toLowerCase().trim()
    );
    if (match) setBriefStateProps(match);
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 28%) minmax(0, 1fr)',
        gap: '2rem',
        alignItems: 'flex-start',
      }}
      className="action-panel-grid"
    >
      <SectionToc sections={ACTION_SECTIONS} ariaLabel="Action plan sections" topOffset={96} />

      <div>
        {/* 1 — Priority states (necessity bar + table) */}
        <section
          id="priority-states"
          aria-labelledby="priority-states-heading"
          style={{ scrollMarginTop: '96px', marginBottom: '3rem' }}
        >
          <h2
            id="priority-states-heading"
            className="font-serif"
            style={sectionHeadingStyle}
          >
            Priority states
          </h2>
          <p style={sectionLeadStyle}>
            States with weighted zero-dose prevalence above 30%, ranked by burden.
            The necessity bar shows which conditions appear in every CNA solution
            for the recovery outcome — interventions that no successful recipe omits.
          </p>

          {cnaData && (
            <EditorialBlock>
              <h3 className="font-serif" style={subHeadingStyle}>Necessity Analysis</h3>
              <NecessityBar data={cnaData.necessity} threshold={0.75} />
            </EditorialBlock>
          )}

          <EditorialBlock style={{ marginTop: '1rem' }}>
            <h3 className="font-serif" style={subHeadingStyle}>Top 10 priority states</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Rank</th>
                    <th style={{ ...thStyle, textAlign: 'left' }}>State</th>
                    <th style={thStyle}>Zone</th>
                    <th style={thStyle}>ZD Prevalence</th>
                    <th style={thStyle}>Sample</th>
                  </tr>
                </thead>
                <tbody>
                  {priorityStates.map((s, i) => (
                    <tr key={s.state_name}>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{i + 1}</td>
                      <td style={tdStyle}>{s.state_name}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{s.zone}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <CoverageTierBadge value={1 - s.weighted_prevalence / 100} />
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{s.n_children}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </EditorialBlock>
        </section>

        {/* 2 — Recipes per typology */}
        <section
          id="causal-recipes"
          aria-labelledby="causal-recipes-heading"
          style={{ scrollMarginTop: '96px', marginBottom: '3rem' }}
        >
          <h2
            id="causal-recipes-heading"
            className="font-serif"
            style={sectionHeadingStyle}
          >
            Causal recipes
          </h2>
          <p style={sectionLeadStyle}>
            Two minimal sufficient combinations of conditions, one per community type.
            Read the formula, then deploy the matching intervention bundle.{' '}
            <MethodsLink sectionId="cna">Methods</MethodsLink>.
          </p>
          {Object.entries(recipePlainLanguage).map(([key, recipe]) => (
            <RecipeCard
              key={key}
              formula={recipe.formula}
              translation={recipe.translation}
              consistency={recipe.consistency}
              coverage={recipe.coverage}
            />
          ))}
        </section>

        {/* 3 — Policy briefs */}
        <section
          id="policy-briefs"
          aria-labelledby="policy-briefs-heading"
          style={{ scrollMarginTop: '96px', marginBottom: '3rem' }}
        >
          <h2
            id="policy-briefs-heading"
            className="font-serif"
            style={sectionHeadingStyle}
          >
            Policy briefs
          </h2>
          <p style={sectionLeadStyle}>
            Printable one-page briefs per community type. Suitable for handover to
            state coordinators or commissioners.
          </p>
          <PolicyBriefCard typology="Reference" content={policyBriefContent.Reference} />
          <PolicyBriefCard typology="Access-Constrained" content={policyBriefContent['Access-Constrained']} />
        </section>

        {/* 4 — State-specific brief generator (Tunde affordance) */}
        <section
          id="state-brief"
          aria-labelledby="state-brief-heading"
          style={{ scrollMarginTop: '96px', marginBottom: '3rem' }}
        >
          <h2
            id="state-brief-heading"
            className="font-serif"
            style={sectionHeadingStyle}
          >
            State-specific brief
          </h2>
          <p style={sectionLeadStyle}>
            Generate a one-page brief for a single state — typology assignment,
            coverage projection, and recommended package — ready to print.
          </p>
          <EditorialBlock>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGenerate();
              }}
              style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}
            >
              <div style={{ flex: '1 1 240px' }}>
                <label htmlFor="state-brief-input" style={labelStyle}>State name</label>
                <input
                  id="state-brief-input"
                  list="state-brief-list"
                  type="text"
                  value={briefStateName}
                  onChange={(e) => setBriefStateName(e.target.value)}
                  placeholder="e.g. Sokoto, Lagos, Anambra"
                  style={{
                    width: '100%',
                    padding: '0.55rem 0.75rem',
                    border: '1px solid #c7cfc7',
                    background: '#fbfcfb',
                    fontSize: '0.9375rem',
                    fontFamily: 'inherit',
                    color: '#1c211d',
                    borderRadius: '2px',
                  }}
                />
                <datalist id="state-brief-list">
                  {allStates.map((s) => (
                    <option key={s.state_name} value={s.state_name} />
                  ))}
                </datalist>
              </div>
              <button
                type="submit"
                disabled={!briefStateName}
                style={{
                  padding: '0.6rem 1.1rem',
                  background: '#003d1e',
                  color: '#fbfcfb',
                  border: 'none',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  letterSpacing: '0.04em',
                  textTransform: 'uppercase',
                  cursor: briefStateName ? 'pointer' : 'not-allowed',
                  opacity: briefStateName ? 1 : 0.5,
                  fontFamily: 'inherit',
                  borderRadius: '2px',
                }}
              >
                Generate brief
              </button>
            </form>
            <p style={{ fontSize: '0.8125rem', color: '#697269', marginTop: '0.75rem' }}>
              Or click any state on the{' '}
              <a
                href="#recipe"
                style={{ color: '#003d1e', textDecoration: 'underline', textUnderlineOffset: '3px' }}
              >
                Geographic Targeting map
              </a>{' '}
              to generate a brief from there.
            </p>
          </EditorialBlock>
        </section>
      </div>

      {briefStateProps && (
        <StateBrief
          stateProps={briefStateProps}
          onClose={() => setBriefStateProps(null)}
        />
      )}

      <style>{`
        @media (max-width: 767px) {
          .action-panel-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const labelStyle = {
  fontSize: '0.75rem',
  fontWeight: 500,
  color: '#697269',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  display: 'block',
  marginBottom: '0.4rem',
};

const sectionHeadingStyle = {
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#003d1e',
  margin: '0 0 0.5rem 0',
  lineHeight: 1.2,
};

const sectionLeadStyle = {
  fontSize: '0.9375rem',
  color: '#697269',
  margin: '0 0 1.25rem 0',
  maxWidth: '60ch',
  lineHeight: 1.55,
};

const subHeadingStyle = {
  fontSize: '1.125rem',
  fontWeight: 600,
  marginBottom: '0.75rem',
  color: '#1c211d',
  margin: '0 0 0.75rem 0',
};

function toggleBtnStyle(active) {
  return {
    padding: '0.35rem 0.75rem',
    borderRadius: '2px',
    border: '1px solid #003d1e',
    background: active ? '#003d1e' : 'transparent',
    color: active ? '#ffffff' : '#003d1e',
    fontSize: '0.8125rem',
    fontWeight: 500,
    cursor: 'pointer',
    fontFamily: 'inherit',
  };
}
