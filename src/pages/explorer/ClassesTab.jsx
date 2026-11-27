import GlassCard from '../../components/shared/GlassCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { ENGAGEMENT_CLASSES } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

const pct = (v) => `${(v * 100).toFixed(1)}%`;

export default function ClassesTab() {
  const { data: lca, loading, error, retry } = useData('lca_profiles.json');

  if (error) return <ErrorState onRetry={retry} />;
  if (loading) return <LoadingSpinner />;

  const classes = lca?.classes || [];
  const indicators = Object.entries(lca?.indicatorLabels || {});
  const style = (id) => ENGAGEMENT_CLASSES.find((c) => c.id === id) || {};

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.classes}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
        {classes.map((c) => {
          const s = style(c.id);
          return (
            <div
              key={c.id}
              className="glass-card"
              style={{ borderTop: `3px solid ${s.color}`, padding: '1rem' }}
            >
              <div style={{ fontSize: '0.72rem', fontWeight: 700, color: s.color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {c.name}
              </div>
              <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0d1b2a', margin: '0.2rem 0 0.6rem', minHeight: '2.5em' }}>
                {c.label}
              </div>
              <div style={{ display: 'flex', gap: '1.25rem' }}>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0d1b2a' }}>{pct(c.share)}</div>
                  <div style={{ fontSize: '0.68rem', color: '#78909c', textTransform: 'uppercase' }}>of children</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 800, color: s.color }}>{pct(c.zeroDoseUnweighted)}</div>
                  <div style={{ fontSize: '0.68rem', color: '#78909c', textTransform: 'uppercase' }}>zero-dose</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <GlassCard>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.25rem' }}>Item-Response Probabilities</h3>
        <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.75rem' }}>
          Probability of each indicator in each class (refit of the four-class model, as reported in the manuscript).
          Ten indicators were specified; &ldquo;no permission barrier&rdquo; was constant and dropped, leaving nine.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={thStyle}>Indicator</th>
                {classes.map((c) => (
                  <th key={c.id} style={{ ...thStyle, textAlign: 'center' }}>{c.name}<br /><span style={{ textTransform: 'none', fontWeight: 500 }}>{c.shortLabel}</span></th>
                ))}
              </tr>
            </thead>
            <tbody>
              {indicators.map(([key, label]) => (
                <tr key={key}>
                  <td style={tdStyle}>{label}</td>
                  {classes.map((c) => {
                    const v = c.itemResponse[key];
                    return (
                      <td
                        key={c.id}
                        style={{
                          ...tdStyle,
                          textAlign: 'center',
                          fontVariantNumeric: 'tabular-nums',
                          background: `rgba(0, 102, 51, ${0.08 + 0.5 * (v ?? 0)})`,
                          color: v > 0.55 ? '#fff' : '#0d1b2a',
                        }}
                      >
                        {v == null ? '--' : v.toFixed(2)}
                      </td>
                    );
                  })}
                </tr>
              ))}
              <tr>
                <td style={{ ...tdStyle, fontWeight: 700 }}>Zero-dose prevalence (unweighted)</td>
                {classes.map((c) => (
                  <td key={c.id} style={{ ...tdStyle, textAlign: 'center', fontWeight: 700 }}>{pct(c.zeroDoseUnweighted)}</td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Reading the Classes</h3>
        <ul style={{ fontSize: '0.86rem', color: '#0d1b2a', lineHeight: 1.6, paddingLeft: '1.2rem', margin: 0 }}>
          <li>Most zero-dose children are in Class 1, the class lowest on every routine-service indicator. It contains no measure of refusal, so the classes point to bringing services to households with little contact rather than to persuading caregivers who reject vaccination.</li>
          <li>Classes 2 and 4 differ mainly on the COVID-19 items. Willingness was asked only of unvaccinated mothers, so none of the 1,136 vaccinated mothers is recorded as willing and the two items cannot co-occur. This skip pattern violates local independence.</li>
          <li>The indicators are behavioural, so the classes describe engagement with services, not attitudes.</li>
          <li>Each child&rsquo;s most likely class supplied the simulation&rsquo;s engagement score (the trust score in the simulation code). That score does not rank the classes by zero-dose risk.</li>
          <li>The structure was robust: a refit reached a better optimum (BIC 52,080.9) with 91.9% agreement, and a card-free refit again selected four classes (93.1% agreement).</li>
        </ul>
      </GlassCard>
    </div>
  );
}
