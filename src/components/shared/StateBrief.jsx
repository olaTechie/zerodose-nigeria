import { useMemo } from 'react';
import KeyFigure from './KeyFigure';
import TypologyBadge from './TypologyBadge';
import { typologyGuidance } from '../../data/storyContent';

// StateBrief — print-optimised one-page brief for a single state.
// Generated from clicked state on the Policy/Geographic NigeriaMap (Tunde's persona).
//
// Props:
//   stateProps — feature.properties from state_prevalence.json (required)
//                Expected fields: state_name, zone, weighted_prevalence (percent),
//                                 n_children, n_zerodose, cluster_type
//   onClose    — function called when "Close" is clicked
//
// Print: page-break-inside avoided per section, A4 portrait, nav/footer hidden via
// the `print:hidden` selector. Window-print is invoked by the "Print" button.
//
// Typology assignment derivation:
//   We do not yet have public/data/state-typology.json. Instead we use the
//   well-documented heuristic from outputs/stage1/cluster_typology_labels.csv:
//   states with weighted_prevalence ≥ 30% are treated as Access-Constrained;
//   below that, Reference. This matches the observed typology distribution
//   (Access-Constrained 39.1%, Reference 60.9%) and the regional pattern
//   (NW high-prevalence states are Access-Constrained, SE/SS low-prevalence
//   states are Reference). Once a per-state typology lookup table is published,
//   replace deriveTypology() with a fetch from public/data/state-typology.json.
function deriveTypology(stateProps) {
  const p = stateProps?.weighted_prevalence;
  if (p == null) return 'Reference';
  return p >= 30 ? 'Access-Constrained' : 'Reference';
}

// Coverage projections at month 36 / month 60 keyed by typology.
// Sourced from outputs/stage2/abm_to_cna_matrix.csv (S0 baseline & S5 full pkg).
const PROJECTIONS = {
  Reference: {
    baseline_m36: { median: 71.5, lo: 71.0, hi: 72.0 },
    s1_m36: { median: 86.1, lo: 85.7, hi: 86.5 },
    s5_m60: { median: 90.7, lo: 90.3, hi: 91.1 },
    package: 'Mobile outreach (S1)',
    rationale: 'Outreach alone is necessary and sufficient. Engagement adds nothing.',
  },
  'Access-Constrained': {
    baseline_m36: { median: 50.8, lo: 50.2, hi: 51.4 },
    s1_m36: { median: 77.2, lo: 76.7, hi: 77.7 },
    s5_m60: { median: 83.7, lo: 83.1, hi: 84.2 },
    package: 'Full combined package (S5): outreach + engagement + supply reinforcement',
    rationale: 'Outreach alone falls short of 80%. The full package is required.',
  },
};

const OVERLAY_STYLE = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(28, 33, 29, 0.4)',
  zIndex: 400,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'flex-start',
  padding: '2rem 1rem',
  overflowY: 'auto',
};

const SHEET_STYLE = {
  background: '#ffffff',
  width: '100%',
  maxWidth: '780px',
  padding: '3rem 3.5rem',
  border: '1px solid #c7cfc7',
  position: 'relative',
};

const TOOLBAR_STYLE = {
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '1rem',
  marginBottom: '1.5rem',
};

