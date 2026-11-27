// ErrorState — single typographic error block replacing the 5 inline
// "Failed to load. Please refresh the page" patterns. Provides a real
// retry path via the onRetry callback (typically wired to useData.retry()).
//
// Accessible: role="alert", aria-live="polite".

const containerStyle = {
  padding: '2rem',
  textAlign: 'center',
  color: '#b33000',
  background: 'rgba(255,255,255,0.85)',
  border: '1px solid rgba(179,48,0,0.2)',
  borderRadius: '8px',
  margin: '1rem 0',
};

const titleStyle = {
  fontSize: '1.05rem',
  fontWeight: 700,
  margin: '0 0 0.5rem 0',
  color: '#b33000',
};

const messageStyle = {
  fontSize: '0.9rem',
  color: '#546e7a',
  marginBottom: '1rem',
  lineHeight: 1.55,
};

const linkStyle = {
  background: 'none',
  border: 'none',
  color: '#006633',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  fontFamily: 'inherit',
  padding: 0,
};

const sourceStyle = {
  display: 'block',
  marginTop: '1rem',
  fontSize: '0.75rem',
  color: '#78909c',
  fontStyle: 'italic',
};

export default function ErrorState({
  title = 'Could not load data',
  message = 'The data file did not load. This may be a temporary network issue.',
  onRetry,
  source,
}) {
  return (
    <div role="alert" aria-live="polite" style={containerStyle} className="glass-card">
      <h3 style={titleStyle}>{title}</h3>
      <p style={messageStyle}>{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} style={linkStyle}>
          Try again
        </button>
      )}
      {source && <span style={sourceStyle}>Source: {source}</span>}
    </div>
  );
}
