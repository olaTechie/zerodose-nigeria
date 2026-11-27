import * as Tooltip from '@radix-ui/react-tooltip';
import { getTerm } from '../../data/glossary';

// GlossaryTerm — wrap an inline term in a dotted-underline span; on hover or
// focus, show a Radix tooltip with expansion + definition.
// Per design brief Section 7 (jargon glossary tooltip).
//
// Usage:
//   <GlossaryTerm id="lca" />              // renders "LCA" with tooltip
//   <GlossaryTerm id="cna">CNA</GlossaryTerm>  // override surface text
//
// Accessibility: focusable, keyboard-operable, tooltip auto-disappears on Esc.

const TRIGGER_STYLE = {
  textDecoration: 'underline dotted',
  textUnderlineOffset: '4px',
  textDecorationColor: '#697269',
  cursor: 'help',
  background: 'transparent',
  border: 'none',
  padding: 0,
  font: 'inherit',
  color: 'inherit',
};

const CONTENT_STYLE = {
  background: '#1c211d',
  color: '#fbfcfb',
  padding: '0.625rem 0.75rem',
  borderRadius: '2px',
  maxWidth: '240px',
  fontSize: '0.8125rem',
  lineHeight: 1.5,
  zIndex: 200,
  boxShadow: '0 4px 16px rgba(28, 33, 29, 0.18)',
};

const TERM_STYLE = {
  fontFamily: 'var(--font-serif, "Source Serif 4", Georgia, serif)',
  fontWeight: 600,
  marginBottom: '0.25rem',
  color: '#fbfcfb',
};

const EXPANSION_STYLE = {
  fontSize: '0.75rem',
  color: '#c7cfc7',
  marginBottom: '0.35rem',
};

export default function GlossaryTerm({ id, children }) {
  const entry = getTerm(id);
  if (!entry) return <span>{children || id}</span>;

  const surface = children || entry.term;

  return (
    <Tooltip.Provider delayDuration={200}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <button
            type="button"
            style={TRIGGER_STYLE}
            aria-label={`${entry.term}: ${entry.expansion || entry.definition}`}
          >
            {surface}
          </button>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content side="top" sideOffset={5} style={CONTENT_STYLE}>
            <div style={TERM_STYLE}>{entry.term}</div>
            {entry.expansion && <div style={EXPANSION_STYLE}>{entry.expansion}</div>}
            <div>{entry.definition}</div>
            <Tooltip.Arrow style={{ fill: '#1c211d' }} />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
