// DecisionTreeFigure — canonical SVG figure for the operational headline.
// Lifted from Story.jsx (formerly inline DecisionTreeSVG), recoloured against
// the editorial neutral + Nigeria green primary palette per design brief §3.
// Reused on Story (closing scene) and Policy (hero panel).
//
// Greens for Reference branch, blue for Access-Constrained, dotted gold 80%
// reference line. No card chrome. Width is fluid to its container.

const NEUTRAL_TEXT = '#1c211d';
const NEUTRAL_DIM = '#697269';
const NEUTRAL_RULE = '#c7cfc7';

const REFERENCE_INK = '#003d1e';   // primary-900
const REFERENCE_TINT = '#e9efe9';  // neutral-100 with green hint

const ACCESS_INK = '#1565c0';
const ACCESS_TINT = '#eef4fb';

const TARGET_GOLD = '#cc8400';

export default function DecisionTreeFigure({
  maxWidth = 460,
  showFooter = true,
  ariaLabel = 'Decision tree showing two community types and their recommended intervention strategies',
}) {
  return (
    <svg
      viewBox="0 0 400 360"
      role="img"
      aria-label={ariaLabel}
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: `${maxWidth}px`,
        margin: '0 auto',
        display: 'block',
        fontFamily: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif',
      }}
    >
      {/* Root node */}
      <rect x="130" y="10" width="140" height="38" rx="2" fill={REFERENCE_INK} />
      <text
        x="200"
        y="34"
        textAnchor="middle"
        fill="#ffffff"
        fontSize="12"
        fontWeight="600"
        letterSpacing="0.02em"
      >
        Community type?
      </text>

      {/* Branches */}
      <line x1="170" y1="48" x2="100" y2="100" stroke={NEUTRAL_RULE} strokeWidth="1.5" />
      <line x1="230" y1="48" x2="300" y2="100" stroke={NEUTRAL_RULE} strokeWidth="1.5" />

      {/* Branch labels */}
      <text x="120" y="78" textAnchor="middle" fontSize="10" fill={NEUTRAL_DIM} fontWeight="600">
        Reference
      </text>
      <text x="280" y="78" textAnchor="middle" fontSize="10" fill={NEUTRAL_DIM} fontWeight="600">
        Access-Constrained
      </text>

      {/* Left leaf (Reference / Outreach S1) */}
      <rect
        x="20"
        y="100"
        width="160"
        height="104"
        rx="2"
        fill={REFERENCE_TINT}
        stroke={REFERENCE_INK}
        strokeWidth="1"
      />
      <text x="100" y="124" textAnchor="middle" fontSize="11" fontWeight="700" fill={REFERENCE_INK}>
        Outreach only (S1)
      </text>
      <text x="100" y="142" textAnchor="middle" fontSize="10" fill={NEUTRAL_DIM}>
        Deploy mobile teams
      </text>
      <text
        x="100"
        y="176"
        textAnchor="middle"
        fontSize="22"
        fontWeight="600"
        fill={REFERENCE_INK}
        style={{ fontVariantNumeric: 'tabular-nums', fontFamily: '"Source Serif 4", Georgia, serif' }}
      >
        86.1%
      </text>
      <text x="100" y="195" textAnchor="middle" fontSize="9" fill={NEUTRAL_DIM}>
        60.9% of communities
      </text>

      {/* Right leaf (Access-Constrained / Full S5) */}
      <rect
        x="220"
        y="100"
        width="160"
        height="104"
        rx="2"
        fill={ACCESS_TINT}
        stroke={ACCESS_INK}
        strokeWidth="1"
      />
      <text x="300" y="124" textAnchor="middle" fontSize="11" fontWeight="700" fill={ACCESS_INK}>
        Full package (S5)
      </text>
      <text x="300" y="142" textAnchor="middle" fontSize="10" fill={NEUTRAL_DIM}>
        Outreach + engage + supply
      </text>
      <text
        x="300"
        y="176"
        textAnchor="middle"
        fontSize="22"
        fontWeight="600"
        fill={ACCESS_INK}
        style={{ fontVariantNumeric: 'tabular-nums', fontFamily: '"Source Serif 4", Georgia, serif' }}
      >
        82.0%
      </text>
      <text x="300" y="195" textAnchor="middle" fontSize="9" fill={NEUTRAL_DIM}>
        39.1% of communities
      </text>

      {/* 80% target reference line */}
      <line
        x1="0"
        y1="240"
        x2="400"
        y2="240"
        stroke={TARGET_GOLD}
        strokeWidth="1"
        strokeDasharray="4,3"
      />
      <text x="200" y="258" textAnchor="middle" fontSize="10" fill={TARGET_GOLD} fontWeight="600">
        80% coverage target
      </text>

      {showFooter && (
        <>
          <text
            x="200"
            y="305"
            textAnchor="middle"
            fontSize="11"
            fill={NEUTRAL_TEXT}
            fontWeight="600"
          >
            Two community types. Two intervention strategies.
          </text>
          <text
            x="200"
            y="325"
            textAnchor="middle"
            fontSize="11"
            fill={NEUTRAL_TEXT}
            fontWeight="600"
          >
            One unified targeting rule.
          </text>
        </>
      )}
    </svg>
  );
}
