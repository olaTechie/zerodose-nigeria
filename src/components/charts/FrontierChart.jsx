import { SCENARIO_COLOURS } from '../../data/constants';

/**
 * Cost-effectiveness plane with the efficiency frontier for one community type.
 * x = DALYs averted, y = incremental cost against the status quo (USD).
 * Points on the frontier are joined in cost order; dominated and extendedly
 * dominated packages are shown as hollow markers.
 */
export default function FrontierChart({ rows = [], typology }) {
  const data = rows.filter((r) => r.typology === typology);
  if (!data.length) return null;

  const W = 520;
  const H = 340;
  const m = { l: 64, r: 20, t: 18, b: 46 };
  const pw = W - m.l - m.r;
  const ph = H - m.t - m.b;

  const xMax = Math.ceil(Math.max(...data.map((d) => d.dalys)) / 10000) * 10000;
  const yMaxRaw = Math.max(...data.map((d) => d.cost));
  const yMax = Math.ceil(yMaxRaw / 5e6) * 5e6;
  const yMin = -0.05 * yMax;
  const x = (v) => m.l + (v / xMax) * pw;
  const y = (v) => m.t + ph - ((v - yMin) / (yMax - yMin)) * ph;

  const frontier = data
    .filter((d) => d.status === 'frontier')
    .sort((a, b) => a.cost - b.cost);
  const s0 = data.find((d) => d.scenario_id === 'S0');
  const path = [s0, ...frontier].filter(Boolean);

  const xStep = xMax > 80000 ? 20000 : 10000;
  const xTicks = [];
  for (let v = 0; v <= xMax; v += xStep) xTicks.push(v);
  const yTicks = [];
  for (let v = 0; v <= yMax; v += 5e6) yTicks.push(v);

  // label offsets to keep the near-origin points legible
  const offsets = { S0: [-14, 14], S3: [6, 16], S1: [6, -8], S2: [8, 4], S4: [-26, -8], S5: [8, 4] };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      style={{ width: '100%', height: 'auto', display: 'block', fontFamily: 'Inter, sans-serif' }}
      role="img"
      aria-label={`Cost against DALYs averted with the efficiency frontier, ${typology} communities`}
    >
      {yTicks.map((v) => (
        <g key={`y${v}`}>
          <line x1={m.l} x2={W - m.r} y1={y(v)} y2={y(v)} stroke="#e6e9e6" />
          <text x={m.l - 8} y={y(v) + 4} fontSize={10} fill="#546e7a" textAnchor="end">{`${(v / 1e6).toFixed(0)}M`}</text>
        </g>
      ))}
      {xTicks.map((v) => (
        <g key={`x${v}`}>
          <line x1={x(v)} x2={x(v)} y1={m.t} y2={m.t + ph} stroke="#f0f2f0" />
          <text x={x(v)} y={m.t + ph + 16} fontSize={10} fill="#546e7a" textAnchor="middle">{`${Math.round(v / 1000)}k`}</text>
        </g>
      ))}
      <text x={m.l + pw / 2} y={H - 8} fontSize={11} fill="#546e7a" textAnchor="middle">DALYs averted against status quo</text>
      <text transform={`translate(14, ${m.t + ph / 2}) rotate(-90)`} fontSize={11} fill="#546e7a" textAnchor="middle">Incremental cost (USD)</text>

      <polyline
        points={path.map((d) => `${x(d.dalys)},${y(d.cost)}`).join(' ')}
        fill="none"
        stroke="#006633"
        strokeWidth={2}
      />

      {data.map((d) => {
        const onFrontier = d.status === 'frontier';
        const color = SCENARIO_COLOURS[d.scenario_id] || '#555';
        const [dx, dy] = offsets[d.scenario_id] || [8, 4];
        return (
          <g key={d.scenario_id}>
            <circle
              cx={x(d.dalys)}
              cy={y(d.cost)}
              r={6}
              fill={onFrontier ? color : '#fff'}
              stroke={color}
              strokeWidth={2}
            >
              <title>{`${d.scenario_id}: cost USD ${Math.round(d.cost).toLocaleString('en-GB')}, DALYs averted ${Math.round(d.dalys).toLocaleString('en-GB')} (${d.status})`}</title>
            </circle>
            <text x={x(d.dalys) + dx} y={y(d.cost) + dy} fontSize={11} fontWeight={700} fill="#0d1b2a">{d.scenario_id}</text>
          </g>
        );
      })}

      <g transform={`translate(${m.l + 8}, ${m.t + 6})`}>
        <circle cx={5} cy={4} r={5} fill="#006633" />
        <text x={14} y={8} fontSize={10} fill="#37474f">On frontier</text>
        <circle cx={90} cy={4} r={5} fill="#fff" stroke="#546e7a" strokeWidth={2} />
        <text x={99} y={8} fontSize={10} fill="#37474f">Dominated or extendedly dominated</text>
      </g>
    </svg>
  );
}
