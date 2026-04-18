import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import RecipeCard from '../../components/shared/RecipeCard';
import NecessityBar from '../../components/charts/NecessityBar';
import RobustnessHeatmap from '../../components/charts/RobustnessHeatmap';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { recipePlainLanguage, typologyGuidance } from '../../data/storyContent';
import { PIPELINE_METRICS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

export default function CNATab() {
  const { data: cnaData, loading, error } = useData('cna_solutions.json');

  if (error) return <div style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;
  if (loading) return <LoadingSpinner />;

  const solutions = cnaData?.solutions || [];
  const necessity = cnaData?.necessity || [];
  const robustness = cnaData?.robustness || [];
  const typStratified = cnaData?.translations?.typologyStratified || {};

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.cna}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricCard label="Positive Outcomes" value={`${PIPELINE_METRICS.n_positive_outcomes}/${PIPELINE_METRICS.n_total_scenarios}`} color="green" />
        <MetricCard label="Solutions" value={solutions.length.toString()} color="gold" />
        <MetricCard label="Top Consistency" value={solutions[0]?.consistency?.toFixed(2) || '--'} color="green" />
      </div>

      {/* Primary solutions */}
      <GlassCard>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Primary Solutions (CSF)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
            <thead>
              <tr>
                <th style={thStyle}>Condition</th>
                <th style={thStyle}>Consistency</th>
                <th style={thStyle}>Coverage</th>
                <th style={thStyle}>Complexity</th>
              </tr>
            </thead>
            <tbody>
              {solutions.map((s, i) => (
                <tr key={i}>
                  <td style={{ ...tdStyle, fontFamily: "'Courier New', monospace", fontSize: '0.78rem' }}>
                    {s.condition}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center', fontWeight: 700, color: s.consistency >= 0.9 ? '#006633' : '#cc8400' }}>
                    {s.consistency.toFixed(3)}
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{s.coverage.toFixed(3)}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>{s.complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Necessity */}
      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Necessity Analysis</h3>
        <NecessityBar data={necessity} threshold={0.75} />
      </GlassCard>

      {/* Robustness */}
      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Robustness Across Thresholds</h3>
        <RobustnessHeatmap data={robustness} />
      </GlassCard>

      {/* Typology-stratified */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1rem' }}>
        {Object.entries(typStratified).map(([typ, recipes]) => (
          <div key={typ} style={{ flex: '1 1 45%', minWidth: '300px' }}>
            <GlassCard>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{typ}</h3>
              {recipes.map((r, i) => (
                <RecipeCard
                  key={i}
                  formula={r.formula}
                  translation={r.translation}
                  consistency={r.consistency}
                  coverage={r.coverage}
                />
              ))}
            </GlassCard>
          </div>
        ))}
      </div>

      {/* Expanded recipe translations */}
      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Plain-Language Recipe Translations</h3>
        {Object.entries(recipePlainLanguage).map(([key, recipe]) => (
          <RecipeCard
            key={key}
            formula={recipe.formula}
            translation={recipe.translation}
            consistency={recipe.consistency}
            coverage={recipe.coverage}
          />
        ))}
      </GlassCard>
    </div>
  );
}

