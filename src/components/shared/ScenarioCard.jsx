import { SCENARIO_LABELS, SCENARIO_COLOURS, SCENARIO_COMPONENTS } from '../../data/constants';
import CoverageTierBadge from './CoverageTierBadge';
import TypologyBadge from './TypologyBadge';

export default function ScenarioCard({ scenario, typology, coverage, p025, p975 }) {
  const label = SCENARIO_LABELS[scenario] || scenario;
  const color = SCENARIO_COLOURS[scenario] || '#888';
  const components = SCENARIO_COMPONENTS[scenario] || {};
  const reachesTarget = coverage >= 0.80;

  return (
    <div className="scenario-card glass-card" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {scenario}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{label}</div>
        </div>
        <TypologyBadge typology={typology} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {components.outreach === 1 && <ComponentPill label="Outreach" />}
        {components.comm_engage === 1 && <ComponentPill label="Engagement" />}
        {components.supply_reinf === 1 && <ComponentPill label="Supply" />}
        {Object.values(components).every((v) => v === 0) && (
          <ComponentPill label="No intervention" muted />
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <CoverageTierBadge value={coverage} />
        {p025 != null && p975 != null && (
          <span style={{ fontSize: '0.72rem', color: '#78909c' }}>
            95% CI: [{(p025 * 100).toFixed(1)}, {(p975 * 100).toFixed(1)}]
          </span>
        )}
      </div>

      {reachesTarget && (
        <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#006633', fontWeight: 600 }}>
          Reaches 80% target
        </div>
      )}
    </div>
  );
}

function ComponentPill({ label, muted = false }) {
  return (
    <span
      style={{
        background: muted ? '#f5f5f5' : '#e8f5e9',
        color: muted ? '#999' : '#006633',
        padding: '0.15rem 0.55rem',
        borderRadius: '50px',
        fontSize: '0.7rem',
        fontWeight: 500,
      }}
    >
      {label}
    </span>
  );
}
