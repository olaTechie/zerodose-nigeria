import GlassCard from '../../components/shared/GlassCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { thStyle, tdStyle } from '../../styles/tableStyles';

const num = { ...tdStyle, textAlign: 'right', fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap' };
const f3 = (v) => (v == null ? '--' : v.toFixed(3));

function SensitivityBar({ value, low, high }) {
  const W = 160;
  const x = (v) => Math.max(0, Math.min(1, v)) * W;
  return (
    <svg width={W} height={14} role="img" aria-label={`Sensitivity ${f3(value)}, 95% CI ${f3(low)} to ${f3(high)}`}>
      <rect x={0} y={6} width={W} height={2} fill="#e6e9e6" />
      <line x1={x(low)} x2={x(high)} y1={7} y2={7} stroke="#78909c" strokeWidth={2} />
      <circle cx={x(value)} cy={7} r={4} fill="#006633" />
    </svg>
  );
}

export default function FairnessTab() {
  const { data, loading, error, retry } = useData('fairness.json');

  if (error) return <ErrorState onRetry={retry} />;
  if (loading) return <LoadingSpinner />;

  const gaps = data?.gaps || [];
  const subgroups = data?.subgroups || [];
  const axes = [...new Set(subgroups.map((s) => s.axis))];

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.fairness}
      </p>

      <GlassCard>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Equal-Opportunity Gaps</h3>
        <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.75rem' }}>{data?.note}</p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={thStyle}>Axis</th>
                <th style={thStyle}>Highest sensitivity</th>
                <th style={thStyle}>Lowest sensitivity</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Gap (95% CI)</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map((g) => (
                <tr key={g.axis}>
                  <td style={{ ...tdStyle, fontWeight: 600 }}>{g.axis}</td>
                  <td style={tdStyle}>{g.max_group}</td>
                  <td style={tdStyle}>{g.min_group}</td>
                  <td style={num}>{f3(g.gap)} ({f3(g.ci_low)} to {f3(g.ci_high)})</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: '0.82rem', color: '#0d1b2a', lineHeight: 1.6, margin: '0.75rem 0 0' }}>
          Discrimination was good within every subgroup (AUC 0.85 to 0.97), but sensitivity at a single 0.5 threshold was not:
          the threshold misses zero-dose children in better-off, urban, southern and more educated households, so equitable
          targeting would need group-specific thresholds.
        </p>
      </GlassCard>

      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Sensitivity by Subgroup</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr>
                <th style={thStyle}>Group</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>n</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Zero-dose</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Sensitivity (95% CI)</th>
                <th style={thStyle}></th>
                <th style={{ ...thStyle, textAlign: 'right' }}>AUC</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Observed / mean predicted</th>
              </tr>
            </thead>
            <tbody>
              {axes.map((axis) => (
                [
                  <tr key={`${axis}-h`}>
                    <td colSpan={7} style={{ ...tdStyle, fontWeight: 700, background: '#f3f6f3', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.4px', color: '#546e7a' }}>{axis}</td>
                  </tr>,
                  ...subgroups.filter((s) => s.axis === axis).map((s) => (
                    <tr key={`${axis}-${s.group}`}>
                      <td style={tdStyle}>{s.group}</td>
                      <td style={num}>{s.n}</td>
                      <td style={num}>{s.events}</td>
                      <td style={num}>{f3(s.tpr)} ({f3(s.tpr_low)} to {f3(s.tpr_high)})</td>
                      <td style={tdStyle}><SensitivityBar value={s.tpr} low={s.tpr_low} high={s.tpr_high} /></td>
                      <td style={num}>{f3(s.auc)}</td>
                      <td style={num}>{f3(s.observed)} / {f3(s.mean_predicted)}</td>
                    </tr>
                  )),
                ]
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}
