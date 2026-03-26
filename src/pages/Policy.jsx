import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../components/shared/GlassCard';
import PageHeader from '../components/shared/PageHeader';
import MetricCard from '../components/shared/MetricCard';
import CoverageGauge from '../components/shared/CoverageGauge';
import CoverageTierBadge from '../components/shared/CoverageTierBadge';
import TypologyBadge from '../components/shared/TypologyBadge';
import ScenarioCard from '../components/shared/ScenarioCard';
import RecipeCard from '../components/shared/RecipeCard';
import PolicyBriefCard from '../components/shared/PolicyBriefCard';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import NigeriaMap from '../components/maps/NigeriaMap';
import CoverageHeatmap from '../components/charts/CoverageHeatmap';
import TrajectoryChart from '../components/charts/TrajectoryChart';
import NecessityBar from '../components/charts/NecessityBar';
import SiteNav from '../components/shared/SiteNav';
import { useData } from '../hooks/useData';
import { useCounterfactual } from '../hooks/useCounterfactual';
import { policyPanelTitles, typologyGuidance, recipePlainLanguage, policyBriefContent } from '../data/storyContent';
import { SCENARIO_LABELS, PIPELINE_METRICS } from '../data/constants';
import { getPrevalenceColorScale } from '../components/maps/ChoroplethLayer';
import { formatPercent } from '../utils/formatters';
import { thStyle, tdStyle } from '../styles/tableStyles';

export default function Policy() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = policyPanelTitles;

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <SiteNav activePage="policy" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <PageHeader title="Policy Dashboard" subtitle="Intervention targeting and resource allocation for zero-dose communities in Nigeria" />

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {tabs.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(i)}
              style={{
                padding: '0.5rem 1.2rem',
                borderRadius: '50px',
                border: activeTab === i ? '2px solid #006633' : '1px solid #e0e0e0',
                background: activeTab === i ? '#006633' : '#fff',
                color: activeTab === i ? '#fff' : '#546e7a',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {tab.title}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 0 && <GeographicPanel />}
            {activeTab === 1 && <InterventionPanel />}
            {activeTab === 2 && <CounterfactualPanel />}
            {activeTab === 3 && <ActionPanel />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

// ---- Panel 1: Geographic Targeting ----
function GeographicPanel() {
  const { data: stateData, loading: l1, error: e1 } = useData('state_prevalence.json');
  const { data: lisaData, loading: l2, error: e2 } = useData('lisa_clusters.json');
  const { data: clusterData, loading: l3, error: e3 } = useData('cluster_map.geojson');
  const [showLisa, setShowLisa] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const colorScale = getPrevalenceColorScale(90);

  const anyError = e1 || e2 || e3;
  if (l1 || l2 || l3) return <LoadingSpinner />;
  if (anyError) return <div className="glass-card" style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <MetricCard label="Moran's I" value="0.608" sublabel="Strong spatial clustering" color="green" />
        <MetricCard label="HH Hotspots" value="5" sublabel="NW states" color="red" />
        <MetricCard label="LL Coldspots" value="5" sublabel="SE/SS states" color="blue" />
      </div>

      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
            {showLisa ? 'LISA Cluster Map' : 'Zero-Dose Prevalence by State'}
          </h3>
          <button
            onClick={() => setShowLisa(!showLisa)}
            style={{ padding: '0.3rem 0.8rem', borderRadius: '50px', border: '1px solid #006633', background: showLisa ? '#006633' : '#fff', color: showLisa ? '#fff' : '#006633', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}
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
              <GlassCard>
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
              </GlassCard>
            </div>
          )}
        </div>
      </GlassCard>
    </div>
  );
}

