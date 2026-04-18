import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DecisionTreeFigure from './DecisionTreeFigure';
import SourceMark from './SourceMark';
import GlossaryTerm from './GlossaryTerm';

// OperationalHeadline — the brand-load-bearing sentence of the site
// ("Two community types. Two recipes.") rendered in three editorial
// treatments per design brief §3.
//
// Modes:
//   - hero    : canonical two-column editorial panel (Policy lede, Story closer fallback)
//   - strip   : 40 px slim persistent strip below site nav (sticky on Explorer)
//   - closing : full-bleed editorial spread for the end of Story
//
// Typographic first, illustrative second. No card chrome, no gradient,
// no emoji, no arrow icons.

const NEUTRAL_BG = '#fbfcfb';
const NEUTRAL_SURFACE = '#f4f7f4';
const NEUTRAL_RULE = '#c7cfc7';
const NEUTRAL_DIM = '#697269';
const NEUTRAL_TEXT = '#1c211d';
const PRIMARY_INK = '#003d1e';

const REFERENCE_INK = '#003d1e';
const ACCESS_INK = '#1565c0';

const TYPOLOGY_DATA = [
  {
    key: 'Reference',
    label: 'Reference community',
    glossaryId: 'reference',
    proportion: '60.9% of communities',
    coverageS0: '71.5%',
    coverageS0SourceId: 's0-reference',
    recipe: 'Outreach only (S1)',
    recipeGlossaryId: 's1',
    coverageProjected: '86.1%',
    coverageProjectedSourceId: 's1-reference',
    accent: REFERENCE_INK,
  },
  {
    key: 'Access-Constrained',
    label: 'Access-Constrained community',
    glossaryId: 'access-constrained',
    proportion: '39.1% of communities',
    coverageS0: '50.8%',
    coverageS0SourceId: 's0-access',
    recipe: 'Full package (S5)',
    recipeGlossaryId: 's5',
    coverageProjected: '82.0%',
    coverageProjectedSourceId: 's5-access-36',
    accent: ACCESS_INK,
  },
];

export default function OperationalHeadline({ mode = 'hero', sticky = false }) {
  if (mode === 'strip') return <StripVariant sticky={sticky} />;
  if (mode === 'closing') return <ClosingVariant />;
  return <HeroVariant />;
}

// ---------------------------------------------------------------------------
// Variant A — Hero panel (canonical)
// ---------------------------------------------------------------------------

