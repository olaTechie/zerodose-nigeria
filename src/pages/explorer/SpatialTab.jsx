import { useState } from 'react';
import EditorialBlock from '../../components/shared/EditorialBlock';
import KeyFigure from '../../components/shared/KeyFigure';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import NigeriaMap from '../../components/maps/NigeriaMap';
import MoranScatter from '../../components/charts/MoranScatter';
import FunnelPlot from '../../components/charts/FunnelPlot';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { PIPELINE_METRICS } from '../../data/constants';
import { getPrevalenceColorScale } from '../../components/maps/ChoroplethLayer';

export default function SpatialTab() {
  const { data: stateData, loading: l1, error: e1 } = useData('state_prevalence.json');
  const { data: lisaData, loading: l2, error: e2 } = useData('lisa_clusters.json');
  const [showLisa, setShowLisa] = useState(false);

  if (e1 || e2) return <div style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;
  if (l1 || l2) return <LoadingSpinner />;

  const colorScale = getPrevalenceColorScale(90);
  const stateProps = stateData?.features?.map((f) => f.properties) || [];
  const lisaProps = lisaData?.features?.map((f) => f.properties) || [];

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.spatial}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <KeyFigure label="Moran's I" value={PIPELINE_METRICS.morans_i.toFixed(4)} color="green" />
        <KeyFigure label="Z-score" value={PIPELINE_METRICS.morans_z.toFixed(2)} color="gold" />
        <KeyFigure label="P-value" value={`<0.001`} color="red" />
        <KeyFigure label="HH Hotspots" value={PIPELINE_METRICS.n_lisa_hotspots.toString()} color="red" />
      </div>

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 55%', minWidth: '300px' }}>
          <EditorialBlock>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>
                {showLisa ? 'LISA Clusters' : 'State Prevalence'}
              </h3>
              <button
                onClick={() => setShowLisa(!showLisa)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '6px',
                  border: '1px solid #003d1e',
                  background: showLisa ? '#003d1e' : 'transparent',
                  color: showLisa ? '#ffffff' : '#003d1e',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
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
          </EditorialBlock>
        </div>

        <div style={{ flex: '1 1 40%', minWidth: '300px' }}>
          <EditorialBlock>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Moran Scatterplot
            </h3>
            <MoranScatter states={lisaProps.length ? lisaProps : stateProps} moranI={PIPELINE_METRICS.morans_i} />
          </EditorialBlock>
        </div>
      </div>

      <EditorialBlock style={{ marginTop: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.5rem' }}>Funnel Plot</h3>
        <FunnelPlot states={stateProps} nationalMean={PIPELINE_METRICS.weighted_zd_prevalence} />
      </EditorialBlock>
    </div>
  );
}
