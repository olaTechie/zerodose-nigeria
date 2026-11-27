import { Link } from 'react-router-dom';
import DecisionTreeSVG from './DecisionTreeSVG';

// OperationalHeadlinePanel — page-lede panel showing the two community types and
// the simulated package that reached 80% DTP1 coverage in each. Two-column: decision tree on left, typography panel on right.
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
    proportion: '60.9% of survey clusters',
    coverageS0: '71.3%',
    pkg: 'Outreach only (S1)',
    coverageProjected: '87.5%',
    cost: 'Efficient at USD 800 per DALY averted',
    accent: TYPOLOGY_REF_INK,
  },
  {
    id: 'access',
    label: 'Access-Constrained community',
    proportion: '39.1% of survey clusters',
    coverageS0: '47.8%',
    pkg: 'Full package (S5)',
    coverageProjected: '83.7%',
    cost: 'USD 1,094 per DALY averted beyond outreach',
    accent: TYPOLOGY_ACCESS_INK,
  },
];

export default function OperationalHeadlinePanel() {
  return (
    <section
      aria-label="Operational headline"
      className="operational-panel"
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
          Two community types. Two packages.
        </h2>

        <p
          style={{
            fontSize: '1rem',
            color: NEUTRAL_TEXT,
            lineHeight: 1.55,
            margin: '0 0 1.5rem 0',
          }}
        >
          In the simulation, survey clusters fell into two community types that
          needed different packages to reach 80% DTP1 coverage. Simulated
          coverage at month 60; the simulation is calibrated to NDHS 2018 and
          2024 and has no independent validation.
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
              className="operational-metrics"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr)',
                gap: '1rem',
                alignItems: 'baseline',
              }}
            >
              <Cell eyebrow="Status quo, month 60" value={t.coverageS0} colour={NEUTRAL_TEXT} />
              <Cell eyebrow="Package" value={t.pkg} colour={t.accent} small />
              <Cell eyebrow="With package, month 60" value={t.coverageProjected} colour={t.accent} />
            </div>
            <div style={{ fontSize: '0.8rem', color: NEUTRAL_DIM, marginTop: '0.5rem' }}>{t.cost}</div>
          </div>
        ))}

        <Link
          to="/explorer/configurations"
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
          View the intervention configurations {'\u2192'}
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
