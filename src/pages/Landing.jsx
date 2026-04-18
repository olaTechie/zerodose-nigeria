import { useNavigate } from 'react-router-dom';
import AudienceEntryBlock from '../components/shared/AudienceEntryBlock';
import OperationalHeadline from '../components/shared/OperationalHeadline';
import KeyFiguresList from '../components/shared/KeyFiguresList';
import StaticFigure from '../components/shared/StaticFigure';
import { PIPELINE_METRICS } from '../data/constants';

// Landing — editorial first impression. Flat neutral hero (no animated gradient,
// no glassy stat boxes); the operational headline is the page lede; key figures
// move into a secondary panel below the headline (per design brief §6 cut list,
// item: 4-stat hero strip → KeyFiguresList).
export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ background: '#fbfcfb', minHeight: '100vh' }}>
      {/* Editorial hero — headline + standfirst, no four-stat strip */}
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
            Nigeria DHS 2024 &middot; Integrated ML-ABM-CNA Framework
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
            More than one in three Nigerian children never receives a single vaccine.
          </h1>
          <p
            style={{
              fontSize: '1.0625rem',
              color: '#1c211d',
              lineHeight: 1.55,
              maxWidth: '60ch',
              margin: '0 0 1.5rem 0',
            }}
          >
            Two community types. Two recipes. One unified targeting rule. An integrated
            machine learning, agent-based modelling, and coincidence analysis pipeline
            that identifies the minimal intervention bundles to reach 80% Pentavalent-1
            coverage in zero-dose communities across Nigeria.
          </p>
        </div>
      </section>

      {/* Operational headline — page lede (replaces 4-stat hero) */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <OperationalHeadline mode="hero" />
      </section>

      {/* Key figures — secondary panel below the headline */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '2.5rem 2rem',
          borderBottom: '1px solid #c7cfc7',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#697269',
            marginBottom: '1rem',
          }}
        >
          Key figures
        </div>
        <KeyFiguresList
          items={[
            {
              label: 'Children analysed',
              value: <StaticFigure value={PIPELINE_METRICS.n_children} decimals={0} />,
              source: 'outputs/stage1/eda/eda_summary_stats.csv',
            },
            {
              label: 'ML model AUC',
              value: <StaticFigure value={PIPELINE_METRICS.model_auc_roc} decimals={3} />,
              source: 'outputs/stage1/ml_to_abm_params.json',
            },
            {
              label: 'Zero-dose prevalence',
              value: (
                <StaticFigure
                  value={PIPELINE_METRICS.weighted_zd_prevalence * 100}
                  suffix="%"
                  decimals={1}
                />
              ),
              source: 'outputs/stage1/eda/eda_summary_stats.csv',
            },
            {
              label: 'S5 coverage (Access-Constrained)',
              value: <StaticFigure value={82.0} suffix="%" decimals={1} />,
              source: 'outputs/stage2/abm_to_cna_matrix.csv',
            },
          ]}
        />
      </section>

      {/* Audience entry blocks */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '4rem 2rem 2rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#697269',
            marginBottom: '0.5rem',
          }}
        >
          Choose your experience
        </div>
        <h2
          className="font-serif"
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#1c211d',
            margin: '0 0 1.5rem 0',
          }}
        >
          Three ways to read the evidence
        </h2>

        <div>
          <AudienceEntryBlock
            eyebrow="For policy makers"
            title="The Story"
            description="A scrolling data narrative that walks you through the crisis, its geography, the machine learning insights, and the intervention recipes. Designed for policy makers, media, and general audiences."
            cta="Read the story"
            onClick={() => navigate('/story')}
          />
          <AudienceEntryBlock
            eyebrow="For state officials"
            title="Policy Dashboard"
            description="Interactive maps, intervention scenario comparisons, and a what-if explorer that lets you adjust outreach intensity and see projected coverage in real time. Designed for NPHCDA planners and state health officers."
            cta="Open the policy console"
            onClick={() => navigate('/policy')}
          />
          <AudienceEntryBlock
            eyebrow="For researchers"
            title="Technical Explorer"
            description="Full pipeline outputs: weighted Table 1, SHAP importance, Moran's I scatterplots, LCA profiles, ABM trajectories, CNA solutions, and data downloads. Designed for researchers and reviewers."
            cta="Inspect the methods"
            onClick={() => navigate('/explorer/descriptive')}
          />
        </div>
      </section>

      {/* Pipeline stages as editorial blocks */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '2rem 2rem 4rem' }}>
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 500,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#697269',
            marginBottom: '0.5rem',
          }}
        >
          Method
        </div>
        <h2
          className="font-serif"
          style={{
            fontSize: '1.5rem',
            fontWeight: 500,
            color: '#1c211d',
            margin: '0 0 1.5rem 0',
          }}
        >
          Three-stage pipeline
        </h2>

        <div>
          <StageBlock
            number="1"
            title="Machine learning"
            metrics={[
              { label: 'XGBoost AUC', value: PIPELINE_METRICS.model_auc_roc.toFixed(4) },
              { label: 'LCA classes', value: PIPELINE_METRICS.lca_n_classes },
              { label: 'Typologies', value: '2' },
            ]}
            description="XGBoost identifies risk factors, LCA maps trust states, k-means defines community typologies."
          />
          <StageBlock
            number="2"
            title="Agent-based digital twin"
            metrics={[
              { label: 'Calibration RMSE', value: PIPELINE_METRICS.calibration_rmse.toFixed(3) },
              { label: 'Spearman r', value: PIPELINE_METRICS.validation_spearman_r.toFixed(3) },
              { label: 'Scenarios', value: '6 \u00d7 2' },
            ]}
            description="1,283 communities simulated with trust dynamics, peer influence, and intervention scenarios."
          />
          <StageBlock
            number="3"
            title="Coincidence analysis"
            metrics={[
              { label: 'Solutions', value: '4' },
              { label: 'Outreach necessity', value: '1.0' },
              { label: 'Robust', value: '5/5 thresholds' },
            ]}
            description="CNA identifies the minimal sufficient condition combinations for 80% coverage recovery."
          />
        </div>

        {/* Footer */}
        <footer
          style={{
            borderTop: '1px solid #c7cfc7',
            paddingTop: '2rem',
            marginTop: '3rem',
            color: '#697269',
            fontSize: '0.8125rem',
            lineHeight: 1.7,
          }}
        >
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Data source:</strong> Nigeria Demographic and Health Survey (NDHS) 2024, 2018, 2013.
            National Population Commission (NPC) [Nigeria] and ICF. Funded by USAID, DFID, UNFPA.
          </p>
          <p style={{ margin: '0 0 0.5rem 0' }}>
            <strong>Affiliation:</strong> Warwick Medical School, University of Warwick, UK.
          </p>
          <p style={{ margin: 0, color: '#9aa19a' }}>
            Built with React, D3.js, and Vite. Pipeline executed 2026-03-24.
          </p>
        </footer>
      </section>
    </div>
  );
}

function StageBlock({ number, title, metrics, description }) {
  return (
    <article
      style={{
        borderTop: '1px solid #c7cfc7',
        paddingTop: '1.5rem',
        paddingBottom: '1.5rem',
      }}
    >
      <div
        style={{
          fontSize: '0.75rem',
          fontWeight: 500,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: '#697269',
          marginBottom: '0.4rem',
        }}
      >
        Stage {number}
      </div>
      <h3
        className="font-serif"
        style={{
          fontSize: '1.375rem',
          fontWeight: 600,
          margin: '0 0 0.5rem 0',
          color: '#1c211d',
          lineHeight: 1.3,
        }}
      >
        {title}
      </h3>
      <p
        style={{
          fontSize: '0.9375rem',
          color: '#697269',
          lineHeight: 1.6,
          margin: '0 0 1rem 0',
          maxWidth: '70ch',
        }}
      >
        {description}
      </p>
      <dl style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', margin: 0 }}>
        {metrics.map((m) => (
          <div key={m.label}>
            <dt
              style={{
                fontSize: '0.6875rem',
                color: '#697269',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                marginBottom: '0.15rem',
              }}
            >
              {m.label}
            </dt>
            <dd
              className="font-serif"
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: '#003d1e',
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {m.value}
            </dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
