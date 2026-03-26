/**
 * Robustness heatmap: threshold (rows) x top formula presence/consistency.
 */
export default function RobustnessHeatmap({ data = [] }) {
  if (!data.length) return <p style={{ color: '#78909c' }}>No robustness data</p>;

  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', fontFamily: 'Inter, sans-serif' }}>
        <thead>
          <tr>
            <th style={thStyle}>Threshold</th>
            <th style={thStyle}>Solutions</th>
            <th style={thStyle}>Top Formula</th>
            <th style={thStyle}>Consistency</th>
            <th style={thStyle}>Coverage</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const conColor = row.top_con >= 0.9 ? '#006633' : row.top_con >= 0.75 ? '#cc8400' : '#b33000';
            return (
              <tr key={i}>
                <td style={{ ...tdStyle, fontWeight: 700 }}>
                  {(row.threshold * 100).toFixed(0)}%
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>{row.n_solutions}</td>
                <td style={{ ...tdStyle, fontFamily: "'Courier New', monospace", fontSize: '0.75rem' }}>
                  {row.top_formula?.replace('<->', ' <-> ')}
                </td>
                <td
                  style={{
                    ...tdStyle,
                    textAlign: 'center',
                    background: `${conColor}12`,
                    color: conColor,
                    fontWeight: 700,
                  }}
                >
                  {row.top_con?.toFixed(2)}
                </td>
                <td style={{ ...tdStyle, textAlign: 'center' }}>
                  {row.top_cov?.toFixed(2)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  padding: '0.55rem 0.7rem',
  borderBottom: '2px solid #e0e0e0',
  fontWeight: 700,
  fontSize: '0.75rem',
  textTransform: 'uppercase',
  letterSpacing: '0.3px',
  color: '#546e7a',
  textAlign: 'center',
};

const tdStyle = {
  padding: '0.5rem 0.7rem',
  borderBottom: '1px solid #f0f0f0',
};
