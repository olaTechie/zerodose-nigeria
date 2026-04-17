import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Scrollama, Step } from 'react-scrollama';
import StoryHero from '../components/story/StoryHero';
import NetworkAnimation from '../components/story/NetworkAnimation';
import NigeriaMap from '../components/maps/NigeriaMap';
import ShapBarChart from '../components/charts/ShapBarChart';
import CoverageHeatmap from '../components/charts/CoverageHeatmap';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import GlassCard from '../components/shared/GlassCard';
import SiteNav from '../components/shared/SiteNav';
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
  if (anyError) return <div className="glass-card" style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load story data. Please refresh the page.</div>;

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
            <DecisionTreeSVG />
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

function DecisionTreeSVG() {
  return (
    <svg viewBox="0 0 400 350" role="img" aria-label="Decision tree showing two community types and their recommended intervention strategies" style={{ width: '100%', height: 'auto', maxWidth: '400px', margin: '0 auto', display: 'block', fontFamily: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' }}>
      {/* Root node */}
      <rect x="130" y="10" width="140" height="40" rx="8" fill="#006633" />
      <text x="200" y="35" textAnchor="middle" fill="#fff" fontSize="12" fontWeight="600">Community type?</text>

      {/* Branches */}
      <line x1="170" y1="50" x2="100" y2="100" stroke="#546e7a" strokeWidth="2" />
      <line x1="230" y1="50" x2="300" y2="100" stroke="#546e7a" strokeWidth="2" />

      {/* Labels */}
      <text x="120" y="80" textAnchor="middle" fontSize="10" fill="#546e7a" fontWeight="600">Reference</text>
      <text x="280" y="80" textAnchor="middle" fontSize="10" fill="#546e7a" fontWeight="600">Access-Constrained</text>

      {/* Left leaf */}
      <rect x="20" y="100" width="160" height="100" rx="8" fill="#e8f5e9" stroke="#2e7d32" strokeWidth="1.5" />
      <text x="100" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#2e7d32">Outreach only (S1)</text>
      <text x="100" y="145" textAnchor="middle" fontSize="10" fill="#546e7a">Deploy mobile teams</text>
      <text x="100" y="175" textAnchor="middle" fontSize="18" fontWeight="800" fill="#2e7d32">86.1%</text>
      <text x="100" y="192" textAnchor="middle" fontSize="9" fill="#78909c">60.9% of communities</text>

      {/* Right leaf */}
      <rect x="220" y="100" width="160" height="100" rx="8" fill="#e3f2fd" stroke="#1565c0" strokeWidth="1.5" />
      <text x="300" y="125" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1565c0">Full package (S5)</text>
      <text x="300" y="145" textAnchor="middle" fontSize="10" fill="#546e7a">Outreach + engage + supply</text>
      <text x="300" y="175" textAnchor="middle" fontSize="18" fontWeight="800" fill="#1565c0">82.0%</text>
      <text x="300" y="192" textAnchor="middle" fontSize="9" fill="#78909c">39.1% of communities</text>

      {/* Arrow to 80% line */}
      <line x1="0" y1="240" x2="400" y2="240" stroke="#d32f2f" strokeWidth="1" strokeDasharray="6,3" />
      <text x="200" y="258" textAnchor="middle" fontSize="10" fill="#d32f2f" fontWeight="600">80% coverage target</text>

      {/* Footer */}
      <text x="200" y="300" textAnchor="middle" fontSize="11" fill="#0d1b2a" fontWeight="600">
        Two community types. Two intervention strategies.
      </text>
      <text x="200" y="320" textAnchor="middle" fontSize="11" fill="#0d1b2a" fontWeight="600">
        One unified targeting rule.
      </text>
    </svg>
  );
}
