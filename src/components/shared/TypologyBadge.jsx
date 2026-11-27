import { TYPOLOGY_COLOURS } from '../../data/constants';

export default function TypologyBadge({ typology }) {
  const isAccess = typology === 'Access-Constrained';
  const color = TYPOLOGY_COLOURS[typology] || '#666';
  const bg = isAccess ? '#e3f2fd' : '#e8f5e9';
  return (
    <span
      className={`typology-badge typology-badge-${isAccess ? 'access' : 'reference'}`}
      style={{
        background: bg,
        color: color,
        padding: '0.2rem 0.7rem',
        borderRadius: '50px',
        fontSize: '0.78rem',
        fontWeight: 600,
        border: `1px solid ${color}30`,
      }}
    >
      {typology}
    </span>
  );
}
