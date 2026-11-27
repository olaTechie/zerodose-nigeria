export default function RecipeCard({ formula, translation, consistency, coverage, complexity }) {
  return (
    <div className="recipe-card glass-card" style={{ borderLeft: '3px solid #006633' }}>
      <div
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: '0.85rem',
          color: '#006633',
          background: '#f0f4f0',
          padding: '0.5rem 0.75rem',
          borderRadius: '6px',
          marginBottom: '0.75rem',
          fontWeight: 600,
        }}
      >
        {formula}
      </div>
      <p style={{ fontSize: '0.88rem', color: '#0d1b2a', lineHeight: 1.55, margin: '0 0 0.75rem 0' }}>
        {translation}
      </p>
      <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: '#546e7a' }}>
        <span>
          <strong>Con:</strong> {consistency?.toFixed(2) ?? '--'}
        </span>
        <span>
          <strong>Cov:</strong> {coverage?.toFixed(2) ?? '--'}
        </span>
        {complexity != null && (
          <span>
            <strong>Complexity:</strong> {complexity}
          </span>
        )}
      </div>
    </div>
  );
}
