import { getCoverageTier } from '../../utils/coverageTier';
import { SCENARIO_LABELS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

/**
 * Scenario x Typology coverage heatmap rendered as an HTML table.
 * Cells coloured by coverage tier.
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
              <th key={t} style={thStyle}>{t}</th>
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
                const val = cell?.coverage_month36_median;
                const tier = val != null ? getCoverageTier(val) : null;
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
                    {val != null ? `${(val * 100).toFixed(1)}%` : '--'}
                    {cell?.outcome_binary === 1 && (
                      <span style={{ marginLeft: '0.3rem', fontSize: '0.7rem' }}>
                        {'\u2713'}
                      </span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

