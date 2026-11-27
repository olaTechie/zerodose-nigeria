import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ErrorState from '../../components/shared/ErrorState';
import ShapBarChart from '../../components/charts/ShapBarChart';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { PIPELINE_METRICS, ZONE_LABELS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

const ZONE_ORDER = ['NC', 'NE', 'NW', 'SE', 'SS', 'SW'];

export default function RiskTab() {
  const { data: shapData, loading: l1, error: e1, retry: r1 } = useData('shap_importance.json');

  if (e1) return <ErrorState onRetry={r1} />;
  if (l1) return <LoadingSpinner />;

  const globalShap = shapData?.global || [];
  const byZone = shapData?.byZone || {};

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.risk}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricCard label="AUC-ROC" value={PIPELINE_METRICS.model_auc_roc.toFixed(3)} sublabel={`95% CI ${PIPELINE_METRICS.model_auc_ci[0].toFixed(3)} to ${PIPELINE_METRICS.model_auc_ci[1].toFixed(3)}`} color="green" />
        <MetricCard label="AUC without card" value={PIPELINE_METRICS.model_auc_card_free.toFixed(3)} sublabel={`95% CI ${PIPELINE_METRICS.model_auc_card_free_ci[0].toFixed(3)} to ${PIPELINE_METRICS.model_auc_card_free_ci[1].toFixed(3)}`} color="green" />
        {globalShap[0] && <MetricCard label="Top SHAP" value={globalShap[0].display} sublabel={`mean |SHAP| ${globalShap[0].shap.toFixed(2)}`} color="gold" />}
        {globalShap[1] && <MetricCard label="#2 SHAP" value={globalShap[1].display} sublabel={`mean |SHAP| ${globalShap[1].shap.toFixed(2)}`} color="gold" />}
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 55%', minWidth: '300px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>SHAP Feature Importance</h3>
            <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.5rem' }}>
              Mean absolute SHAP value (log-odds), committed model. SHAP describes how the model uses each variable, not causal effects.
            </p>
            <ShapBarChart data={globalShap} maxFeatures={20} />
          </GlassCard>
        </div>

        <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: '0 0 0.25rem' }}>Top Five Predictors by Zone</h3>
            <p style={{ fontSize: '0.78rem', color: '#78909c', margin: '0 0 0.5rem' }}>
              Mean absolute SHAP value within each geopolitical zone (committed model).
            </p>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.76rem' }}>
                <thead>
                  <tr>
                    <th style={thStyle}>Zone</th>
                    <th style={thStyle}>Top five (mean |SHAP|)</th>
                  </tr>
                </thead>
                <tbody>
                  {ZONE_ORDER.filter((z) => byZone[z]).map((z) => (
                    <tr key={z}>
                      <td style={{ ...tdStyle, fontWeight: 600, whiteSpace: 'nowrap', verticalAlign: 'top' }}>{ZONE_LABELS[z] || z}</td>
                      <td style={{ ...tdStyle, fontSize: '0.76rem' }}>
                        {byZone[z].slice(0, 5).map((f) => `${f.display} (${f.shap.toFixed(2)})`).join('; ')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

