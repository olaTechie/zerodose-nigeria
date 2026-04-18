import StaticFigure from '../shared/StaticFigure';
import KeyFiguresList from '../shared/KeyFiguresList';
import OperationalHeadline from '../shared/OperationalHeadline';
import { PIPELINE_METRICS } from '../../data/constants';

// EditorialHero pattern (design brief §6): flat neutral background, headline +
// standfirst on the left. The four-stat strip is replaced by a single
// OperationalHeadline (mode="hero") followed by a KeyFiguresList secondary
// panel — the four stats are no longer the hero. No count-ups, no animated
// gradient, no glassy stat boxes, no pulse decoration.
export default function StoryHero() {
  return (
    <>
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
          <p
            style={{
              fontSize: '1.0625rem',
              color: '#1c211d',
              lineHeight: 1.55,
              maxWidth: '60ch',
              margin: '0 0 2rem 0',
            }}
          >
            More than one in three Nigerian children never receives a first dose of the
            pentavalent vaccine. This data story traces the crisis from geography to drivers
            to solutions &mdash; powered by machine learning, agent-based simulation, and
            coincidence analysis.
          </p>

          <div style={{ marginTop: '2rem', fontSize: '0.8125rem', color: '#697269', letterSpacing: '0.04em' }}>
            Scroll to begin {'\u2193'}
          </div>
        </div>
      </section>

      {/* Operational headline — page lede after the standfirst */}
      <section style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 2rem' }}>
        <OperationalHeadline mode="hero" />
      </section>

      {/* Key figures secondary panel — replaces the 4-stat hero strip */}
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
          Pipeline at a glance
        </div>
        <KeyFiguresList
          items={[
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
              label: 'Children analysed',
              value: <StaticFigure value={PIPELINE_METRICS.n_children} decimals={0} />,
              source: 'outputs/stage1/eda/eda_summary_stats.csv',
            },
            {
              label: 'Communities',
              value: <StaticFigure value={PIPELINE_METRICS.n_clusters} decimals={0} />,
              source: 'outputs/stage1/ml_to_abm_params.json',
            },
            {
              label: 'Model AUC-ROC',
              value: <StaticFigure value={PIPELINE_METRICS.model_auc_roc} decimals={3} />,
              source: 'outputs/stage1/ml_to_abm_params.json',
            },
          ]}
        />
      </section>
    </>
  );
}
