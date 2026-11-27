import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scrollama, Step } from 'react-scrollama';
import StoryHero from '../components/story/StoryHero';
import NetworkAnimation from '../components/story/NetworkAnimation';
import NigeriaMap from '../components/maps/NigeriaMap';
import ShapBarChart from '../components/charts/ShapBarChart';
import CoverageHeatmap from '../components/charts/CoverageHeatmap';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import ErrorState from '../components/shared/ErrorState';
import GlassCard from '../components/shared/GlassCard';
import SiteNav from '../components/shared/SiteNav';
import OperationalHeadlinePanel from '../components/shared/OperationalHeadlinePanel';
import DisruptionBars from '../components/story/DisruptionBars';
import FrontierChart from '../components/charts/FrontierChart';
import { useData } from '../hooks/useData';
import { storySections } from '../data/storyContent';
import { getPrevalenceColorScale } from '../components/maps/ChoroplethLayer';

export default function Story() {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(0);
  const [sectionStep, setSectionStep] = useState(0);

  const { data: stateData, loading: l1, error: e1, retry: r1 } = useData('state_prevalence.json');
  const { data: lisaData, loading: l2, error: e2, retry: r2 } = useData('lisa_clusters.json');
  const { data: shapData, loading: l4, error: e4, retry: r4 } = useData('shap_importance.json');
  const { data: abmData, loading: l5, error: e5, retry: r5 } = useData('abm_scenarios.json');
  const { data: econData, loading: l6, error: e6, retry: r6 } = useData('economics.json');

  const anyLoading = l1 || l2 || l4 || l5 || l6;
  const anyError = e1 || e2 || e4 || e5 || e6;

  if (anyLoading) return <LoadingSpinner />;
  if (anyError) return <ErrorState title="Could not load story data" onRetry={() => { r1(); r2(); r4(); r5(); r6(); }} />;

  const colorScale = getPrevalenceColorScale(90);

  // Render the sticky visual for each section
  function renderVisual(sectionIndex) {
    switch (sectionIndex) {
      case 0: // Crisis — cluster map grey->coloured
        return (
          <div style={{ width: '100%', height: '100%' }}>
            <NigeriaMap
              stateData={stateData}
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
      case 3: // Linked simulation: network animation
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <NetworkAnimation step={sectionStep} width={450} height={400} />
          </div>
        );
      case 4: // Zone disruption parameters bar chart
        return (
          <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <DisruptionBars />
          </div>
        );
      case 5: // Packages: simulated coverage table
        return (
          <div style={{ width: '100%' }}>
            {abmData && (
              <CoverageHeatmap matrix={abmData.matrix} />
            )}
          </div>
        );
      case 6: // Trade-off: efficiency frontier for each community type
        return (
          <div style={{ width: '100%' }}>
            {['Access-Constrained', 'Reference'].map((t) => (
              <div key={t} style={{ marginBottom: '0.5rem' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#37474f', textAlign: 'center' }}>{t} communities</div>
                <FrontierChart rows={econData?.frontier || []} typology={t} />
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Navigation bar */}
      <SiteNav activePage="story" />

      {/* Hero */}
      <div style={{ paddingTop: '3rem' }}>
        <StoryHero />
      </div>

      {/* Scrollytelling sections */}
      {storySections.map((section, sIdx) => (
        <div key={section.id} style={{ minHeight: '100vh', padding: '0 2rem' }}>
          <h2 style={{
            fontSize: '2rem', fontWeight: 800, color: '#003d1e',
            textAlign: 'center', padding: '2rem 0 1rem',
          }}>
            {section.title}
          </h2>

          <div className="scroll-section" style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {/* Sticky visual */}
            <div className="scroll-visual">
              {Math.abs(currentSection - sIdx) <= 1 && renderVisual(sIdx)}
            </div>

            {/* Scrolling narrative */}
            <div className="scroll-narrative">
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
                      className="glass-card"
                      style={{
                        marginBottom: '40vh',
                        padding: '1.5rem',
                        maxWidth: '400px',
                        opacity: currentSection === sIdx && sectionStep >= bIdx ? 1 : 0.3,
                        transition: 'opacity 0.4s ease',
                      }}
                    >
                      <p style={{ fontSize: '0.95rem', lineHeight: 1.65, margin: 0, color: '#0d1b2a' }}>
                        {block}
                      </p>
                    </div>
                  </Step>
                ))}

                {/* Stat highlight */}
                <Step data={section.narrativeBlocks.length}>
                  <div
                    className="glass-card"
                    style={{
                      marginBottom: '30vh',
                      padding: '1.2rem',
                      maxWidth: '400px',
                      textAlign: 'center',
                      borderTop: '3px solid #006633',
                    }}
                  >
                    <div style={{ fontSize: '2.2rem', fontWeight: 800, color: '#006633' }}>
                      {section.statHighlight.value}
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#546e7a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {section.statHighlight.label}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#78909c', marginTop: '0.5rem' }}>
                      {section.caption}
                    </div>
                  </div>
                </Step>
              </Scrollama>
            </div>
          </div>
        </div>
      ))}

      {/* Closing operational headline panel — same component as Landing,
          mirrors the rebuild's Story-end OperationalHeadline mode='closing'. */}
      <div style={{ background: '#fff', padding: '3rem 0 1rem', borderTop: '1px solid rgba(0,0,0,0.06)' }}>
        <OperationalHeadlinePanel />
      </div>

      {/* CTA at end */}
      <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)' }}>
        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#003d1e', marginBottom: '1rem' }}>
          Explore the evidence
        </h2>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="btn-primary" style={btnStyle} onClick={() => navigate('/policy')}>
            Policy Dashboard
          </button>
          <button className="btn-secondary" style={{ ...btnStyle, background: '#fff', color: '#006633', border: '2px solid #006633' }} onClick={() => navigate('/explorer/descriptive')}>
            Technical Explorer
          </button>
        </div>
      </div>
    </div>
  );
}

const btnStyle = {
  padding: '0.75rem 2rem',
  background: '#006633',
  color: '#fff',
  border: 'none',
  borderRadius: '50px',
  fontSize: '0.95rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'transform 0.2s',
};

// (DecisionTreeSVG was lifted to src/components/shared/DecisionTreeSVG.jsx
// for reuse on Landing's OperationalHeadlinePanel.)
