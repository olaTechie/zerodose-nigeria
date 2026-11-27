import { SCENARIO_LABELS, SCENARIO_COLOURS } from '../../data/constants';

/**
 * Simulated DTP1 coverage at months 36 and 60 with 95% simulation intervals,
 * one row per scenario, for one community type. Replaces the earlier
 * interpolated trajectory curves: the simulation saved months 36 and 60 only.
 */
export default function ScenarioIntervalChart({
  matrix = [],
  typology = 'Reference',
  scenarios = ['S0', 'S1', 'S2', 'S3', 'S4', 'S5'],
  highlight = null,
}) {
  const rows = scenarios
    .map((s) => matrix.find((r) => r.scenario_id === s && r.typology === typology))
    .filter(Boolean);

  const W = 980;
  const labelW = 300;
  const rightPad = 40;
  const rowH = 40;
  const top = 38;
  const bottom = 44;
  const H = top + rows.length * rowH + bottom;
  const xMin = 0.4;
  const xMax = 1.0;
  const plotW = W - labelW - rightPad;
  const x = (v) => labelW + ((Math.max(xMin, Math.min(xMax, v)) - xMin) / (xMax - xMin)) * plotW;
  const ticks = [0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0];

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'Inter, sans-serif' }}
      role="img"
      aria-label={`Simulated DTP1 coverage at months 36 and 60 by scenario, ${typology} communities`}
    >
      {/* Legend */}
      <g transform="translate(8, 14)">
        <circle cx={6} cy={0} r={5} fill="#fff" stroke="#37474f" strokeWidth={1.6} />
        <text x={16} y={4} fontSize={11} fill="#37474f">Month 36</text>
        <circle cx={96} cy={0} r={5} fill="#37474f" />
        <text x={106} y={4} fontSize={11} fill="#37474f">Month 60</text>
        <line x1={186} x2={210} y1={0} y2={0} stroke="#37474f" strokeWidth={1.4} />
        <text x={216} y={4} fontSize={11} fill="#37474f">95% simulation interval</text>
      </g>

      {/* Grid */}
      {ticks.map((t) => (
        <g key={t}>
          <line x1={x(t)} x2={x(t)} y1={top - 6} y2={H - bottom} stroke={t === 0.8 ? '#d32f2f' : '#e6e9e6'} strokeWidth={t === 0.8 ? 1.4 : 1} strokeDasharray={t === 0.8 ? '5,3' : undefined} />
          <text x={x(t)} y={H - bottom + 16} fontSize={11} fill="#546e7a" textAnchor="middle">{`${Math.round(t * 100)}%`}</text>
        </g>
      ))}
      <text x={x(0.8) + 4} y={top - 10} fontSize={10} fill="#d32f2f" fontWeight={600}>80% target</text>
      <text x={labelW + plotW / 2} y={H - 6} fontSize={11} fill="#546e7a" textAnchor="middle">Simulated DTP1 coverage</text>

      {rows.map((r, i) => {
        const cy = top + i * rowH + rowH / 2;
        const color = SCENARIO_COLOURS[r.scenario_id] || '#555';
        const dim = highlight && highlight !== r.scenario_id;
        return (
          <g key={r.scenario_id} opacity={dim ? 0.35 : 1}>
            {i % 2 === 0 && <rect x={0} y={cy - rowH / 2} width={W} height={rowH} fill="#f6f8f6" />}
            <text x={labelW - 10} y={cy + 4} fontSize={12} fill="#0d1b2a" textAnchor="end" fontWeight={highlight === r.scenario_id ? 700 : 500}>
              {r.scenario_id} {SCENARIO_LABELS[r.scenario_id]}
            </text>
            {/* month 36 */}
            <line x1={x(r.coverage_month36_p025)} x2={x(r.coverage_month36_p975)} y1={cy - 6} y2={cy - 6} stroke={color} strokeWidth={2} />
            <circle cx={x(r.coverage_month36_median)} cy={cy - 6} r={5} fill="#fff" stroke={color} strokeWidth={2}>
              <title>{`${r.scenario_id}, month 36: ${(r.coverage_month36_median * 100).toFixed(1)}% (95% simulation interval ${(r.coverage_month36_p025 * 100).toFixed(1)}% to ${(r.coverage_month36_p975 * 100).toFixed(1)}%)`}</title>
            </circle>
            {/* month 60 */}
            <line x1={x(r.coverage_month60_p025)} x2={x(r.coverage_month60_p975)} y1={cy + 6} y2={cy + 6} stroke={color} strokeWidth={2} />
            <circle cx={x(r.coverage_month60_median)} cy={cy + 6} r={5} fill={color}>
              <title>{`${r.scenario_id}, month 60: ${(r.coverage_month60_median * 100).toFixed(1)}% (95% simulation interval ${(r.coverage_month60_p025 * 100).toFixed(1)}% to ${(r.coverage_month60_p975 * 100).toFixed(1)}%)`}</title>
            </circle>
            <text x={x(r.coverage_month60_median) + 9} y={cy + 10} fontSize={10} fill="#37474f">
              {`${(r.coverage_month60_median * 100).toFixed(1)}%`}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
