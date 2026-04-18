import { useCallback, useEffect, useId, useRef } from 'react';

// UnderlineTabNav — single underline-tab pattern per design brief §9.
//
// One implementation, used across Policy, Explorer, and any other route
// with route-level tabs. Replaces the three previous patterns
// (rounded-pill in Policy, rounded-top NavLink in Explorer, free-form
// inline buttons elsewhere).
//
// Visual spec:
//   - 1 px bottom rule in neutral-300 (#c7cfc7) spans the full content width
//   - Tab labels: body-sans 15 px, weight 500 inactive / 600 active
//   - Active tab: 2 px solid gold (#cc8400) underline, terminating at label width
//   - Hover on inactive: neutral-900 colour change only, no background
//   - Focus-visible: keyboard outline visible
//
// Accessibility:
//   - role="tablist" container, role="tab" items
//   - aria-selected on active
//   - keyboard navigation: ArrowLeft / ArrowRight cycles focus + activates
//   - Home / End jump to first / last
//
// Props:
//   tabs:     [{ id, label }]
//   activeId: string — id of currently active tab
//   onChange: (id) => void — called when user activates a tab
//   ariaLabel: optional accessible label for the tablist
//   size:     'default' | 'compact' (compact = inner-tier sub-tabs)
//   className: optional extra class on the container

const NEUTRAL_RULE = '#c7cfc7';
const NEUTRAL_DIM = '#697269';
const NEUTRAL_TEXT = '#1c211d';
const ACCENT_GOLD = '#cc8400';

export default function UnderlineTabNav({
  tabs,
  activeId,
  onChange,
  ariaLabel,
  size = 'default',
  className,
  style,
}) {
  const tabRefs = useRef({});
  const groupId = useId();

  const focusTab = useCallback((id) => {
    const el = tabRefs.current[id];
    if (el) el.focus();
  }, []);

  const handleKey = useCallback(
    (e, idx) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      let nextIdx = idx;
      if (e.key === 'ArrowRight') nextIdx = (idx + 1) % tabs.length;
      if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + tabs.length) % tabs.length;
      if (e.key === 'Home') nextIdx = 0;
      if (e.key === 'End') nextIdx = tabs.length - 1;
      const next = tabs[nextIdx];
      onChange?.(next.id);
      // Focus follows activation per design brief (Radix pattern)
      requestAnimationFrame(() => focusTab(next.id));
    },
    [tabs, onChange, focusTab]
  );

  // Compact spacing for second-tier sub-tabs.
  const labelSize = size === 'compact' ? '0.875rem' : '0.9375rem';
  const padBlock = size === 'compact' ? '0.4rem' : '0.5rem';
  const gap = size === 'compact' ? '1.25rem' : '1.75rem';
  const marginBottom = size === 'compact' ? '1rem' : '1.5rem';

  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: 'flex',
        gap,
        flexWrap: 'wrap',
        borderBottom: `1px solid ${NEUTRAL_RULE}`,
        marginBottom,
        ...style,
      }}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            ref={(el) => {
              tabRefs.current[tab.id] = el;
            }}
            type="button"
            role="tab"
            id={`${groupId}-tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={tab.controls}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange?.(tab.id)}
            onKeyDown={(e) => handleKey(e, idx)}
            className="utn-tab"
            style={{
              padding: `${padBlock} 0`,
              border: 'none',
              background: 'transparent',
              color: isActive ? NEUTRAL_TEXT : NEUTRAL_DIM,
              fontWeight: isActive ? 600 : 500,
              fontSize: labelSize,
              fontFamily: 'inherit',
              cursor: 'pointer',
              borderBottom: `2px solid ${isActive ? ACCENT_GOLD : 'transparent'}`,
              marginBottom: '-1px',
              transition: 'color 120ms ease',
              outlineOffset: '4px',
            }}
          >
            {tab.label}
          </button>
        );
      })}
      <style>{`
        .utn-tab:hover { color: ${NEUTRAL_TEXT} !important; }
        .utn-tab:focus-visible {
          outline: 2px solid ${ACCENT_GOLD};
          outline-offset: 4px;
          border-radius: 2px;
        }
      `}</style>
    </div>
  );
}

// Convenience wrapper that ties UnderlineTabNav to a react-router URL param.
// Used by Explorer where active tab state lives in the URL.
export function useUrlTabState(value, options) {
  // Returns the matching option or the first as fallback.
  const match = options.find((o) => o.id === value);
  return match || options[0];
}
