import { useEffect, useRef } from 'react';
import { getCoverageTier } from '../../utils/coverageTier';

export default function CoverageGauge({ value = 0, size = 200, animated = true }) {
  const pathRef = useRef(null);
  const tier = getCoverageTier(value);

  // Semicircle gauge
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = size / 2 - 20;
  const circumference = Math.PI * r;
  const offset = circumference * (1 - Math.min(value, 1));

  useEffect(() => {
    if (animated && pathRef.current) {
      pathRef.current.style.transition = 'stroke-dashoffset 0.8s ease-out';
    }
  }, [animated, value]);

  return (
    <div style={{ textAlign: 'center' }}>
      <svg width={size} height={size / 2 + 40} viewBox={`0 0 ${size} ${size / 2 + 40}`} role="img" aria-label={`Coverage gauge showing ${(value * 100).toFixed(1)}% — ${tier.label}`}>
        {/* Background arc */}
        <path
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={14}
          strokeLinecap="round"
        />
        {/* Value arc */}
        <path
          ref={pathRef}
          d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
          fill="none"
          stroke={tier.color}
          strokeWidth={14}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
        {/* 80% target marker */}
        {(() => {
          const angle = Math.PI * (1 - 0.8);
          const mx = cx + r * Math.cos(angle);
          const my = cy - r * Math.sin(angle);
          return (
            <g>
              <line
                x1={mx}
                y1={my - 10}
                x2={mx}
                y2={my + 10}
                stroke="#d32f2f"
                strokeWidth={2}
                strokeDasharray="3,2"
              />
              <text x={mx + 5} y={my - 12} fontSize="10" fill="#d32f2f" fontWeight="600">
                80%
              </text>
            </g>
          );
        })()}
        {/* Center value */}
        <text x={cx} y={cy - 10} textAnchor="middle" fontSize="28" fontWeight="800" fill={tier.color}>
          {(value * 100).toFixed(1)}%
        </text>
        <text x={cx} y={cy + 10} textAnchor="middle" fontSize="11" fill="#78909c" fontWeight="500">
          {tier.label}
        </text>
      </svg>
    </div>
  );
}
