import { SCENARIO_LABELS, SCENARIO_COMPONENTS } from '../../data/constants';
import CoverageTierBadge from './CoverageTierBadge';
import TypologyBadge from './TypologyBadge';

// Scenario block — editorial article with hairline top rule.
// No card chrome, no glass blur, no border-top accent.
export default function ScenarioCard({ scenario, typology, coverage, p025, p975 }) {
  const label = SCENARIO_LABELS[scenario] || scenario;
  const components = SCENARIO_COMPONENTS[scenario] || {};
  const reachesTarget = coverage >= 0.80;

  return (
    <article style={{ borderTop: '1px solid #c7cfc7', paddingTop: '1rem', paddingBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              color: '#697269',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
            }}
          >
            {scenario}
          </div>
          <div className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 600, lineHeight: 1.3 }}>
            {label}
          </div>
        </div>
        <TypologyBadge typology={typology} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {components.outreach === 1 && <ComponentTag label="Outreach" />}
        {components.comm_engage === 1 && <ComponentTag label="Engagement" />}
        {components.supply_reinf === 1 && <ComponentTag label="Supply" />}
        {Object.values(components).every((v) => v === 0) && (
          <ComponentTag label="No intervention" muted />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
        <CoverageTierBadge value={coverage} />
        {p025 != null && p975 != null && (
          <span style={{ fontSize: '0.8125rem', color: '#697269', fontVariantNumeric: 'tabular-nums' }}>
            (95% CI {(p025 * 100).toFixed(1)} &ndash; {(p975 * 100).toFixed(1)})
          </span>
        )}
      </div>

      {reachesTarget && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.8125rem', color: '#003d1e', fontWeight: 600 }}>
          Reaches 80% target
        </div>
      )}
    </article>
  );
}

function ComponentTag({ label, muted = false }) {
  return (
    <span
      style={{
        color: muted ? '#9aa19a' : '#003d1e',
        padding: '0.15rem 0.5rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 500,
        border: `1px solid ${muted ? '#c7cfc7' : '#003d1e'}`,
        background: 'transparent',
        letterSpacing: '0.04em',
      }}
    >
      {label}
    </span>
  );
}
