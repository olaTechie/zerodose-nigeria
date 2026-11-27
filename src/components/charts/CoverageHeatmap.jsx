import { getCoverageTier } from '../../utils/coverageTier';
import { SCENARIO_LABELS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

/**
 * Scenario x community type table of simulated DTP1 coverage.
 * Cells are coloured by month-60 coverage (the configuration endpoint);
 * month-36 coverage is shown beneath. A tick marks cells reaching 80% by month 60.
 */
export default function CoverageHeatmap({ matrix = [], onCellClick }) {
  const scenarios = [...new Set(matrix.map((r) => r.scenario_id))];
  const typologies = [...new Set(matrix.map((r) => r.typology))];

  function getCell(scenario, typology) {
    return matrix.find((r) => r.scenario_id === scenario && r.typology === typology);
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr>
            <th style={{ ...thStyle, textAlign: 'left' }}>Scenario</th>
            {typologies.map((t) => (
              <th key={t} style={{ ...thStyle, textAlign: 'center' }}>{t}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {scenarios.map((s) => (
            <tr key={s}>
              <td style={{ ...tdStyle, fontWeight: 600, textAlign: 'left' }}>
                <span style={{ color: '#546e7a', fontSize: '0.7rem' }}>{s}</span>{' '}
                {SCENARIO_LABELS[s] || s}
              </td>
              {typologies.map((t) => {
                const cell = getCell(s, t);
                const v60 = cell?.coverage_month60_median;
                const v36 = cell?.coverage_month36_median;
                const tier = v60 != null ? getCoverageTier(v60) : null;
                return (
                  <td
                    key={t}
                    style={{
                      ...tdStyle,
                      background: tier?.bg || '#f5f5f5',
                      color: tier?.color || '#999',
                      fontWeight: 700,
                      cursor: onCellClick ? 'pointer' : 'default',
                      textAlign: 'center',
                    }}
                    onClick={() => onCellClick?.(cell)}
                  >
                    {v60 != null ? `${(v60 * 100).toFixed(1)}%` : '--'}
                    {cell?.reaches_80_by_month60 === 1 && (
                      <span style={{ marginLeft: '0.3rem', fontSize: '0.7rem' }} aria-label="reaches 80% by month 60">
                        {'✓'}
                      </span>
                    )}
                    {v36 != null && (
                      <div style={{ fontSize: '0.68rem', fontWeight: 500, color: '#546e7a' }}>
                        month 36: {(v36 * 100).toFixed(1)}%
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
      <p style={{ fontSize: '0.72rem', color: '#78909c', margin: '0.5rem 0 0' }}>
        Median simulated DTP1 coverage at month 60 (500 replicates per cell), month 36 beneath.
        {' ✓'} = reaches 80% by month 60.
      </p>
    </div>
  );
}
