// KeyFigure — transitional shim for the legacy MetricCard import.
// Per design brief §6: a typographic <dl> entry — eyebrow label above a Sectra display number.
// No box, no border-top accent, no box-shadow. /distill will lift these into a KeyFiguresList.
const COLOUR_MAP = {
  green: '#003d1e',
  gold: '#cc8400',
  red: '#b33000',
  blue: '#1565c0',
};

export default function MetricCard({ label, value, sublabel, color = 'green' }) {
  // The `color` prop is preserved as a semantic hint for the value tone but the
  // border-top accent is removed.
  const valueColour = COLOUR_MAP[color] || '#1c211d';
  return (
    <div style={{ paddingBlock: '0.5rem' }}>
      <dt
        style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#697269',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </dt>
      <dd
        className="font-serif"
        style={{
          fontSize: '1.875rem',
          lineHeight: 1.1,
          fontWeight: 500,
          color: valueColour,
          margin: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </dd>
      {sublabel && (
        <div style={{ fontSize: '0.8125rem', color: '#697269', marginTop: '0.25rem', lineHeight: 1.4 }}>
          {sublabel}
        </div>
      )}
    </div>
  );
}