const TOOLBAR_BTN = {
  background: 'transparent',
  border: '1px solid #003d1e',
  color: '#003d1e',
  padding: '0.4rem 0.85rem',
  borderRadius: '6px',
  fontSize: '0.8125rem',
  fontWeight: 500,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

const SECTION_STYLE = {
  marginBottom: '1.5rem',
  pageBreakInside: 'avoid',
  breakInside: 'avoid',
};

const HEADING_STYLE = {
  fontSize: '0.6875rem',
  fontWeight: 600,
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: '#697269',
  marginBottom: '0.4rem',
};

const TITLE_STYLE = {
  fontFamily: '"Source Serif 4", ui-serif, Georgia, serif',
  fontSize: '2.5rem',
  fontWeight: 600,
  color: '#003d1e',
  margin: '0 0 0.25rem 0',
  lineHeight: 1.05,
};

const SUBTITLE_STYLE = {
  fontSize: '1rem',
  color: '#697269',
  margin: '0 0 2rem 0',
};

const BODY_STYLE = {
  fontSize: '1rem',
  color: '#1c211d',
  lineHeight: 1.6,
  margin: '0 0 0.5rem 0',
};

const FOOTER_STYLE = {
  marginTop: '2rem',
  paddingTop: '1rem',
  borderTop: '1px solid #c7cfc7',
  fontSize: '0.75rem',
  color: '#697269',
  display: 'flex',
  justifyContent: 'space-between',
};

export default function StateBrief({ stateProps, onClose }) {
  const generatedAt = useMemo(() => new Date(), []);

  if (!stateProps) return null;
  const typology = deriveTypology(stateProps);
  const proj = PROJECTIONS[typology];
  const guidance = typologyGuidance[typology];
  const prevalence = stateProps.weighted_prevalence;

  const dateString = generatedAt.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div style={OVERLAY_STYLE} role="dialog" aria-modal="true" aria-labelledby="state-brief-title">
      <article style={SHEET_STYLE} className="state-brief-sheet">
        <div style={TOOLBAR_STYLE} className="print:hidden state-brief-toolbar">
          <button type="button" style={TOOLBAR_BTN} onClick={() => window.print()}>
            Print / Save PDF
          </button>
          <button type="button" style={TOOLBAR_BTN} onClick={onClose}>
            Close
          </button>
        </div>

        <header>
          <div style={HEADING_STYLE}>State brief · NDHS 2024</div>
          <h1 id="state-brief-title" style={TITLE_STYLE}>
            {stateProps.state_name}
          </h1>
          <p style={SUBTITLE_STYLE}>
            {stateProps.zone} zone &middot; n = {stateProps.n_children} children &middot;{' '}
            {stateProps.n_zerodose} zero-dose
            {stateProps.cluster_type && stateProps.cluster_type !== 'Not significant'
              ? ` · LISA: ${stateProps.cluster_type}`
              : ''}
          </p>
        </header>

        <section style={SECTION_STYLE}>
          <h2 style={HEADING_STYLE}>Zero-dose prevalence</h2>
          <dl style={{ display: 'flex', gap: '2.5rem', margin: 0, flexWrap: 'wrap' }}>
            <KeyFigure
              label="Weighted prevalence"
              value={prevalence != null ? `${prevalence.toFixed(1)}%` : '--'}
              sublabel="Children 12–23 mo who never received DPT1"
              color={prevalence >= 30 ? 'red' : 'green'}
              sourceId="prevalence"
              size="lg"
            />
            <KeyFigure
              label="Sample size"
              value={`n = ${stateProps.n_children}`}
              sublabel="DHS-weighted"
              color="neutral"
            />
          </dl>
        </section>

        <section style={SECTION_STYLE}>
          <h2 style={HEADING_STYLE}>Community typology</h2>
          <div style={{ marginBottom: '0.5rem' }}>
            <TypologyBadge typology={typology} />
          </div>
          <p style={BODY_STYLE}>{guidance?.rationale}</p>
        </section>

        <section style={SECTION_STYLE}>
          <h2 style={HEADING_STYLE}>Recommended package</h2>
          <p style={{ ...BODY_STYLE, fontWeight: 600, color: '#003d1e' }}>
            {proj.package}
          </p>
          <p style={BODY_STYLE}>{proj.rationale}</p>
        </section>

        <section style={SECTION_STYLE}>
          <h2 style={HEADING_STYLE}>Projected coverage</h2>
          <dl style={{ display: 'flex', gap: '2.5rem', margin: 0, flexWrap: 'wrap' }}>
            <KeyFigure
              label="Status quo · month 36"
              value={`${proj.baseline_m36.median.toFixed(1)}%`}
              sublabel={`95% sim CI ${proj.baseline_m36.lo.toFixed(1)}–${proj.baseline_m36.hi.toFixed(1)}`}
              color="neutral"
              sourceId={typology === 'Reference' ? 's0-reference' : 's0-access'}
            />
            <KeyFigure
              label="Outreach (S1) · month 36"
              value={`${proj.s1_m36.median.toFixed(1)}%`}
              sublabel={`95% sim CI ${proj.s1_m36.lo.toFixed(1)}–${proj.s1_m36.hi.toFixed(1)}`}
              color="gold"
              sourceId={typology === 'Reference' ? 's1-reference' : 's1-access'}
            />
            <KeyFigure
              label="Full package (S5) · month 60"
              value={`${proj.s5_m60.median.toFixed(1)}%`}
              sublabel={`95% sim CI ${proj.s5_m60.lo.toFixed(1)}–${proj.s5_m60.hi.toFixed(1)}`}
              color="green"
              sourceId={typology === 'Reference' ? 's5-reference' : 's5-access'}
            />
          </dl>
        </section>

        <footer style={FOOTER_STYLE}>
          <span>Generated {dateString}</span>
          <span>Zero-Dose Nigeria · NDHS 2024 + ABM</span>
        </footer>
      </article>
    </div>
  );
}
