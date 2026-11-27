export default function MetricCard({ label, value, sublabel, color = 'green' }) {
  const colorClass = `metric-card-${color}`;
  return (
    <div className={`metric-card ${colorClass}`}>
      <div className="metric-value">{value}</div>
      <div className="metric-label">{label}</div>
      {sublabel && <div className="metric-sublabel">{sublabel}</div>}
    </div>
  );
}
