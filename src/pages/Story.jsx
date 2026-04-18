import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scrollama, Step } from 'react-scrollama';
import StoryHero from '../components/story/StoryHero';
import NetworkAnimation from '../components/story/NetworkAnimation';
import NigeriaMap from '../components/maps/NigeriaMap';
import ShapBarChart from '../components/charts/ShapBarChart';
import CoverageHeatmap from '../components/charts/CoverageHeatmap';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import SiteNav from '../components/shared/SiteNav';
import DecisionTreeFigure from '../components/shared/DecisionTreeFigure';
import OperationalHeadline from '../components/shared/OperationalHeadline';
import { useData } from '../hooks/useData';
import { storySections } from '../data/storyContent';
import { getPrevalenceColorScale } from '../components/maps/ChoroplethLayer';

export default function Story() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionStep, setSectionStep] = useState(0);

  const { data: stateData, loading: l1, error: e1 } = useData('state_prevalence.json');
  const { data: lisaData, loading: l2, error: e2 } = useData('lisa_clusters.json');
  const { data: clusterData, loading: l3, error: e3 } = useData('cluster_map.geojson');
  const { data: shapData, loading: l4, error: e4 } = useData('shap_importance.json');
  const { data: abmData, loading: l5, error: e5 } = useData('abm_scenarios.json');

  const anyLoading = l1 || l2 || l3 || l4 || l5;
  const anyError = e1 || e2 || e3 || e4 || e5;

  if (anyLoading) return <LoadingSpinner />;
  if (anyError) return <div style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load story data. Please refresh the page.</div>;

  const colorScale = getPrevalenceColorScale(90);

  // Render the sticky visual for each section
  function renderVisual(sectionIndex) {
    switch (sectionIndex) {
      case 0: // Crisis — cluster map grey->coloured
        return (
          <div style={{ width: '100%', height: '100%' }}>
            <NigeriaMap
              stateData={stateData}
              clusterData={clusterData}
              showClusters={sectionStep >= 1}
              colorScale={colorScale}
              colorByField="weighted_prevalence"
              height={450}
            />
          </div>
        );
      case 1: // Geography — choropleth + LISA
        return (
          <div style={{ width: '100%', height: '100%' }}>
            <NigeriaMap
              stateData={sectionStep >= 1 ? null : stateData}
              lisaData={sectionStep >= 1 ? lisaData : null}
              showLisa={sectionStep >= 1}
              colorScale={colorScale}
              colorByField="weighted_prevalence"
              height={450}
            />
            {sectionStep >= 1 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem', justifyContent: 'center' }}>
                {[
                  { label: 'High-High', color: '#d32f2f' },
                  { label: 'Low-Low', color: '#1565c0' },
                  { label: 'Not Significant', color: '#e0e0e0' },
                ].map((l) => (
                  <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.72rem' }}>
                    <span style={{ width: 12, height: 12, borderRadius: 3, background: l.color, display: 'inline-block' }} />
                    {l.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      case 2: // Drivers — SHAP bar chart
        return (
          <div style={{ width: '100%' }}>
            <ShapBarChart
              data={shapData?.global || []}
              maxFeatures={sectionStep >= 2 ? 15 : sectionStep >= 1 ? 10 : 5}
              animated={true}
            />
          </div>
        );
      case 3: // Digital twin — network animation
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <NetworkAnimation step={sectionStep} width={450} height={400} />
          </div>
        );
      case 4: // Recipes — coverage bars
        return (
          <div style={{ width: '100%' }}>
            {abmData && (
              <CoverageHeatmap matrix={abmData.matrix} />
            )}
          </div>
        );
      case 5: // Action — decision tree
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <DecisionTreeFigure maxWidth={400} />
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ background: '#fbfcfb', minHeight: '100vh' }}>
      {/* Navigation bar */}
      <SiteNav activePage="story" />

      {/* Hero */}
      <StoryHero />

      {/* Scrollytelling sections */}
      {storySections.map((section, sIdx) => (
        <div key={section.id} style={{ minHeight: '100vh', padding: '0 2rem' }}>
          <h2
            className="font-serif"
            style={{
              fontSize: '2.25rem',
              fontWeight: 500,
              color: '#003d1e',
              padding: '3rem 0 1.5rem',
              maxWidth: '1200px',
              margin: '0 auto',
              lineHeight: 1.15,
            }}
          >
            {section.title}
          </h2>

          <div
            style={{
              maxWidth: '1200px',
              margin: '0 auto',
              display: 'flex',
              position: 'relative',
              minHeight: '100vh',
            }}
          >
            {/* Sticky visual */}
            <div
              style={{
                position: 'sticky',
                top: '4rem',
                height: 'calc(100vh - 4rem)',
                flex: '1 1 55%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
              }}
            >
              {Math.abs(currentSection - sIdx) <= 1 && renderVisual(sIdx)}
            </div>

            {/* Scrolling narrative */}
            <div style={{ flex: '1 1 45%', padding: '40vh 2.5rem' }}>
              <Scrollama
                onStepEnter={({ data }) => {
                  setCurrentSection(sIdx);
                  setSectionStep(data);
                }}
                offset={0.5}
              >
                {section.narrativeBlocks.map((block, bIdx) => (
                  <Step key={bIdx} data={bIdx}>
                    <div
                      style={{
                        marginBottom: '40vh',
                        paddingTop: '1.25rem',
                        borderTop: '1px solid #c7cfc7',
                        maxWidth: '440px',
                        opacity: currentSection === sIdx && sectionStep >= bIdx ? 1 : 0.4,
                        transition: 'opacity 0.4s ease',
                      }}
                    >
                      <p style={{ fontSize: '1.0625rem', lineHeight: 1.6, margin: 0, color: '#1c211d' }}>
                        {block}
                      </p>
                    </div>
                  </Step>
                ))}

                {/* Stat highlight */}
                <Step data={section.narrativeBlocks.length}>
                  <div
                    style={{
                      marginBottom: '30vh',
                      paddingTop: '1.5rem',
                      borderTop: '1px solid #c7cfc7',
                      maxWidth: '440px',
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
                      {section.statHighlight.label}
                    </div>
                    <div
                      className="font-serif"
                      style={{
                        fontSize: '3rem',
                        fontWeight: 500,
                        color: '#003d1e',
                        lineHeight: 1.05,
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {section.statHighlight.value}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: '#697269', marginTop: '0.75rem', lineHeight: 1.5 }}>
                      {section.caption}
                    </div>
                  </div>
                </Step>
              </Scrollama>
            </div>
          </div>
        </div>
      ))}

      {/* Closing — operational headline as full-bleed editorial spread */}
      <OperationalHeadline mode="closing" />

      {/* Explore-the-evidence text links */}
      <div
        style={{
          padding: '3rem 2rem',
          borderTop: '1px solid #c7cfc7',
          background: '#fbfcfb',
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
            Continue
          </div>
          <h2
            className="font-serif"
            style={{
              fontSize: '1.75rem',
              fontWeight: 500,
              color: '#1c211d',
              marginBottom: '1.25rem',
              lineHeight: 1.2,
            }}
          >
            Explore the evidence
          </h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/policy')} style={ctaLinkStyle}>
              Policy Dashboard {'\u2192'}
            </button>
            <button onClick={() => navigate('/explorer/descriptive')} style={ctaLinkStyle}>
              Technical Explorer {'\u2192'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const ctaLinkStyle = {
  background: 'transparent',
  border: 'none',
  color: '#003d1e',
  fontFamily: 'inherit',
  fontSize: '1.0625rem',
  fontWeight: 500,
  cursor: 'pointer',
  padding: 0,
  textDecoration: 'underline',
  textUnderlineOffset: '4px',
};
