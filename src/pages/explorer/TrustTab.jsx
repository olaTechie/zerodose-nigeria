import EditorialBlock from '../../components/shared/EditorialBlock';
import KeyFigure from '../../components/shared/KeyFigure';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import RadarChart from '../../components/charts/RadarChart';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { TRUST_STATE_LABELS, PIPELINE_METRICS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

export default function TrustTab() {
  const { data: lcaData, loading, error } = useData('lca_profiles.json');

  if (error)
    return (
      <div style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>
        Failed to load data. Please refresh the page.
      </div>
    );
  if (loading) return <LoadingSpinner />;

  const trustStates = lcaData?.trustStates || [];
  const origProfiles = lcaData?.originalProfiles || [];

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.trust}
      </p>

      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '0.75rem',
          marginBottom: '1.5rem',
        }}
      >
        <KeyFigure label="LCA Classes" value={PIPELINE_METRICS.lca_n_classes.toString()} sublabel="BIC-optimal" color="green" size="sm" />
        <KeyFigure label="Willing" value={`${(TRUST_STATE_LABELS.Willing.proportion * 100).toFixed(1)}%`} color="green" size="sm" />
        <KeyFigure label="Hesitant" value={`${(TRUST_STATE_LABELS.Hesitant.proportion * 100).toFixed(1)}%`} color="gold" size="sm" />
        <KeyFigure label="Refusing" value={`${(TRUST_STATE_LABELS.Refusing.proportion * 100).toFixed(1)}%`} color="red" size="sm" />
      </dl>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 45%', minWidth: '280px' }}>
          <EditorialBlock>
            <h3 className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1c211d' }}>
              Trust state radar
            </h3>
            <RadarChart classes={trustStates} size={280} />
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '0.5rem', flexWrap: 'wrap' }}>
              {trustStates.map((ts) => (
                <span key={ts.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem' }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      background: TRUST_STATE_LABELS[ts.label]?.color || '#888',
                      display: 'inline-block',
                    }}
                  />
                  {ts.label} ({(ts.proportion * 100).toFixed(1)}%)
                </span>
              ))}
            </div>
          </EditorialBlock>
        </div>

        <div style={{ flex: '1 1 50%', minWidth: '300px' }}>
          <EditorialBlock>
            <h3
              className="font-serif"
              style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.75rem', color: '#1c211d' }}
            >
              Trust state profiles
            </h3>
            {trustStates.map((ts, idx) => {
              const meta = TRUST_STATE_LABELS[ts.label] || {};
              return (
                <div
                  key={ts.label}
                  style={{
                    paddingBlock: '1rem',
                    borderTop: idx === 0 ? 'none' : '1px solid #c7cfc7',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: '1rem',
                      marginBottom: '0.4rem',
                      flexWrap: 'wrap',
                    }}
                  >
                    <h4
                      className="font-serif"
                      style={{
                        fontSize: '1.0625rem',
                        fontWeight: 600,
                        color: '#1c211d',
                        margin: 0,
                        lineHeight: 1.25,
                      }}
                    >
                      {ts.label}
                      <span
                        style={{
                          marginLeft: '0.65rem',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                          color: meta.color || '#697269',
                          fontFamily: 'inherit',
                        }}
                      >
                        Trust state
                      </span>
                    </h4>
                    <span
                      style={{
                        fontFamily: '"Source Serif 4", Georgia, serif',
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: meta.color || '#1c211d',
                        fontVariantNumeric: 'tabular-nums',
                        lineHeight: 1.05,
                      }}
                    >
                      {(ts.proportion * 100).toFixed(1)}%
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: '0.875rem',
                      lineHeight: 1.55,
                      color: '#546e7a',
                      margin: 0,
                    }}
                  >
                    Mean trust score {ts.meanTrust.toFixed(3)} (SD {ts.sd.toFixed(3)}). This class
                    accounts for {(ts.proportion * 100).toFixed(1)}% of the analytic sample.
                  </p>
                </div>
              );
            })}
          </EditorialBlock>

          <EditorialBlock>
            <h3
              className="font-serif"
              style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#1c211d' }}
            >
              Original 4-class profiles
            </h3>
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
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        {(p.proportion * 100).toFixed(1)}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </EditorialBlock>
        </div>
      </div>
    </div>
  );
}
