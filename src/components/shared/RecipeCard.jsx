// Recipe block — formula in a 1 px hairline rectangle (no tinted background),
// translation in body sans, metrics in tabular numerals. No glass card.
export default function RecipeCard({ formula, translation, consistency, coverage, complexity }) {
  return (
    <article style={{ borderTop: '1px solid #c7cfc7', paddingTop: '1rem', paddingBottom: '1rem', marginBottom: '0.5rem' }}>
      <div
        style={{
          fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
          fontSize: '0.875rem',
          color: '#003d1e',
          padding: '0.5rem 0.75rem',
          border: '1px solid #c7cfc7',
          borderRadius: '6px',
          marginBottom: '0.75rem',
          fontWeight: 500,
          background: 'transparent',
        }}
      >
        {formula}
      </div>
      <p style={{ fontSize: '0.9375rem', color: '#1c211d', lineHeight: 1.6, margin: '0 0 0.75rem 0' }}>
        {translation}
      </p>
      <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8125rem', color: '#697269', fontVariantNumeric: 'tabular-nums', flexWrap: 'wrap' }}>
        <span>
          <strong>Consistency:</strong> {consistency?.toFixed(2) ?? '--'}
        </span>
        <span>
          <strong>Coverage:</strong> {coverage?.toFixed(2) ?? '--'}
        </span>
        {complexity != null && (
          <span>
            <strong>Complexity:</strong> {complexity}
          </span>
        )}
      </div>
    </article>
  );
}