function HeroVariant() {
  return (
    <section
      aria-labelledby="op-headline-hero"
      style={{
        padding: '3rem 0',
        borderBottom: `1px solid ${NEUTRAL_RULE}`,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
          gap: '3rem',
          alignItems: 'start',
        }}
        className="op-headline-grid"
      >
        {/* Left: figure of record */}
        <div>
          <DecisionTreeFigure maxWidth={460} showFooter={false} />
        </div>

        {/* Right: editorial copy + per-typology dl */}
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: NEUTRAL_DIM,
              marginBottom: '0.75rem',
            }}
          >
            Operational headline
          </div>
          <h2
            id="op-headline-hero"
            className="font-serif"
            style={{
              fontSize: '2.5rem',
              fontWeight: 500,
              lineHeight: 1.1,
              color: NEUTRAL_TEXT,
              margin: '0 0 1rem 0',
              maxWidth: '18ch',
            }}
          >
            Two community types. Two recipes.
          </h2>
          <p
            style={{
              fontSize: '1rem',
              lineHeight: 1.6,
              color: NEUTRAL_TEXT,
              margin: '0 0 1.5rem 0',
              maxWidth: '52ch',
            }}
          >
            Every Nigerian zero-dose community falls into one of two operational
            archetypes. Each archetype has a distinct minimal sufficient
            intervention bundle that lifts coverage above the 80% target.
          </p>

          <div style={{ display: 'grid', gap: '1.25rem' }}>
            {TYPOLOGY_DATA.map((t) => (
              <RecipeDL key={t.key} t={t} />
            ))}
          </div>

          <div style={{ marginTop: '1.5rem' }}>
            <Link
              to="/explorer/causal/cna"
              style={{
                fontSize: '0.9375rem',
                color: PRIMARY_INK,
                textDecoration: 'underline',
                textUnderlineOffset: '4px',
                fontWeight: 500,
              }}
            >
              View the underlying CNA solutions {'\u2192'}
            </Link>
          </div>
        </div>
      </div>
      {/* Stack on narrow viewports */}
      <style>{`
        @media (max-width: 880px) {
          .op-headline-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  );
}

function RecipeDL({ t }) {
  return (
    <dl
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '1rem',
        margin: 0,
        padding: '1rem 0 0',
        borderTop: `1px solid ${NEUTRAL_RULE}`,
      }}
    >
      <div style={{ gridColumn: '1 / -1', marginBottom: '0.25rem' }}>
        <span
          className="font-serif"
          style={{
            fontSize: '1.0625rem',
            fontWeight: 600,
            color: t.accent,
            letterSpacing: '0.005em',
          }}
        >
          {t.glossaryId ? <GlossaryTerm id={t.glossaryId}>{t.label}</GlossaryTerm> : t.label}
        </span>
        <span style={{ fontSize: '0.8125rem', color: NEUTRAL_DIM, marginLeft: '0.65rem' }}>
          {t.proportion}
        </span>
      </div>

      <RecipeItem
        label="Coverage at S0"
        value={t.coverageS0}
        colour={NEUTRAL_TEXT}
        small
        sourceId={t.coverageS0SourceId}
      />
      <RecipeItem
        label="Recipe"
        value={
          t.recipeGlossaryId ? (
            <GlossaryTerm id={t.recipeGlossaryId}>{t.recipe}</GlossaryTerm>
          ) : (
            t.recipe
          )
        }
        colour={t.accent}
        small
        isText
      />
      <RecipeItem
        label="Coverage projected"
        value={t.coverageProjected}
        colour={t.accent}
        sourceId={t.coverageProjectedSourceId}
      />
    </dl>
  );
}

function RecipeItem({ label, value, colour, small = false, isText = false, sourceId }) {
  return (
    <div>
      <dt
        style={{
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: NEUTRAL_DIM,
          marginBottom: '0.2rem',
        }}
      >
        {label}
      </dt>
      <dd
        className={isText ? '' : 'font-serif'}
        style={{
          margin: 0,
          fontSize: isText ? '0.9375rem' : small ? '1.5rem' : '2rem',
          fontWeight: isText ? 500 : 600,
          lineHeight: 1.15,
          color: colour,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
        {sourceId && <SourceMark id={sourceId} />}
      </dd>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant B — Persistent strip (40 px) below the site nav
// ---------------------------------------------------------------------------

const DISMISS_KEY = 'opHeadlineStripDismissed:v1';

function StripVariant({ sticky }) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      setDismissed(window.localStorage.getItem(DISMISS_KEY) === '1');
    } catch {
      // ignore — strip just renders if storage unavailable
    }
  }, []);

  function handleDismiss() {
    setDismissed(true);
    try {
      window.localStorage.setItem(DISMISS_KEY, '1');
    } catch {
      // ignore
    }
  }

  if (dismissed) return null;

  return (
    <div
      role="region"
      aria-label="Operational headline"
      style={{
        position: sticky ? 'sticky' : 'static',
        top: sticky ? 0 : 'auto',
        zIndex: sticky ? 40 : 'auto',
        height: '40px',
        background: NEUTRAL_SURFACE,
        borderBottom: `1px solid ${NEUTRAL_RULE}`,
        display: 'flex',
        alignItems: 'center',
        padding: '0 1.5rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
        }}
      >
        <span
          style={{
            fontSize: '0.6875rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: NEUTRAL_DIM,
            whiteSpace: 'nowrap',
          }}
        >
          Operational headline
        </span>
        <span
          style={{
            fontSize: '0.875rem',
            color: NEUTRAL_TEXT,
            fontWeight: 500,
            flex: 1,
            minWidth: 0,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          Two community types. Two recipes.
        </span>
        <Link
          to="/policy#recipe"
          style={{
            fontSize: '0.8125rem',
            color: PRIMARY_INK,
            textDecoration: 'underline',
            textUnderlineOffset: '3px',
            fontWeight: 500,
            whiteSpace: 'nowrap',
          }}
        >
          Read the recipes {'\u2192'}
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          aria-label="Dismiss operational headline"
          style={{
            background: 'transparent',
            border: 'none',
            color: NEUTRAL_DIM,
            fontSize: '1.125rem',
            lineHeight: 1,
            cursor: 'pointer',
            padding: '0 0.25rem',
            fontFamily: 'inherit',
          }}
        >
          {'\u00d7'}
        </button>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Variant C — Closing editorial spread (Story end)
// ---------------------------------------------------------------------------

function ClosingVariant() {
  return (
    <section
      aria-labelledby="op-headline-closing"
      style={{
        background: NEUTRAL_BG,
        borderTop: `1px solid ${NEUTRAL_RULE}`,
        padding: '6rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: '1300px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.05fr) minmax(0, 1fr)',
          gap: '4rem',
          alignItems: 'center',
        }}
        className="op-headline-closing-grid"
      >
        <div>
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 500,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: NEUTRAL_DIM,
              marginBottom: '1rem',
            }}
          >
            The operational headline
          </div>
          <h2
            id="op-headline-closing"
            className="font-serif"
            style={{
              fontSize: '4rem',
              fontWeight: 500,
              lineHeight: 1.05,
              color: NEUTRAL_TEXT,
              margin: '0 0 1.5rem 0',
              maxWidth: '14ch',
            }}
          >
            Two community types. Two recipes.
          </h2>
          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: 1.55,
              color: NEUTRAL_TEXT,
              margin: '0 0 2rem 0',
              maxWidth: '50ch',
            }}
          >
            One unified targeting rule. Identify the typology. Deploy the recipe.
            Reach 80% Pentavalent-1 coverage in the children who currently receive
            no vaccines at all.
          </p>
          <Link
            to="/policy#recipe"
            style={{
              fontSize: '1rem',
              color: PRIMARY_INK,
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              fontWeight: 500,
            }}
          >
            Open the policy console {'\u2192'}
          </Link>
        </div>
        <div>
          <DecisionTreeFigure maxWidth={520} showFooter={false} />
        </div>
      </div>
      <style>{`
        @media (max-width: 880px) {
          .op-headline-closing-grid { grid-template-columns: 1fr !important; gap: 2.5rem !important; }
          #op-headline-closing { font-size: 2.5rem !important; }
        }
      `}</style>
    </section>
  );
}
