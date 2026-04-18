// DecisionTreeSVG — shared component for the two-typology / two-recipe decision rule.
// Lifted from src/pages/Story.jsx so it can be reused on Landing in the
// OperationalHeadlinePanel.

export default function DecisionTreeSVG() {
  return (
    <svg
      viewBox="0 0 400 350"
      role="img"
      aria-label="Decision tree showing two community types and their recommended intervention strategies"
      style={{
        width: '100%',
        height: 'auto',
        maxWidth: '400px',
        margin: '0 auto',
        display: 'block',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* Root node */}
      <rect x="130" y="10" width="140" height="40" rx="8" fill="#006633" />
      <text x="200" y="35" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Community type?</text>

      {/* Branches */}
      <line x1="170" y1="50" x2="100" y2="100" stroke="#546e7a" strokeWidth="2" />
      <line x1="230" y1="50" x2="300" y2="100" stroke="#546e7a" strokeWidth="2" />

      {/* Labels */}
      <text x="120" y="80" textAnchor="middle" fontSize="10" fill="#546e7a" fontWeight="600">Reference</text>
      <text x="280" y="80" textAnchor="middle" fontSize="10" fill="#546e7a" fontWeight="600">Access-Constrained</text>

      {/* Left leaf */}
      <rect x="20" y="100" width="160" height="100" rx="8" fill="#e8f5e9" stroke="#2e7d32" strokeWidth="1.5" />
      <text x="100" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2e7d32">Outreach only (S1)</text>
      <text x="100" y="145" textAnchor="middle" fontSize="10" fill="#546e7a">Deploy mobile teams</text>
      <text x="100" y="175" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2e7d32">86.1%</text>
      <text x="100" y="192" textAnchor="middle" fontSize="9" fill="#78909c">60.9% of communities</text>

      {/* Right leaf */}
      <rect x="220" y="100" width="160" height="100" rx="8" fill="#e3f2fd" stroke="#1565c0" strokeWidth="1.5" />
      <text x="300" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1565c0">Full package (S5)</text>
      <text x="300" y="145" textAnchor="middle" fontSize="10" fill="#546e7a">Outreach + engage + supply</text>
      <text x="300" y="175" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1565c0">82.0%</text>
      <text x="300" y="192" textAnchor="middle" fontSize="9" fill="#78909c">39.1% of communities</text>

      {/* 80% target line */}
      <line x1="0" y1="240" x2="400" y2="240" stroke="#d32f2f" strokeWidth="1" strokeDasharray="6,3" />
      <text x="200" y="258" textAnchor="middle" fontSize="10" fill="#d32f2f" fontWeight="600">80% coverage target</text>

      {/* Footer */}
      <text x="200" y="300" textAnchor="middle" fontSize="11" fill="#0d1b2a" fontWeight="600">
        Two community types. Two intervention strategies.
      </text>
      <text x="200" y="320" textAnchor="middle" fontSize="11" fill="#0d1b2a" fontWeight="600">
        One unified targeting rule.
      </text>
    </svg>
  );
}
