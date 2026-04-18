import { PIPELINE_METRICS, ZONE_LABELS } from '../../data/constants';

// DisruptionBars — small horizontal bar chart of the six per-zone disruption
// posterior medians, used in the Story 'disruption' scene. NW is highlighted
// in the same red used for the LISA hotspot palette.

const ZONE_ORDER = ['NW', 'NC', 'SS', 'SW', 'SE', 'NE']; // sorted by posterior median descending
const HIGHLIGHT_ZONE = 'NW';
const NEUTRAL_BAR = '#9ca8a0';
const HIGHLIGHT_BAR = '#b71c1c';
const TARGET_LINE = '#cc8400';

export default function DisruptionBars() {
  const data = ZONE_ORDER.map((z) => ({
    zone: z,
    label: ZONE_LABELS[z] || z,
    value: PIPELINE_METRICS[`disruption_${z}`],
  }));
  const maxValue = Math.max(...data.map((d) => d.value), 2.0);

  return (
    <div
      role="img"
      aria-label="Per-zone disruption multipliers showing North West highest at 1.73"
      style={{
        background: '#fbfcfb',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1.25rem',
        maxWidth: '480px',
        margin: '0 auto',
      }}
    >
      <div
        style={{
          fontSize: '0.7rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#697269',
          marginBottom: '0.75rem',
        }}
      >
        Per-zone disruption multiplier
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {data.map((d) => {
          const widthPct = (d.value / maxValue) * 100;
          const isHighlight = d.zone === HIGHLIGHT_ZONE;
          return (
            <div
              key={d.zone}
              style={{
                display: 'grid',
                gridTemplateColumns: '110px 1fr 50px',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <div
                style={{
                  fontSize: '0.78rem',
                  color: isHighlight ? '#1c211d' : '#546e7a',
                  fontWeight: isHighlight ? 600 : 400,
                  textAlign: 'right',
                }}
              >
                {d.label}
              </div>
              <div style={{ height: '14px', background: '#eef2ee', borderRadius: '2px', position: 'relative' }}>
                <div
                  style={{
                    height: '100%',
                    width: `${widthPct}%`,
                    background: isHighlight ? HIGHLIGHT_BAR : NEUTRAL_BAR,
                    borderRadius: '2px',
                    transition: 'width 0.4s ease',
                  }}
                />
              </div>
              <div
                style={{
                  fontSize: '0.78rem',
                  fontWeight: isHighlight ? 700 : 500,
                  color: isHighlight ? HIGHLIGHT_BAR : '#0d1b2a',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {d.value.toFixed(2)}
              </div>
            </div>
          );
        })}
      </div>

      {/* 1.0 reference line annotation */}
      <div
        style={{
          marginTop: '0.75rem',
          paddingTop: '0.5rem',
          borderTop: `1px dashed ${TARGET_LINE}`,
          fontSize: '0.7rem',
          color: TARGET_LINE,
          fontWeight: 500,
        }}
      >
        1.0 = no inferred disruption (baseline)
      </div>
      <div
        style={{
          marginTop: '0.4rem',
          fontSize: '0.7rem',
          color: '#78909c',
          fontStyle: 'italic',
          lineHeight: 1.5,
        }}
      >
        Posterior medians from joint 2018+2024 ABC calibration.
        Inferred zone-specific stress on supply, worker absence, and rumour arrival.
      </div>
    </div>
  );
}
