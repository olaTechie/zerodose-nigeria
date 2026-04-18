import { useState } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import TrajectoryChart from '../../components/charts/TrajectoryChart';
import PosteriorDensity from '../../components/charts/PosteriorDensity';
import CoverageHeatmap from '../../components/charts/CoverageHeatmap';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { PIPELINE_METRICS, SCENARIO_LABELS } from '../../data/constants';
import { activeToggleBtn, inactiveToggleBtn } from '../../styles/buttonStyles';

export default function ABMTab() {
  const { data: abmData, loading: l1, error: e1 } = useData('abm_scenarios.json');
  const { data: posteriorData, loading: l2, error: e2 } = useData('calibration_posteriors.json');
  const [typology, setTypology] = useState('Reference');
  const [selectedScenarios, setSelectedScenarios] = useState(['S0', 'S1', 'S5']);

  if (e1 || e2) return <div style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;
  if (l1 || l2) return <LoadingSpinner />;

  const toggleScenario = (s) => {
    setSelectedScenarios((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.abm}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricCard label="Calibration RMSE" value={PIPELINE_METRICS.calibration_rmse.toFixed(3)} color="green" />
        <MetricCard label="Spearman r" value={PIPELINE_METRICS.validation_spearman_r.toFixed(3)} color="green" />
        <MetricCard label="Validation RMSE" value={PIPELINE_METRICS.validation_rmse.toFixed(3)} color="gold" />
        <MetricCard label="Households" value={PIPELINE_METRICS.n_households_simulated.toLocaleString()} color="blue" />
      </div>

      {/* Trajectory chart */}
      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Coverage Trajectories</h3>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['Reference', 'Access-Constrained'].map((t) => (
              <button
                key={t}
                onClick={() => setTypology(t)}
                style={typology === t ? activeToggleBtn : inactiveToggleBtn}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Scenario toggles */}
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {Object.entries(SCENARIO_LABELS).map(([id, label]) => {
            const active = selectedScenarios.includes(id);
            return (
              <button
                key={id}
                onClick={() => toggleScenario(id)}
                aria-pressed={active}
                style={{
                  padding: '0.25rem 0.65rem',
                  borderRadius: '6px',
                  border: `1px solid ${active ? '#003d1e' : '#c7cfc7'}`,
                  background: active ? '#003d1e' : 'transparent',
                  color: active ? '#ffffff' : '#697269',
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  letterSpacing: '0.02em',
                }}
              >
                {id}: {label}
              </button>
            );
          })}
        </div>

        {abmData && (
          <TrajectoryChart
            trajectories={abmData.trajectories}
            selectedScenarios={selectedScenarios}
            typology={typology}
            height={380}
          />
        )}
      </GlassCard>

      {/* Heatmap */}
      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Scenario x Typology Matrix</h3>
        {abmData && <CoverageHeatmap matrix={abmData.matrix} />}
      </GlassCard>

      {/* Posterior densities */}
      {posteriorData && (
        <GlassCard style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
            ABC Calibration Posteriors
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
            {posteriorData.parameters.map((param) => (
              <PosteriorDensity
                key={param}
                values={posteriorData.posteriors.map((p) => p[param])}
                paramName={param}
                color="#006633"
              />
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}
