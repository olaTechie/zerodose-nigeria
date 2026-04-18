import { getCoverageTier } from '../../utils/coverageTier';

// CoverageTierTag — typographic tag, not a pill. Solid background, dark text,
// rounded-sm (6 px) per design brief §6. Icon dropped (small square dot retained).
export default function CoverageTierBadge({ value }) {
  const tier = getCoverageTier(value);
  return (
    <span
      style={{
        background: tier.bg,
        color: tier.color,
        padding: '0.2rem 0.55rem',
        borderRadius: '6px',
        fontSize: '0.8125rem',
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        lineHeight: 1.2,
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: '6px',
          height: '6px',
          background: tier.color,
          display: 'inline-block',
          flexShrink: 0,
        }}
      />
      <span>{tier.label}</span>
      <span style={{ fontWeight: 700 }}>{(value * 100).toFixed(1)}%</span>
    </span>
  );
}
