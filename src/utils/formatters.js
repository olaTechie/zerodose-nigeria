export function formatPercent(v, digits = 1) {
  if (v == null) return '--';
  return `${(v * 100).toFixed(digits)}%`;
}

export function formatNumber(v) {
  if (v == null) return '--';
  return v.toLocaleString('en-US');
}

export function formatDelta(v, baseline) {
  if (v == null || baseline == null) return '--';
  const delta = v - baseline;
  const sign = delta >= 0 ? '+' : '';
  return `${sign}${(delta * 100).toFixed(1)}pp`;
}

export function formatPValue(p) {
  if (p == null) return '--';
  if (typeof p === 'string') return p;
  if (p < 0.001) return '<0.001';
  return p.toFixed(3);
}
