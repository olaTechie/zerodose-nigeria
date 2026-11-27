import TypologyBadge from './TypologyBadge';

export default function PolicyBriefCard({ typology, content }) {
  if (!content) return null;
  return (
    <div className="policy-brief-card glass-card" style={{ borderTop: '3px solid #006633' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{content.title}</h3>
        <TypologyBadge typology={typology} />
      </div>

      <Section heading="Key Finding" text={content.keyFinding} />
      <Section heading="Recommended Action" text={content.recommendedAction} />
      <Section heading="Expected Impact" text={content.expectedImpact} />
      <Section heading="Evidence Quality" text={content.evidenceQuality} />
    </div>
  );
}

function Section({ heading, text }) {
  return (
    <div style={{ marginBottom: '0.85rem' }}>
      <h4 style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', color: '#006633', marginBottom: '0.25rem' }}>
        {heading}
      </h4>
      <p style={{ fontSize: '0.88rem', color: '#0d1b2a', lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}
