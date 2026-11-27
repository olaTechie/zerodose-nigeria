import { SCENARIO_LABELS, SCENARIO_COLOURS, SCENARIO_COMPONENTS } from '../../data/constants';
import CoverageTierBadge from './CoverageTierBadge';
import TypologyBadge from './TypologyBadge';

const pct = (v) => `${(v * 100).toFixed(1)}%`;

export default function ScenarioCard({ cell }) {
  if (!cell) return null;
  const scenario = cell.scenario_id;
  const label = SCENARIO_LABELS[scenario] || scenario;
  const color = SCENARIO_COLOURS[scenario] || '#888';
  const components = SCENARIO_COMPONENTS[scenario] || {};

  return (
    <div className="scenario-card glass-card" style={{ borderTop: `3px solid ${color}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: color, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {scenario}
          </div>
          <div style={{ fontSize: '1rem', fontWeight: 700 }}>{label}</div>
        </div>
        <TypologyBadge typology={cell.typology} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        {components.outreach === 1 && <ComponentPill label="Outreach" />}
        {components.comm_engage === 1 && <ComponentPill label="Engagement" />}
        {components.supply_reinf === 1 && <ComponentPill label="Supply" />}
        {Object.values(components).every((v) => v === 0) && (
          <ComponentPill label="No intervention" muted />
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: '0.4rem 0.75rem', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: '#546e7a', fontWeight: 600 }}>Month 36</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <CoverageTierBadge value={cell.coverage_month36_median} />
          <span style={{ fontSize: '0.72rem', color: '#78909c' }}>
            95% simulation interval {pct(cell.coverage_month36_p025)} to {pct(cell.coverage_month36_p975)}
          </span>
        </span>
        <span style={{ fontSize: '0.75rem', color: '#546e7a', fontWeight: 600 }}>Month 60</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          <CoverageTierBadge value={cell.coverage_month60_median} />
          <span style={{ fontSize: '0.72rem', color: '#78909c' }}>
            95% simulation interval {pct(cell.coverage_month60_p025)} to {pct(cell.coverage_month60_p975)}
          </span>
        </span>
      </div>

      <div style={{ marginTop: '0.6rem', fontSize: '0.75rem', fontWeight: 600, color: cell.reaches_80_by_month60 ? '#006633' : '#b33000' }}>
        {cell.reaches_80_by_month60 ? 'Reaches 80% by month 60' : 'Does not reach 80% by month 60'}
      </div>
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
