import TypologyBadge from './TypologyBadge';

// Policy brief — printable editorial article. No shadow, no rounded corners,
// no glass chrome. 1 px hairline top rule; print:break-inside-avoid for clean A4.
export default function PolicyBriefCard({ typology, content }) {
  if (!content) return null;
  return (
    <article
      style={{
        borderTop: '1px solid #c7cfc7',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
        breakInside: 'avoid',
      }}
      className="print:break-inside-avoid"
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
        <h3 className="font-serif" style={{ fontSize: '1.375rem', fontWeight: 600, margin: 0, lineHeight: 1.3, color: '#003d1e' }}>
          {content.title}
        </h3>
        <TypologyBadge typology={typology} />
      </div>

      <Section heading="Key finding" text={content.keyFinding} />
      <Section heading="Recommended action" text={content.recommendedAction} />
      <Section heading="Expected impact" text={content.expectedImpact} />
      <Section heading="Evidence quality" text={content.evidenceQuality} />
    </article>
  );
}

function Section({ heading, text }) {
  return (
    <div style={{ marginBottom: '1rem' }}>
      <h4
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: '#697269',
          margin: '0 0 0.25rem 0',
        }}
      >
        {heading}
      </h4>
      <p style={{ fontSize: '0.9375rem', color: '#1c211d', lineHeight: 1.6, margin: 0 }}>{text}</p>
    </div>
  );
}
