import CountUpNumber from '../shared/CountUpNumber';

export default function StoryHero() {
  return (
    <div className="hero-section" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="hero-overline">NDHS 2024 | ML + ABM + CNA Pipeline</div>
      <h1 className="hero-title" style={{ maxWidth: '700px' }}>
        Zero-Dose Children in Nigeria
      </h1>
      <p className="hero-subtitle">
        More than one in three Nigerian children never receives a first dose of the pentavalent
        vaccine. This data story traces the crisis from geography to drivers to solutions
        -- powered by machine learning, agent-based simulation, and causal analysis.
      </p>
      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-value">
            <CountUpNumber target={36.8} suffix="%" decimals={1} />
          </div>
          <div className="hero-stat-label">Zero-dose prevalence</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">
            <CountUpNumber target={4875} decimals={0} />
          </div>
          <div className="hero-stat-label">Children analysed</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">
            <CountUpNumber target={1283} decimals={0} />
          </div>
          <div className="hero-stat-label">Communities</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-value">0.972</div>
          <div className="hero-stat-label">Model AUC-ROC</div>
        </div>
      </div>
      <div style={{ marginTop: '2rem', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>
          Scroll to begin the story
        </span>
        <div style={{ marginTop: '0.5rem', animation: 'pulse 2.5s ease-in-out infinite', fontSize: '1.5rem' }}>
          {'\u2193'}
        </div>
      </div>
    </div>
  );
}