// ---- Panel 2: Intervention Scenarios ----
function InterventionPanel() {
  const { data: abmData, loading, error } = useData('abm_scenarios.json');
  const [selectedCell, setSelectedCell] = useState(null);

  if (error) return <div className="glass-card" style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <GlassCard style={{ borderTop: '3px solid #2e7d32', textAlign: 'center' }}>
            <TypologyBadge typology="Reference" />
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#546e7a' }}>
              60.9% of communities
            </div>
            <div style={{ fontSize: '0.78rem', marginTop: '0.3rem' }}>
              {typologyGuidance.Reference.primary}
            </div>
          </GlassCard>
        </div>
        <div style={{ flex: 1 }}>
          <GlassCard style={{ borderTop: '3px solid #1565c0', textAlign: 'center' }}>
            <TypologyBadge typology="Access-Constrained" />
            <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#546e7a' }}>
              39.1% of communities
            </div>
            <div style={{ fontSize: '0.78rem', marginTop: '0.3rem' }}>
              {typologyGuidance['Access-Constrained'].primary}
            </div>
          </GlassCard>
        </div>
      </div>

      <GlassCard>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Coverage by Scenario and Typology
        </h3>
        {abmData && (
          <CoverageHeatmap matrix={abmData.matrix} onCellClick={setSelectedCell} />
        )}
      </GlassCard>

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
  const { data: abmData, loading, error: dataError } = useData('abm_scenarios.json');
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

  if (dataError) return <div className="glass-card" style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;
  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {workerError && (
        <div className="glass-card" style={{ padding: '1rem', color: '#b33000', textAlign: 'center', marginBottom: '1rem' }}>
          Counterfactual engine error: {workerError}
        </div>
      )}
      <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
        {/* Controls */}
        <div style={{ flex: '1 1 350px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem' }}>Adjust Intervention Parameters</h3>

            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Community Type</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Reference', 'Access-Constrained'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setTypology(t)}
                    style={{
                      ...tabBtnStyle,
                      background: typology === t ? (t === 'Reference' ? '#2e7d32' : '#1565c0') : '#f5f5f5',
                      color: typology === t ? '#fff' : '#546e7a',
                    }}
                  >
                    {t}
                  </button>
                ))}
              </div>
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
          </GlassCard>
        </div>

        {/* Results */}
        <div style={{ flex: '1 1 400px' }}>
          <GlassCard>
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
          </GlassCard>
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
function ActionPanel() {
  const { data: stateData, loading: l1, error: e1 } = useData('state_prevalence.json');
  const { data: cnaData, loading: l2, error: e2 } = useData('cna_solutions.json');

  const anyError = e1 || e2;
  if (l1 || l2) return <LoadingSpinner />;
  if (anyError) return <div className="glass-card" style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;

  const priorityStates = stateData?.features
    ?.map((f) => f.properties)
    .filter((p) => p.weighted_prevalence > 30)
    .sort((a, b) => b.weighted_prevalence - a.weighted_prevalence)
    .slice(0, 10) || [];

  return (
    <div>
      {/* Priority states table */}
      <GlassCard>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Priority States</h3>
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
      </GlassCard>

      {/* CNA necessity */}
      {cnaData && (
        <GlassCard style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Necessity Analysis</h3>
          <NecessityBar data={cnaData.necessity} threshold={0.75} />
        </GlassCard>
      )}

      {/* Recipe cards */}
      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Causal Recipes</h3>
        {Object.entries(recipePlainLanguage).map(([key, recipe]) => (
          <RecipeCard
            key={key}
            formula={recipe.formula}
            translation={recipe.translation}
            consistency={recipe.consistency}
            coverage={recipe.coverage}
          />
        ))}
      </div>

      {/* Policy briefs */}
      <div style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Policy Briefs</h3>
        <PolicyBriefCard typology="Reference" content={policyBriefContent.Reference} />
        <PolicyBriefCard typology="Access-Constrained" content={policyBriefContent['Access-Constrained']} />
      </div>
    </div>
  );
}

const labelStyle = { fontSize: '0.82rem', fontWeight: 600, color: '#546e7a' };
const tabBtnStyle = { padding: '0.35rem 1rem', borderRadius: '50px', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' };
