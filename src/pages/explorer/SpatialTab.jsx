import { useState } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import MetricCard from '../../components/shared/MetricCard';
import NigeriaMap from '../../components/maps/NigeriaMap';
import MoranScatter from '../../components/charts/MoranScatter';
import FunnelPlot from '../../components/charts/FunnelPlot';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { PIPELINE_METRICS } from '../../data/constants';
import { getPrevalenceColorScale } from '../../components/maps/ChoroplethLayer';

export default function SpatialTab() {
  const { data: stateData } = useData('state_prevalence.json');
  const { data: lisaData } = useData('lisa_clusters.json');
  const [showLisa, setShowLisa] = useState(false);

  const colorScale = getPrevalenceColorScale(90);
  const stateProps = stateData?.features?.map((f) => f.properties) || [];
  const lisaProps = lisaData?.features?.map((f) => f.properties) || [];

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.spatial}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <MetricCard label="Moran's I" value={PIPELINE_METRICS.morans_i.toFixed(4)} color="green" />
        <MetricCard label="Z-score" value={PIPELINE_METRICS.morans_z.toFixed(2)} color="gold" />
        <MetricCard label="P-value" value={`<0.001`} color="red" />
        <MetricCard label="HH Hotspots" value={PIPELINE_METRICS.n_lisa_hotspots.toString()} color="red" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 55%', minWidth: '300px' }}>
          <GlassCard>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                {showLisa ? 'LISA Clusters' : 'State Prevalence'}
              </h3>
              <button
                onClick={() => setShowLisa(!showLisa)}
                style={{ padding: '0.3rem 0.7rem', borderRadius: '50px', border: '1px solid #006633', background: showLisa ? '#006633' : '#fff', color: showLisa ? '#fff' : '#006633', fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer' }}
              >
                {showLisa ? 'Prevalence' : 'LISA'}
              </button>
            </div>
            <NigeriaMap
              stateData={!showLisa ? stateData : null}
              lisaData={showLisa ? lisaData : null}
              showLisa={showLisa}
              colorScale={colorScale}
              colorByField="weighted_prevalence"
              height={400}
            />
          </GlassCard>
        </div>

        <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
          <GlassCard>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Moran Scatterplot
            </h3>
            <MoranScatter states={lisaProps.length ? lisaProps : stateProps} moranI={PIPELINE_METRICS.morans_i} />
          </GlassCard>
        </div>
      </div>

      <GlassCard style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Funnel Plot</h3>
        <FunnelPlot states={stateProps} nationalMean={PIPELINE_METRICS.weighted_zd_prevalence} />
      </GlassCard>
    </div>
  );
}
