import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import ReactMarkdown from 'react-markdown';

// MethodsDrawer — single global side drawer for methods content.
// Per design brief Section 7 (methods overlay):
//   - enters from the right, max-width 480 px, full viewport height, scroll-locked
//   - markdown loaded from public/methods/<section-id>.md
//   - closes on Esc, click-outside, or close button
//
// Usage:
//   1. Mount <MethodsProvider> high in the tree (App.jsx).
//   2. Anywhere inside, call `const methods = useMethods(); methods.open('risk-model')`.
//   3. Place <MethodsLink sectionId="..." /> in nav/footer.

const MethodsContext = createContext({
  open: () => {},
  close: () => {},
  current: null,
});

export function useMethods() {
  return useContext(MethodsContext);
}

export function MethodsProvider({ children }) {
  const [current, setCurrent] = useState(null);

  const open = useCallback((sectionId) => setCurrent(sectionId), []);
  const close = useCallback(() => setCurrent(null), []);

  const ctx = useMemo(() => ({ open, close, current }), [open, close, current]);

  return (
    <MethodsContext.Provider value={ctx}>
      {children}
      <MethodsDrawer />
    </MethodsContext.Provider>
  );
}

const OVERLAY_STYLE = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(28, 33, 29, 0.32)',
  zIndex: 300,
};

const CONTENT_STYLE = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: '100%',
  maxWidth: '480px',
  background: '#fbfcfb',
  borderLeft: '1px solid #c7cfc7',
  boxShadow: '-8px 0 32px rgba(28, 33, 29, 0.08)',
  zIndex: 301,
  display: 'flex',
  flexDirection: 'column',
};

const HEADER_STYLE = {
  padding: '1rem 1.5rem',
  borderBottom: '1px solid #c7cfc7',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
};

const BODY_STYLE = {
  padding: '1.5rem 2rem 3rem',
  overflowY: 'auto',
  flex: 1,
};

const CLOSE_BTN_STYLE = {
  background: 'transparent',
  border: 'none',
  color: '#1c211d',
  fontSize: '1.5rem',
  lineHeight: 1,
  cursor: 'pointer',
  padding: '0.25rem 0.5rem',
  fontFamily: 'inherit',
};

const EYEBROW_STYLE = {
  fontSize: '0.6875rem',
  fontWeight: 500,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#697269',
};

const ERROR_STYLE = {
  padding: '1rem',
  background: '#fff8e1',
  border: '1px solid #cc8400',
  color: '#1c211d',
  fontSize: '0.875rem',
};

function MethodsDrawer() {
  const { current, close } = useMethods();
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!current) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setContent('');
    const base = (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.BASE_URL) || '/';
    const url = `${base.replace(/\/$/, '')}/methods/${current}.md`;
    fetch(url)
      .then((r) => {
        if (!r.ok) throw new Error(`Methods file not found: ${current}.md`);
        return r.text();
      })
      .then((txt) => {
        if (!cancelled) setContent(txt);
      })
      .catch((e) => {
        if (!cancelled) setError(e.message || 'Failed to load methods');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [current]);

  return (
    <Dialog.Root open={current != null} onOpenChange={(o) => { if (!o) close(); }}>
      <Dialog.Portal>
        <Dialog.Overlay style={OVERLAY_STYLE} />
        <Dialog.Content style={CONTENT_STYLE} aria-describedby={undefined}>
          <header style={HEADER_STYLE}>
            <div>
              <div style={EYEBROW_STYLE}>Methods</div>
              <Dialog.Title
                className="font-serif"
                style={{
                  fontSize: '1.125rem',
                  fontWeight: 600,
                  color: '#1c211d',
                  margin: '0.15rem 0 0',
                }}
              >
                {current ? prettyTitle(current) : ''}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button type="button" style={CLOSE_BTN_STYLE} aria-label="Close methods">
                {'\u00d7'}
              </button>
            </Dialog.Close>
          </header>
          <div style={BODY_STYLE} className="methods-prose">
            {loading && (
              <p style={{ color: '#697269', fontSize: '0.875rem' }}>{'Loading methods\u2026'}</p>
            )}
            {error && <div style={ERROR_STYLE}>{error}</div>}
            {!loading && !error && content && <ReactMarkdown>{content}</ReactMarkdown>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function prettyTitle(id) {
  const map = {
    overview: 'Pipeline overview',
    'risk-model': 'Stage 1 \u2014 Risk model',
    'digital-twin': 'Stage 2 \u2014 Digital twin',
    'causal-recipes': 'Stage 3 \u2014 Causal recipes',
    glossary: 'Glossary',
  };
  return map[id] || id;
}

// Convenience: a styled inline link that opens the drawer.
export function MethodsLink({ sectionId, children, style }) {
  const methods = useMethods();
  return (
    <button
      type="button"
      onClick={() => methods.open(sectionId)}
      style={{
        background: 'none',
        border: 'none',
        padding: 0,
        cursor: 'pointer',
        font: 'inherit',
        color: '#003d1e',
        textDecoration: 'underline',
        textUnderlineOffset: '3px',
        ...style,
      }}
    >
      {children || 'Methods'}
    </button>
  );
}
