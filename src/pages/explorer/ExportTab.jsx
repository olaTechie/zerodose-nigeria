import { useState } from 'react';
import GlassCard from '../../components/shared/GlassCard';
import { explorerTabDescriptions } from '../../data/storyContent';

const DATA_FILES = [
  { filename: 'meta.json', label: 'Pipeline Metadata', desc: 'Headline metrics, calibration fit, decision-rule coefficients' },
  { filename: 'table_one.json', label: 'Table 1', desc: 'Weighted sample characteristics by zero-dose status' },
  { filename: 'shap_importance.json', label: 'SHAP Importance', desc: 'Global and zone-stratified mean |SHAP| (committed model)' },
  { filename: 'fairness.json', label: 'Fairness Audit', desc: 'Sensitivity by subgroup and equal-opportunity gaps' },
  { filename: 'state_prevalence.json', label: 'State Prevalence', desc: 'State-level zero-dose prevalence and polygons' },
  { filename: 'lisa_clusters.json', label: 'LISA Clusters', desc: 'State-level LISA cluster classifications' },
  { filename: 'moran_scatter.json', label: 'Moran Scatterplot', desc: 'State z-scores and spatial lags (row-standardised queen weights)' },
  { filename: 'lca_profiles.json', label: 'Engagement Classes', desc: 'Four latent classes: shares, zero-dose prevalence, item-response probabilities' },
  { filename: 'abm_scenarios.json', label: 'Simulated Scenarios', desc: '12 scenario-typology cells, coverage at months 36 and 60 with 95% simulation intervals' },
  { filename: 'calibration_posteriors.json', label: 'Calibration Posteriors', desc: '200 accepted draws of the 14 calibrated parameters' },
  { filename: 'cna_solutions.json', label: 'Intervention Configurations', desc: 'Coincidence Analysis solutions, necessity, robustness' },
  { filename: 'economics.json', label: 'Economic Evaluation', desc: 'Each package against status quo, and the incremental frontier' },
];

export default function ExportTab() {
  const [downloading, setDownloading] = useState(false);

  async function downloadFile(filename) {
    try {
      const url = `${import.meta.env.BASE_URL}data/${filename}`;
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const blob = await response.blob();
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = filename;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (e) {
      alert(`Failed to download ${filename}: ${e.message}`);
    }
  }

  async function downloadAll() {
    setDownloading(true);
    try {
      const JSZip = (await import('jszip')).default;
      const { saveAs } = await import('file-saver');
      const zip = new JSZip();

      for (const file of DATA_FILES) {
        const url = `${import.meta.env.BASE_URL}data/${file.filename}`;
        const response = await fetch(url);
        const blob = await response.blob();
        zip.file(file.filename, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'zerodose-nigeria-data.zip');
    } catch (e) {
      console.error('Download all failed:', e);
    } finally {
      setDownloading(false);
    }
  }

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.export}
      </p>

      <GlassCard>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, margin: 0 }}>Pipeline Data Files</h3>
          <button
            onClick={downloadAll}
            disabled={downloading}
            style={{
              padding: '0.5rem 1.2rem',
              background: downloading ? '#ccc' : '#006633',
              color: '#fff',
              border: 'none',
              borderRadius: '50px',
              fontSize: '0.85rem',
              fontWeight: 600,
              cursor: downloading ? 'default' : 'pointer',
            }}
          >
            {downloading ? 'Zipping...' : 'Download All (ZIP)'}
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '0.75rem' }}>
          {DATA_FILES.map((file) => (
            <button
              key={file.filename}
              className="glass-card"
              style={{
                padding: '1rem',
                cursor: 'pointer',
                borderLeft: '3px solid #006633',
                transition: 'transform 0.2s',
                background: 'none',
                border: 'none',
                borderLeftWidth: '3px',
                borderLeftStyle: 'solid',
                borderLeftColor: '#006633',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
              onClick={() => downloadFile(file.filename)}
              onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-1px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0d1b2a' }}>{file.label}</div>
                  <div style={{ fontSize: '0.78rem', color: '#546e7a', marginTop: '0.2rem' }}>{file.desc}</div>
                </div>
              </div>
              <div style={{ fontSize: '0.72rem', color: '#006633', marginTop: '0.3rem', fontFamily: "'Courier New', monospace" }}>
                {file.filename}
              </div>
            </button>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
