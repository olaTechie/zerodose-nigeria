// PageHeader — calm editorial header. No animation, no thick coloured rule.
// 1 px neutral hairline below; serif title in primary green; sans subtitle in neutral-600.
export default function PageHeader({ title, subtitle }) {
  return (
    <header
      style={{
        marginBottom: '1.5rem',
        paddingBottom: '0.75rem',
        borderBottom: '1px solid #c7cfc7',
      }}
    >
      <h1
        className="font-serif"
        style={{
          fontSize: '1.875rem',
          fontWeight: 600,
          color: '#003d1e',
          margin: '0 0 0.35rem 0',
          lineHeight: 1.15,
        }}
      >
        {title}
      </h1>
      {subtitle && (
        <p style={{ fontSize: '0.9375rem', color: '#697269', maxWidth: '70ch', lineHeight: 1.55, margin: 0 }}>
          {subtitle}
        </p>
      )}
    </header>
  );
}
