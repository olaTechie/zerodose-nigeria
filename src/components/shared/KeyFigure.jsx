import SourceMark from './SourceMark';

// KeyFigure — typographic <dl> entry: eyebrow label above a serif display number.
// Per design brief Section 6: no box, no border accent, no shadow.
//
// `source` accepts either:
//   - a string (legacy: rendered into data-source attribute only — no marker)
//   - an object { id: 'sourceMarkId' } — renders a <SourceMark id="..." /> after the value
//   - a plain id is supported via `sourceId` for clarity in new call-sites
const COLOUR_MAP = {
  green: '#003d1e',
  gold: '#cc8400',
  red: '#b33000',
  blue: '#1565c0',
  neutral: '#1c211d',
};

export default function KeyFigure({
  label,
  value,
  sublabel,
  color = 'green',
  source,
  sourceId,
  size = 'md',
}) {
  const valueColour = COLOUR_MAP[color] || COLOUR_MAP.neutral;
  const sizes = {
    sm: '1.5rem',
    md: '1.875rem',
    lg: '2.25rem',
    xl: '3rem',
  };
  const valueSize = sizes[size] || sizes.md;

  // Resolve source id from either explicit prop or `source.id`
  const resolvedSourceId = sourceId || (source && typeof source === 'object' && source.id);
  const dataSourceAttr =
    typeof source === 'string'
      ? source
      : (source && source.file) || undefined;

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
          fontSize: valueSize,
          lineHeight: 1.1,
          fontWeight: 500,
          color: valueColour,
          margin: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
        data-source={dataSourceAttr}
      >
        {value}
        {resolvedSourceId && <SourceMark id={resolvedSourceId} />}
      </dd>
      {sublabel && (
        <div
          style={{
            fontSize: '0.8125rem',
            color: '#697269',
            marginTop: '0.25rem',
            lineHeight: 1.4,
          }}
        >
          {sublabel}
        </div>
      )}
    </div>
  );
}
