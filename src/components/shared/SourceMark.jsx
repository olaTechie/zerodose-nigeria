import * as Popover from '@radix-ui/react-popover';
import { useMethods } from './MethodsDrawer';
import { getSource } from '../../data/sources';

// SourceMark — small superscript citation marker per design brief Section 7.
// Renders a "[N]" wrapped in a Radix Popover; the popover shows the source
// label + value + detail + relative file path + an "Open methods \u2192" link.
//
// Props:
//   id     — key into SOURCES registry (required)
//   marker — optional override for the visible marker (default: small bracketed dagger)
//
// Accessibility: focusable, keyboard-operable (Enter/Space via Radix), aria-describedby,
// honours `prefers-reduced-motion` (Popover transitions are CSS-driven and respect the OS).

const MARKER_STYLE = {
  display: 'inline-block',
  fontSize: '0.625rem', // ~10px superscript
  fontWeight: 600,
  letterSpacing: '0.04em',
  color: '#003d1e',
  verticalAlign: 'super',
  lineHeight: 1,
  marginLeft: '0.15em',
  padding: '0 0.15em',
  cursor: 'help',
  background: 'transparent',
  border: 'none',
  borderBottom: '1px dotted #003d1e',
  fontFamily: 'inherit',
};

const CONTENT_STYLE = {
  background: '#fbfcfb',
  border: '1px solid #c7cfc7',
  padding: '0.875rem 1rem',
  maxWidth: '320px',
  fontSize: '0.8125rem',
  lineHeight: 1.5,
  color: '#1c211d',
  boxShadow: '0 8px 24px rgba(28, 33, 29, 0.08)',
  zIndex: 200,
};

const LABEL_STYLE = {
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#697269',
  marginBottom: '0.25rem',
};

const VALUE_STYLE = {
  fontSize: '1rem',
  fontWeight: 600,
  fontFamily: 'var(--font-serif, "Source Serif 4", Georgia, serif)',
  color: '#003d1e',
  marginBottom: '0.4rem',
  fontVariantNumeric: 'tabular-nums',
};

const DETAIL_STYLE = {
  fontSize: '0.8125rem',
  color: '#1c211d',
  marginBottom: '0.4rem',
};

const FILE_STYLE = {
  fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, monospace',
  fontSize: '0.75rem',
  color: '#697269',
  wordBreak: 'break-all',
  marginBottom: '0.5rem',
};

const METHODS_LINK_STYLE = {
  display: 'inline-block',
  fontSize: '0.8125rem',
  color: '#003d1e',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
  fontWeight: 500,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export default function SourceMark({ id, marker }) {
  const source = getSource(id);
  const methods = useMethods?.();

  if (!source) return null;

  const visibleMarker = marker || '\u2020'; // dagger by default; consistent with editorial chrome

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button
          type="button"
          style={MARKER_STYLE}
          aria-label={`Source: ${source.label}`}
        >
          {visibleMarker}
        </button>
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          side="top"
          align="center"
          sideOffset={6}
          style={CONTENT_STYLE}
        >
          <div style={LABEL_STYLE}>Source</div>
          <div style={VALUE_STYLE}>{source.value}</div>
          <div style={DETAIL_STYLE}>
            {source.label}
            {source.wave ? ` \u2022 ${source.wave}` : ''}
            {source.detail ? `. ${source.detail}` : ''}
          </div>
          {source.file && <div style={FILE_STYLE}>{source.file}</div>}
          {source.methods && methods && (
            <button
              type="button"
              style={METHODS_LINK_STYLE}
              onClick={() => methods.open(source.methods)}
            >
              Open methods {'\u2192'}
            </button>
          )}
          <Popover.Arrow style={{ fill: '#fbfcfb', stroke: '#c7cfc7' }} />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
