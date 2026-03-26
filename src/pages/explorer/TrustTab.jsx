import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import RadarChart from '../../components/charts/RadarChart';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { TRUST_STATE_LABELS, PIPELINE_METRICS } from '../../data/constants';

export default function TrustTab() {
  const { data: lcaData, loading } = useData('lca_profiles.json');

  if (loading) return <p style={{ color: '#78909c' }}>Loading trust state data...</p>;

  const trustStates = lcaData?.trustStates || [];
  const origProfiles = lcaData?.originalProfiles || [];

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.trust}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricCard label="LCA Classes" value={PIPELINE_METRICS.lca_n_classes.toString()} sublabel="BIC-optimal" color="green" />
        <MetricCard label="Willing" value={`${(TRUST_STATE_LABELS.Willing.proportion * 100).toFixed(1)}%`} color="green" />
        <MetricCard label="Hesitant" value={`${(TRUST_STATE_LABELS.Hesitant.proportion * 100).toFixed(1)}%`} color="gold" />
        <MetricCard label="Refusing" value={`${(TRUST_STATE_LABELS.Refusing.proportion * 100).toFixed(1)}%`} color="red" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 45%', minWidth: '280px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Trust State Radar</h3>
            <RadarChart classes={trustStates} size={280} />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem' }}>
              {trustStates.map((ts) => (
                <span key={ts.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                  <span style={{ width: 12, height: 12, borderRadius: '50%', background: TRUST_STATE_LABELS[ts.label]?.color || '#888', display: 'inline-block' }} />
                  {ts.label} ({(ts.proportion * 100).toFixed(1)}%)
                </span>
              ))}
            </div>
          </GlassCard>
        </div>

        <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Trust State Profiles</h3>
            {trustStates.map((ts) => {
              const meta = TRUST_STATE_LABELS[ts.label] || {};
              return (
                <div
                  key={ts.label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    marginBottom: '0.75rem',
                    padding: '0.75rem',
                    background: meta.bg || '#f5f5f5',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${meta.color || '#888'}`,
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, color: meta.color || '#333', fontSize: '0.95rem' }}>
                      {ts.label}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#546e7a' }}>
                      Mean trust: {ts.meanTrust.toFixed(3)} (SD: {ts.sd.toFixed(3)})
                    </div>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '1.3rem', fontWeight: 800, color: meta.color || '#333' }}>
                      {(ts.proportion * 100).toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#78909c' }}>Proportion</div>
                  </div>
                  {/* Bar */}
                  <div style={{ width: '100px', height: '8px', background: '#e0e0e0', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${ts.proportion * 100}%`, height: '100%', background: meta.color || '#888', borderRadius: '4px' }} />
                  </div>
                </div>
              );
            })}
          </GlassCard>

          <GlassCard style={{ marginTop: '0.75rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Original 4-Class Profiles</h3>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Class</th>
                    <th style={thStyle}>Mean Trust</th>
                    <th style={thStyle}>SD</th>
                    <th style={thStyle}>Proportion</th>
                  </tr>
                </thead>
                <tbody>
                  {origProfiles.map((p) => (
                    <tr key={p.class}>
                      <td style={tdStyle}>{p.class}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{p.meanTrust.toFixed(4)}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{p.sd.toFixed(4)}</td>
                      <td style={{ ...tdStyle, textAlign: 'center' }}>{(p.proportion * 100).toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

const thStyle = { padding: '0.5rem', borderBottom: '2px solid #e0e0e0', fontWeight: 700, fontSize: '0.72rem', textTransform: 'uppercase', color: '#546e7a', textAlign: 'center' };
const tdStyle = { padding: '0.45rem 0.5rem', borderBottom: '1px solid #f0f0f0' };
