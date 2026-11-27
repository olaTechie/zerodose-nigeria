import { useState } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import ScenarioIntervalChart from '../../components/charts/ScenarioIntervalChart';
import PosteriorDensity from '../../components/charts/PosteriorDensity';
import CoverageHeatmap from '../../components/charts/CoverageHeatmap';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { PIPELINE_METRICS } from '../../data/constants';
import { activeToggleBtn, inactiveToggleBtn } from '../../styles/buttonStyles';
import { thStyle, tdStyle } from '../../styles/tableStyles';

const M = PIPELINE_METRICS;
const pts = (a, b) => `${(Math.abs(a - b) * 100).toFixed(1)} points`;

export default function SimulationTab() {
  const { data: abmData, loading: l1, error: e1, retry: r1 } = useData('abm_scenarios.json');
  const { data: posteriorData, loading: l2, error: e2, retry: r2 } = useData('calibration_posteriors.json');
  const [typology, setTypology] = useState('Reference');

  if (e1 || e2) return <ErrorState onRetry={() => { r1(); r2(); }} />;
  if (l1 || l2) return <LoadingSpinner />;

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.simulation}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '0.75rem', marginBottom: '0.5rem' }}>
        <MetricCard label="2018 national error" value={pts(M.calib_2018_simulated, M.calib_2018_observed)} sublabel="61.1% simulated, 65.0% observed" color="green" />
        <MetricCard label="2024 national error" value={pts(M.calib_2024_simulated, M.calib_2024_observed)} sublabel="70.2% simulated, 63.2% observed" color="gold" />
        <MetricCard label="Zone rank correlation" value={M.calib_zone_rank_correlation.toFixed(3)} sublabel="both surveys, six zones" color="green" />
        <MetricCard label="Virtual children" value={M.n_virtual_children.toLocaleString('en-GB')} sublabel="30 per survey cluster" color="blue" />
      </div>
      <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 1.25rem' }}>
        NDHS 2018 and 2024 were both calibration targets, so these figures are calibration fit, not validation.
        Zone root mean squared error 4.3 points (2018) and 7.5 points (2024); the largest 2024 zone error was North-Central (16.0 points).
      </p>

      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Simulated Coverage at Months 36 and 60</h3>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {['Reference', 'Access-Constrained'].map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={typology === t}
                onClick={() => setTypology(t)}
                style={typology === t ? activeToggleBtn : inactiveToggleBtn}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        {abmData && <ScenarioIntervalChart matrix={abmData.matrix} typology={typology} />}
        <p style={{ fontSize: '0.75rem', color: '#78909c', margin: '0.5rem 0 0' }}>
          Medians and 95% simulation intervals across 500 replicates per cell. The simulation saved coverage at months 36 and 60 only.
        </p>
      </GlassCard>

      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Scenario x Community Type Matrix</h3>
        {abmData && <CoverageHeatmap matrix={abmData.matrix} />}
      </GlassCard>

      {posteriorData && (
        <GlassCard style={{ marginTop: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Calibrated Parameters</h3>
          <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.75rem' }}>{posteriorData.method}</p>
          <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Parameter</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>Posterior median</th>
                  <th style={{ ...thStyle, textAlign: 'center' }}>95% interval</th>
                </tr>
              </thead>
              <tbody>
                {posteriorData.parameters.map((p) => {
                  const s = posteriorData.summary[p];
                  return (
                    <tr key={p}>
                      <td style={{ ...tdStyle, fontFamily: "'Courier New', monospace", fontSize: '0.78rem' }}>{p}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{s.median.toFixed(3)}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{s.p025.toFixed(3)} to {s.p975.toFixed(3)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.75rem' }}>
            The six zone disruption parameters are similar, with wide, overlapping intervals, and do not identify a distinct effect of insecurity in any zone.
            Two further parameters were fixed, not calibrated (theta_p 0.4, lambda_r 0.025).
          </p>
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
