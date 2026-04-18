import { useState } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import ShapBarChart from '../../components/charts/ShapBarChart';
import ShapBeeswarm from '../../components/charts/ShapBeeswarm';
import NigeriaMap from '../../components/maps/NigeriaMap';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { PIPELINE_METRICS } from '../../data/constants';
import { getClusterColorByZdRate } from '../../components/maps/ClusterLayer';
import { activeToggleBtn, inactiveToggleBtn } from '../../styles/buttonStyles';

export default function RiskTab() {
  const { data: shapData, loading: l1, error: e1 } = useData('shap_importance.json');
  const { data: clusterData, loading: l2, error: e2 } = useData('cluster_map.geojson');
  const { data: stateData, loading: l3, error: e3 } = useData('state_prevalence.json');
  const [view, setView] = useState('bar');

  if (e1 || e2 || e3) return <div style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;
  if (l1 || l2 || l3) return <LoadingSpinner />;

  const globalShap = shapData?.global || [];

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.risk}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricCard label="AUC-ROC" value={PIPELINE_METRICS.model_auc_roc.toFixed(4)} color="green" />
        <MetricCard label="Top SHAP" value="Cluster DPT1" sublabel="1.62" color="gold" />
        <MetricCard label="#2 SHAP" value="Vax card" sublabel="1.34" color="gold" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 55%', minWidth: '300px' }}>
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>SHAP Feature Importance</h3>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                <button
                  onClick={() => setView('bar')}
                  style={view === 'bar' ? activeToggleBtn : inactiveToggleBtn}
                >
                  Bar
                </button>
                <button
                  onClick={() => setView('beeswarm')}
                  style={view === 'beeswarm' ? activeToggleBtn : inactiveToggleBtn}
                >
                  Beeswarm
                </button>
              </div>
            </div>
            {view === 'bar' ? (
              <ShapBarChart data={globalShap} maxFeatures={20} />
            ) : (
              <ShapBeeswarm data={globalShap} maxFeatures={15} />
            )}
          </GlassCard>
        </div>

        <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Cluster Risk Map</h3>
            <NigeriaMap
              stateData={stateData}
              clusterData={clusterData}
              showClusters={true}
              clusterColorFn={getClusterColorByZdRate}
              height={380}
            />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem', justifyContent: 'center' }}>
              {[
                { label: '>80%', color: '#6b1a1a' },
                { label: '60-80%', color: '#b33000' },
                { label: '40-60%', color: '#cc8400' },
                { label: '20-40%', color: '#006633' },
                { label: '<20%', color: '#1565c0' },
              ].map((l) => (
                <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.7rem' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block' }} />
                  {l.label}
                </span>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}

