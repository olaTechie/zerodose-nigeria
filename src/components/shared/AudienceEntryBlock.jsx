// AudienceEntryBlock — full-width editorial row for an audience entry point.
// Per design brief §6: eyebrow + serif h2 link + body sans + arrow text link.
// No icon, no card chrome, no shadow. Replaces legacy NavCard.
export default function AudienceEntryBlock({
  eyebrow,
  title,
  description,
  cta = 'Continue',
  accentColor = '#003d1e',
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="block w-full text-left border-t border-neutral-200 py-8 hover:bg-neutral-50 transition-colors"
      style={{
        background: 'none',
        border: 'none',
        borderTop: '1px solid #c7cfc7',
        cursor: 'pointer',
        fontFamily: 'inherit',
        width: '100%',
      }}
    >
      {eyebrow && (
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#697269',
            marginBottom: '0.5rem',
          }}
        >
          {eyebrow}
        </div>
      )}
      <h3
        className="font-serif"
        style={{
          fontSize: '1.5rem',
          fontWeight: 600,
          margin: '0 0 0.5rem 0',
          color: accentColor,
          lineHeight: 1.25,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.9375rem',
          color: '#697269',
          lineHeight: 1.6,
          margin: 0,
          maxWidth: '64ch',
        }}
      >
        {description}
      </p>
      <span
        style={{
          marginTop: '0.85rem',
          display: 'inline-block',
          fontSize: '0.875rem',
          color: accentColor,
          fontWeight: 500,
        }}
      >
        {cta} {'\u2192'}
      </span>
    </button>
  );
}
