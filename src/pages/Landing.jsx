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
      <div className="hero-section landing-hero" style={{ minHeight: '70vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderRadius: 0 }}>
        <div className="landing-hero-inner">
          <div className="hero-overline">Nigeria DHS 2024 | Machine learning, linked simulation, cost-effectiveness</div>
          <h1 className="hero-title" style={{ maxWidth: '750px' }}>
            Who are the zero-dose children, and how do we reach them?
          </h1>
          <p className="hero-subtitle">
            A machine learning risk model linked to an agent-based simulation and a cost-effectiveness
            analysis, comparing intervention packages for reaching 80% DTP1 coverage in Nigeria&rsquo;s
            zero-dose communities.
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
              <div className="hero-stat-label">Survey clusters simulated</div>
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
      <div className="landing-main">
        <h2 className="section-kicker">
          Choose your experience
        </h2>
        <p className="section-intro">
          Three ways to explore the evidence, tailored to different audiences.
        </p>

        <div className="audience-grid">
          <NavCard
            icon="01"
            title="The Story"
            description="A scrolling data narrative that walks you through the crisis, its geography, who is at risk, the simulated intervention packages and what they cost. Designed for policymakers, media, and general audiences."
            accentColor="#006633"
            onClick={() => navigate('/story')}
          />
          <NavCard
            icon="02"
            title="Policy Dashboard"
            description="Interactive maps, simulated intervention scenarios, a scenario explorer showing simulated coverage and cost for each package, and policy briefs. Designed for NPHCDA planners and state health officers."
            accentColor="#1565c0"
            onClick={() => navigate('/policy')}
          />
          <NavCard
            icon="03"
            title="Technical Explorer"
            description="Full pipeline outputs: weighted Table 1, SHAP importance, fairness audit, Moran's I, engagement classes, simulated scenarios, intervention configurations, economic evaluation, and data downloads. Designed for researchers and reviewers."
            accentColor="#7b1fa2"
            onClick={() => navigate('/explorer/descriptive')}
          />
        </div>

        {/* Pipeline stages */}
        <h2 className="section-kicker">
          Analysis Pipeline
        </h2>

        <div className="pipeline-grid">
          <StageCard
            number="1"
            title="Machine Learning"
            metrics={[
              { label: 'XGBoost AUC', value: PIPELINE_METRICS.model_auc_roc.toFixed(3) },
              { label: 'Without card', value: PIPELINE_METRICS.model_auc_card_free.toFixed(3) },
              { label: 'Engagement classes', value: PIPELINE_METRICS.lca_n_classes },
            ]}
            description="XGBoost estimates zero-dose risk, latent class analysis describes caregivers' engagement with services, and k-means defines two community types."
          />
          <StageCard
            number="2"
            title="Linked Agent-Based Simulation"
            metrics={[
              { label: '2018 error', value: '3.9 pts' },
              { label: '2024 error', value: '7.0 pts' },
              { label: 'Scenarios', value: '6 x 2' },
            ]}
            description="38,490 virtual children in 1,283 survey clusters, calibrated to NDHS 2018 and 2024 (calibration fit; no independent validation), run for 60 months."
          />
          <StageCard
            number="3"
            title="Coincidence Analysis"
            metrics={[
              { label: 'Cells at 80%', value: '4/12' },
              { label: 'Outreach necessity', value: '1.00' },
              { label: 'Endpoint', value: 'Month 60' },
            ]}
            description="Coincidence Analysis identifies the intervention configurations among the simulated packages that reach 80% DTP1 coverage by month 60."
          />
          <StageCard
            number="4"
            title="Economic Evaluation"
            metrics={[
              { label: 'Supply only', value: 'Cost-saving' },
              { label: 'Full package beyond outreach', value: 'USD 1,094' },
            ]}
            description="Incremental cost-effectiveness: outreach is efficient at USD 800 per DALY averted; the full package costs USD 1,094 (Access-Constrained) and 1,889 (Reference) per DALY averted beyond outreach."
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
          <p style={{ maxWidth: '720px', margin: '0 auto 0.75rem' }}>
            Outputs are pre-computed from the NDHS 2024 analysis and are not connected to live health-system data.
            The simulation is calibrated to NDHS 2018 and 2024 and has no independent validation.
          </p>
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
