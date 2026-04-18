import { TYPOLOGY_COLOURS } from '../../data/constants';

// TypologyTag — small-caps eyebrow with a 6 px solid square dot.
// rounded-sm (6 px), no pill. Hairline outline replaces the rgba pill background.
export default function TypologyBadge({ typology }) {
  const color = TYPOLOGY_COLOURS[typology] || '#697269';
  return (
    <span
      style={{
        color,
        padding: '0.2rem 0.55rem',
        borderRadius: '6px',
        fontSize: '0.75rem',
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        border: `1px solid ${color}`,
        background: 'transparent',
        lineHeight: 1.2,
      }}
    >
      <span
        aria-hidden="true"
        style={{ width: '6px', height: '6px', background: color, display: 'inline-block', flexShrink: 0 }}
      />
      {typology}
    </span>
  );
}
