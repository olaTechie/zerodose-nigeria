/**
 * ErrorState — single typographic error block per editorial design brief §6.
 *
 * Replaces the previous inline "Failed to load. Please refresh the page" pattern
 * with a calm, accessible block: serif h3 title, sans body, underline text-link
 * "Try again", and a subtle source line. No card chrome, no shadow, no border —
 * the surrounding page provides the container.
 *
 * Props:
 *   title    — short noun phrase ("Story data unavailable")
 *   message  — one or two-sentence explanation
 *   onRetry  — function called when "Try again" is clicked. If omitted, the
 *              link is hidden.
 *   source   — optional sentence describing the source file or pipeline stage
 *              that failed. Rendered as a subtle eyebrow.
 *
 * Accessibility: role="alert" + aria-live="polite" so the page change is
 * announced without interrupting screen readers mid-sentence.
 */

const WRAP_STYLE = {
  padding: '3rem 1.5rem',
  maxWidth: '560px',
  margin: '0 auto',
  textAlign: 'left',
};

const SOURCE_STYLE = {
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#697269',
  marginBottom: '0.5rem',
};

const TITLE_STYLE = {
  fontFamily: '"Source Serif 4", ui-serif, Georgia, serif',
  fontSize: '1.5rem',
  fontWeight: 600,
  color: '#1c211d',
  margin: '0 0 0.75rem 0',
  lineHeight: 1.25,
};

const MESSAGE_STYLE = {
  fontSize: '1rem',
  color: '#1c211d',
  lineHeight: 1.6,
  margin: '0 0 1rem 0',
};

const RETRY_STYLE = {
  background: 'transparent',
  border: 'none',
  padding: 0,
  font: 'inherit',
  fontSize: '0.9375rem',
  color: '#003d1e',
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
  cursor: 'pointer',
  fontWeight: 500,
};

export default function ErrorState({ title, message, onRetry, source }) {
  return (
    <div role="alert" aria-live="polite" style={WRAP_STYLE}>
      {source && <div style={SOURCE_STYLE}>{source}</div>}
      <h3 style={TITLE_STYLE}>{title || 'Something went wrong'}</h3>
      {message && <p style={MESSAGE_STYLE}>{message}</p>}
      {onRetry && (
        <button type="button" style={RETRY_STYLE} onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}
