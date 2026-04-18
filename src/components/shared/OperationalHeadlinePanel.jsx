import { Link } from 'react-router-dom';
import DecisionTreeSVG from './DecisionTreeSVG';

// OperationalHeadlinePanel — page-lede panel showing the two-typology / two-recipe
// operational rule. Two-column: decision tree on left, typography panel on right.
// Mounted on Landing as the page lede; uses main's existing colour palette
// (Nigeria green primary; typology accent colours match DecisionTreeSVG leaves).

const NEUTRAL_RULE = '#d8dcd8';
const NEUTRAL_DIM = '#697269';
const NEUTRAL_TEXT = '#0d1b2a';
const PRIMARY_INK = '#003d1e';
const TYPOLOGY_REF_INK = '#2e7d32';
const TYPOLOGY_ACCESS_INK = '#1565c0';

const TYPOLOGY_DATA = [
  {
    id: 'reference',
    label: 'Reference community',
    proportion: '60.9% of communities',
    coverageS0: '71.5%',
    recipe: 'Outreach only (S1)',
    coverageProjected: '86.1%',
    accent: TYPOLOGY_REF_INK,
  },
  {
    id: 'access',
    label: 'Access-Constrained community',
    proportion: '39.1% of communities',
    coverageS0: '50.8%',
    recipe: 'Full package (S5)',
    coverageProjected: '82.0%',
    accent: TYPOLOGY_ACCESS_INK,
  },
];

export default function OperationalHeadlinePanel() {
  return (
    <section
      aria-label="Operational headline"
      style={{
        maxWidth: '1200px',
        margin: '2.5rem auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1.1fr)',
        gap: '3rem',
        alignItems: 'start',
      }}
    >
      {/* Left: decision tree */}
      <div>
        <DecisionTreeSVG />
      </div>

      {/* Right: typography panel */}
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
          style={{
            fontSize: '2.25rem',
            fontWeight: 700,
            lineHeight: 1.15,
            color: NEUTRAL_TEXT,
            margin: '0 0 1rem 0',
            fontFamily: 'Georgia, "Times New Roman", serif',
            letterSpacing: '-0.01em',
          }}
        >
          Two community types. Two recipes.
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: NEUTRAL_TEXT,
            lineHeight: 1.55,
            margin: '0 0 1.5rem 0',
          }}
        >
          Every Nigerian zero-dose community falls into one of two operational
          archetypes. Each archetype has a distinct minimal sufficient
          intervention bundle that lifts coverage above the 80% target.
        </p>

        {TYPOLOGY_DATA.map((t, idx) => (
          <div
            key={t.id}
            style={{
              borderTop: idx === 0 ? `1px solid ${NEUTRAL_RULE}` : 'none',
              borderBottom: `1px solid ${NEUTRAL_RULE}`,
              padding: '1.25rem 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <h3
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 700,
                  margin: 0,
                  color: t.accent,
                }}
              >
                {t.label}
              </h3>
              <span style={{ fontSize: '0.875rem', color: NEUTRAL_DIM }}>
                {t.proportion}
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                gap: '1rem',
                alignItems: 'baseline',
              }}
            >
              <Cell eyebrow="Coverage at S0" value={t.coverageS0} colour={NEUTRAL_TEXT} />
              <Cell eyebrow="Recipe" value={t.recipe} colour={t.accent} small />
              <Cell eyebrow="Coverage projected" value={t.coverageProjected} colour={t.accent} />
            </div>
          </div>
        ))}

        <Link
          to="/explorer/cna"
          style={{
            display: 'inline-block',
            marginTop: '1.25rem',
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
    </section>
  );
}

function Cell({ eyebrow, value, colour, small = false }) {
  return (
    <div>
      <div
        style={{
          fontSize: '0.6875rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: NEUTRAL_DIM,
          marginBottom: '0.35rem',
        }}
      >
        {eyebrow}
      </div>
      <div
        style={{
          fontSize: small ? '1rem' : '1.5rem',
          fontWeight: small ? 500 : 700,
          color: colour,
          fontVariantNumeric: 'tabular-nums',
          lineHeight: 1.1,
        }}
      >
        {value}
      </div>
    </div>
  );
}
