import CountUpNumber from '../shared/CountUpNumber';

// EditorialHero pattern (design brief §6): flat neutral background, headline +
// standfirst on the left, key figures as a definition list. No animated gradient,
// no glassy stat boxes, no pulse decoration.
export default function StoryHero() {
  return (
    <section
      style={{
        background: '#f4f7f4',
        borderBottom: '1px solid #c7cfc7',
        padding: '5rem 2.5rem 4rem',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#697269',
            marginBottom: '0.75rem',
          }}
        >
          NDHS 2024 &middot; ML + ABM + CNA Pipeline
        </div>
        <h1
          className="font-serif"
          style={{
            fontSize: '3rem',
            fontWeight: 500,
            lineHeight: 1.1,
            color: '#1c211d',
            margin: '0 0 1rem 0',
            maxWidth: '24ch',
          }}
        >
          How we got here, and how we get out.
        </h1>
        <p style={{ fontSize: '1.0625rem', color: '#1c211d', lineHeight: 1.55, maxWidth: '60ch', margin: '0 0 2rem 0' }}>
          More than one in three Nigerian children never receives a first dose of the
          pentavalent vaccine. This data story traces the crisis from geography to drivers
          to solutions &mdash; powered by machine learning, agent-based simulation, and
          coincidence analysis.
        </p>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
            gap: '1.5rem',
            margin: 0,
            padding: '1.5rem 0 0',
            borderTop: '1px solid #c7cfc7',
          }}
        >
          <KeyFigure label="Zero-dose prevalence" value={<CountUpNumber target={36.8} suffix="%" decimals={1} />} />
          <KeyFigure label="Children analysed" value={<CountUpNumber target={4875} decimals={0} />} />
          <KeyFigure label="Communities" value={<CountUpNumber target={1283} decimals={0} />} />
          <KeyFigure label="Model AUC-ROC" value="0.972" />
        </dl>

        <div style={{ marginTop: '2rem', fontSize: '0.8125rem', color: '#697269', letterSpacing: '0.04em' }}>
          Scroll to begin {'\u2193'}
        </div>
      </div>
    </section>
  );
}

function KeyFigure({ label, value }) {
  return (
    <div>
      <dt
        style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#697269',
          marginBottom: '0.25rem',
        }}
      >
        {label}
      </dt>
      <dd
        className="font-serif"
        style={{
          fontSize: '2rem',
          lineHeight: 1.1,
          fontWeight: 500,
          color: '#003d1e',
          margin: 0,
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </dd>
    </div>
  );
}
