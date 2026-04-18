// AudienceEntryBlock — transitional shim for the legacy NavCard import.
// Per design brief §6: editorial row with eyebrow + serif h2 + body sans + arrow link.
// No icon, no card chrome, no shadow. /distill will rename to AudienceEntryBlock.
export default function NavCard({ icon, title, description, accentColor = '#003d1e', onClick }) {
  // The `icon` prop is intentionally ignored — emoji/icons are removed per the cut list.
  void icon;
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
      <h3
        className="font-serif"
        style={{
          fontSize: '1.375rem',
          fontWeight: 600,
          marginBottom: '0.5rem',
          color: accentColor,
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      <p style={{ fontSize: '0.9375rem', color: '#697269', lineHeight: 1.6, margin: 0, maxWidth: '52ch' }}>
        {description}
      </p>
      <span
        style={{
          marginTop: '0.75rem',
          display: 'inline-block',
          fontSize: '0.875rem',
          color: accentColor,
          fontWeight: 500,
        }}
      >
        Continue {'\u2192'}
      </span>
    </button>
  );
}
