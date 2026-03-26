import { getCoverageTier } from '../../utils/coverageTier';

export default function CoverageTierBadge({ value }) {
  const tier = getCoverageTier(value);
  return (
    <span
      className="coverage-tier-badge"
      style={{
        background: tier.bg,
        color: tier.color,
        padding: '0.2rem 0.65rem',
        borderRadius: '50px',
        fontSize: '0.78rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.3rem',
      }}
    >
      <span>{tier.icon}</span>
      <span>{tier.label}</span>
      <span style={{ fontWeight: 700 }}>{(value * 100).toFixed(1)}%</span>
    </span>
  );
}
