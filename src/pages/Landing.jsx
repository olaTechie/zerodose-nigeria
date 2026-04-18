import { useNavigate } from 'react-router-dom';
import SiteNav from '../components/shared/SiteNav';
import NavCard from '../components/shared/NavCard';
import CountUpNumber from '../components/shared/CountUpNumber';
import OperationalHeadlinePanel from '../components/shared/OperationalHeadlinePanel';
import { PIPELINE_METRICS } from '../data/constants';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <SiteNav activePage="home" />
      {/* Hero */}
      <div className="hero-section" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 0 }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem', width: '100%' }}>
          <div className="hero-overline">Nigeria DHS 2024 | Integrated ML-ABM-CNA Framework</div>
          <h1 className="hero-title" style={{ maxWidth: '750px' }}>
            Trust, Access, and Causal Recipes for Vaccination Coverage Recovery in Nigeria
          </h1>
          <p className="hero-subtitle">
            An integrated machine learning, agent-based modelling, and coincidence analysis pipeline
            identifying the minimal intervention bundles needed to reach 80% Pentavalent-1 coverage
            in zero-dose communities across Nigeria.
          </p>
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat-value">
                <CountUpNumber target={4875} decimals={0} />
              </div>
              <div className="hero-stat-label">Children analysed</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">
                <CountUpNumber target={36.8} suffix="%" decimals={1} />
              </div>
              <div className="hero-stat-label">Zero-dose prevalence</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">
                <CountUpNumber target={1283} decimals={0} />
              </div>
              <div className="hero-stat-label">Communities simulated</div>
            </div>
            <div className="hero-stat">
              <div className="hero-stat-value">{PIPELINE_METRICS.model_auc_roc.toFixed(3)}</div>
              <div className="hero-stat-label">ML model AUC</div>
            </div>
          </div>
        </div>
      </div>

      {/* Operational headline panel — page lede beneath the hero */}
      <OperationalHeadlinePanel />

      {/* Audience cards */}
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#003d1e', textAlign: 'center', marginBottom: '0.5rem' }}>
          Choose your experience
        </h2>
        <p style={{ textAlign: 'center', color: '#546e7a', fontSize: '0.9rem', marginBottom: '2rem' }}>
          Three ways to explore the evidence, tailored to different audiences.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          <NavCard
            icon="📖"
            title="The Story"
            description="A scrolling data narrative that walks you through the crisis, its geography, the machine learning insights, and the intervention recipes. Designed for policymakers, media, and general audiences."
            accentColor="#006633"
            onClick={() => navigate('/story')}
          />
          <NavCard
            icon="🎛️"
            title="Policy Dashboard"
            description="Interactive maps, intervention scenario comparisons, and a what-if explorer that lets you adjust outreach intensity and see projected coverage in real time. Designed for NPHCDA planners and state health officers."
            accentColor="#1565c0"
            onClick={() => navigate('/policy')}
          />
          <NavCard
            icon="🔬"
            title="Technical Explorer"
            description="Full pipeline outputs: weighted Table 1, SHAP importance, Moran's I scatterplots, LCA profiles, ABM trajectories, CNA solutions, and data downloads. Designed for researchers and reviewers."
            accentColor="#7b1fa2"
            onClick={() => navigate('/explorer/descriptive')}
          />
        </div>

        {/* Pipeline stages */}
        <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#003d1e', textAlign: 'center', marginBottom: '1.5rem' }}>
          Three-Stage Pipeline
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem', marginBottom: '3rem' }}>
          <StageCard
            number="1"
            title="Machine Learning"
            metrics={[
              { label: 'XGBoost AUC', value: PIPELINE_METRICS.model_auc_roc.toFixed(4) },
              { label: 'LCA Classes', value: PIPELINE_METRICS.lca_n_classes },
              { label: 'Typologies', value: '2' },
            ]}
            description="XGBoost identifies risk factors, LCA maps trust states, k-means defines community typologies."
          />
          <StageCard
            number="2"
            title="Agent-Based Digital Twin"
            metrics={[
              { label: 'Calibration RMSE', value: PIPELINE_METRICS.calibration_rmse.toFixed(3) },
              { label: 'Spearman r', value: PIPELINE_METRICS.validation_spearman_r.toFixed(3) },
              { label: 'Scenarios', value: '6 x 2' },
            ]}
            description="1,283 communities simulated with trust dynamics, peer influence, and intervention scenarios."
          />
          <StageCard
            number="3"
            title="Coincidence Analysis"
            metrics={[
              { label: 'Solutions', value: '4' },
              { label: 'Outreach necessity', value: '1.0' },
              { label: 'Robust', value: '5/5 thresholds' },
            ]}
            description="CNA identifies the minimal sufficient condition combinations for 80% coverage recovery."
          />
        </div>

        {/* Footer */}
        <footer style={{
          borderTop: '1px solid rgba(0,102,51,0.15)',
          paddingTop: '2rem',
          textAlign: 'center',
          color: '#78909c',
          fontSize: '0.8rem',
          lineHeight: 1.8,
        }}>
          <p>
            <strong>Data source:</strong> Nigeria Demographic and Health Survey (NDHS) 2024, 2018, 2013.
            <br />
            National Population Commission (NPC) [Nigeria] and ICF. Funded by USAID, DFID, UNFPA.
          </p>
          <p>
            <strong>Affiliation:</strong> Warwick Medical School, University of Warwick, UK.
          </p>
          <p style={{ marginTop: '0.5rem', color: '#bdbdbd' }}>
            Built with React, D3.js, and Vite. Pipeline last executed {PIPELINE_METRICS.pipeline_run_date}.
          </p>
        </footer>
      </div>
    </div>
  );
}

function StageCard({ number, title, metrics, description }) {
  return (
    <div className="glass-card" style={{ borderTop: '3px solid #006633' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: '#006633', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 800, fontSize: '1.1rem',
        }}>
          {number}
        </div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0 }}>{title}</h3>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#546e7a', lineHeight: 1.55, marginBottom: '0.75rem' }}>
        {description}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        {metrics.map((m) => (
          <div key={m.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#006633' }}>{m.value}</div>
            <div style={{ fontSize: '0.68rem', color: '#78909c', textTransform: 'uppercase', letterSpacing: '0.3px' }}>{m.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
