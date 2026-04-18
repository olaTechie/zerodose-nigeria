import { useEffect, useRef, useState } from 'react';

// SectionToc — left-rail Table of Contents with scroll-spy.
//
// Used to break up long single-route panels (e.g. Policy ActionPanel)
// into named sections with anchor links and an active-section indicator
// driven by IntersectionObserver.
//
// Props:
//   sections:  [{ id, label }] — each id must match an id="" attribute
//              on the corresponding in-page section.
//   ariaLabel: optional accessible label for the navigation landmark.
//   topOffset: pixels to subtract from the top when scrolling to section
//              (default 80, accounts for sticky strip + page nav).
//
// Behaviour:
//   - Anchors scroll smoothly to the matching section.
//   - IntersectionObserver tracks which section dominates the viewport;
//     that section's entry gets the gold underline and bold weight.
//   - On viewports < 768 px, the rail collapses to a toggle drawer
//     ("Sections" button) anchored to the bottom-right of the viewport.

const NEUTRAL_RULE = '#c7cfc7';
const NEUTRAL_DIM = '#697269';
const NEUTRAL_TEXT = '#1c211d';
const NEUTRAL_SURFACE = '#f4f7f4';
const ACCENT_GOLD = '#cc8400';
const PRIMARY_INK = '#003d1e';

export default function SectionToc({ sections, ariaLabel = 'On this page', topOffset = 80 }) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef(null);

  // Track viewport size for drawer / rail switch.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 767px)');
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener?.('change', update);
    return () => mq.removeEventListener?.('change', update);
  }, []);

  // IntersectionObserver scroll-spy.
  useEffect(() => {
    if (typeof window === 'undefined' || !sections.length) return;

    const handleObserve = (entries) => {
      // Pick the entry closest to the top of the viewport that is still
      // intersecting. This gives a stable highlight as the user scrolls.
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (visible.length > 0) {
        setActiveId(visible[0].target.id);
      }
    };

    observerRef.current?.disconnect();
    const obs = new IntersectionObserver(handleObserve, {
      // Top margin offsets the sticky page nav strip so a section is
      // counted as "active" as soon as its top crosses below the strip.
      rootMargin: `-${topOffset}px 0px -55% 0px`,
      threshold: [0, 0.1, 0.25, 0.5],
    });
    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) obs.observe(el);
    });
    observerRef.current = obs;
    return () => obs.disconnect();
  }, [sections, topOffset]);

  function handleAnchor(e, id) {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - topOffset;
    window.scrollTo({ top, behavior: 'smooth' });
    if (typeof window.history?.replaceState === 'function') {
      window.history.replaceState(null, '', `#${id}`);
    }
    setActiveId(id);
    setDrawerOpen(false);
  }

  // List body — used both in rail and drawer modes.
  const listBody = (
    <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>
      {sections.map((s, i) => {
        const isActive = s.id === activeId;
        return (
          <li key={s.id} style={{ marginBottom: '0.5rem' }}>
            <a
              href={`#${s.id}`}
              onClick={(e) => handleAnchor(e, s.id)}
              style={{
                display: 'block',
                padding: '0.4rem 0.5rem 0.4rem 0.75rem',
                borderLeft: `2px solid ${isActive ? ACCENT_GOLD : 'transparent'}`,
                color: isActive ? NEUTRAL_TEXT : NEUTRAL_DIM,
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.875rem',
                lineHeight: 1.4,
                textDecoration: 'none',
                transition: 'color 120ms ease, border-color 120ms ease',
              }}
            >
              <span
                style={{
                  fontVariantNumeric: 'tabular-nums',
                  color: NEUTRAL_DIM,
                  marginRight: '0.55rem',
                  fontSize: '0.75rem',
                }}
              >
                {String(i + 1).padStart(2, '0')}
              </span>
              {s.label}
            </a>
          </li>
        );
      })}
    </ol>
  );

  if (isMobile) {
    return (
      <>
        <button
          type="button"
          onClick={() => setDrawerOpen((v) => !v)}
          aria-expanded={drawerOpen}
          aria-controls="section-toc-drawer"
          style={{
            position: 'fixed',
            right: '1rem',
            bottom: '1rem',
            zIndex: 30,
            padding: '0.65rem 1rem',
            background: PRIMARY_INK,
            color: '#fbfcfb',
            border: 'none',
            fontSize: '0.8125rem',
            fontWeight: 600,
            fontFamily: 'inherit',
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            borderRadius: '2px',
            boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
          }}
        >
          {drawerOpen ? 'Close sections' : 'Sections'}
        </button>
        {drawerOpen && (
          <nav
            id="section-toc-drawer"
            aria-label={ariaLabel}
            style={{
              position: 'fixed',
              right: '1rem',
              bottom: '4rem',
              zIndex: 30,
              maxWidth: '320px',
              width: '85vw',
              background: NEUTRAL_SURFACE,
              border: `1px solid ${NEUTRAL_RULE}`,
              padding: '1rem',
              maxHeight: '70vh',
              overflowY: 'auto',
            }}
          >
            <div
              style={{
                fontSize: '0.6875rem',
                fontWeight: 500,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: NEUTRAL_DIM,
                marginBottom: '0.75rem',
              }}
            >
              On this page
            </div>
            {listBody}
          </nav>
        )}
      </>
    );
  }

  return (
    <nav
      aria-label={ariaLabel}
      style={{
        position: 'sticky',
        top: '88px',
        alignSelf: 'flex-start',
        paddingRight: '0.5rem',
      }}
    >
      <div
        style={{
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: NEUTRAL_DIM,
          marginBottom: '0.75rem',
          paddingLeft: '0.75rem',
        }}
      >
        On this page
      </div>
      {listBody}
    </nav>
  );
}
