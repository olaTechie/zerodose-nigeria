import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import RecipeCard from '../../components/shared/RecipeCard';
import NecessityBar from '../../components/charts/NecessityBar';
import RobustnessHeatmap from '../../components/charts/RobustnessHeatmap';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions, configurationSummaries } from '../../data/storyContent';
import { PIPELINE_METRICS, SCENARIO_LABELS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

const TYPOLOGIES = ['Reference', 'Access-Constrained'];

export default function CNATab() {
  const { data: cnaData, loading: l1, error: e1, retry: r1 } = useData('cna_solutions.json');
  const { data: abmData, loading: l2, error: e2, retry: r2 } = useData('abm_scenarios.json');

  if (e1 || e2) return <ErrorState onRetry={() => { r1(); r2(); }} />;
  if (l1 || l2) return <LoadingSpinner />;

  const solutions = cnaData?.solutions || [];
  const necessity = cnaData?.necessity || [];
  const robustness = cnaData?.robustness || [];
  const matrix = abmData?.matrix || [];
  const outreachNec = necessity.find((n) => n.condition === 'outreach')?.necessity_consistency;

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.configurations}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricCard label="Cells reaching 80%" value={`${PIPELINE_METRICS.n_positive_outcomes}/${PIPELINE_METRICS.n_total_scenarios}`} sublabel="by month 60" color="green" />
        <MetricCard label="Outreach necessity" value={outreachNec != null ? outreachNec.toFixed(2) : '--'} sublabel="necessity consistency" color="green" />
        <MetricCard label="Bootstrap resamples" value="200" sublabel="robustness" color="gold" />
      </div>

      {/* Which simulated packages reached the target, by community type */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        {TYPOLOGIES.map((typ) => (
          <div key={typ} style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <GlassCard>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{typ}: Simulated Packages</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Package</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Month 36</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>Month 60</th>
                    <th style={{ ...thStyle, textAlign: 'center' }}>80% by month 60</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.filter((r) => r.typology === typ).map((r) => (
                    <tr key={r.scenario_id} style={{ background: r.reaches_80_by_month60 ? '#e8f5e9' : 'transparent' }}>
                      <td style={tdStyle}>
                        <span style={{ color: '#546e7a', fontSize: '0.7rem' }}>{r.scenario_id}</span> {SCENARIO_LABELS[r.scenario_id]}
                      </td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{(r.coverage_month36_median * 100).toFixed(1)}%</td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{(r.coverage_month60_median * 100).toFixed(1)}%</td>
                      <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, color: r.reaches_80_by_month60 ? '#006633' : '#9e9e9e' }}>
                        {r.reaches_80_by_month60 ? 'Yes' : 'No'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </GlassCard>
          </div>
        ))}
      </div>
      <p style={{ fontSize: '0.75rem', color: '#78909c', margin: '0.5rem 0 1rem' }}>
        Outreach with supply reinforcement but without engagement was not simulated, so whether engagement or supply
        reinforcement is required in Access-Constrained communities cannot be determined.
      </p>

      {/* Necessity */}
      <GlassCard>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Necessity Analysis</h3>
        <NecessityBar data={necessity} threshold={0.75} />
      </GlassCard>

      {/* Primary solutions */}
      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Coincidence Analysis Solutions</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={thStyle}>Condition</th>
                <th style={thStyle}>Consistency</th>
                <th style={thStyle}>Coverage</th>
                <th style={thStyle}>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {solutions.map((s, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontFamily: "'Courier New', monospace", fontSize: '0.78rem' }}>
                    {s.condition}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, color: s.consistency >= 0.9 ? '#006633' : '#cc8400' }}>
                    {s.consistency.toFixed(3)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{s.coverage.toFixed(3)}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{s.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Robustness */}
      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Robustness Across Coverage Thresholds</h3>
        <RobustnessHeatmap data={robustness} />
      </GlassCard>

      {/* Plain-language summary */}
      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Plain-Language Summary of the Configurations</h3>
        <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.75rem' }}>
          The configurations describe which simulated packages reached the target and inherit the simulation&rsquo;s assumptions; they are not empirical causal effects.
        </p>
        {Object.entries(configurationSummaries).map(([key, c]) => (
          <RecipeCard
            key={key}
            formula={c.formula}
            translation={c.translation}
            consistency={c.consistency}
            coverage={c.coverage}
          />
        ))}
      </GlassCard>
    </div>
  );
}
