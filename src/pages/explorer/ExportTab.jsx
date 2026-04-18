import { useState } from 'react';
import EditorialBlock from '../../components/shared/EditorialBlock';
import { explorerTabDescriptions } from '../../data/storyContent';

const DATA_FILES = [
  { filename: 'meta.json', label: 'Pipeline Metadata', desc: 'Key metrics, model parameters, trust profiles', size: '3 KB' },
  { filename: 'table_one.json', label: 'Table 1', desc: 'Weighted sample characteristics by ZD status', size: '12 KB' },
  { filename: 'shap_importance.json', label: 'SHAP Importance', desc: 'Global and zone-stratified feature importance', size: '32 KB' },
  { filename: 'cluster_map.geojson', label: 'Cluster Map', desc: '1,283 cluster point locations with properties', size: '346 KB' },
  { filename: 'state_prevalence.json', label: 'State Prevalence', desc: 'State-level ZD prevalence and polygons', size: '152 KB' },
  { filename: 'lisa_clusters.json', label: 'LISA Clusters', desc: 'State-level LISA cluster classifications', size: '153 KB' },
  { filename: 'lca_profiles.json', label: 'LCA Profiles', desc: 'Trust state distributions and posteriors', size: '74 KB' },
  { filename: 'abm_scenarios.json', label: 'ABM Scenarios', desc: '12-row matrix and 60-month trajectories', size: '15 KB' },
  { filename: 'cna_solutions.json', label: 'CNA Solutions', desc: 'Causal recipes, necessity, robustness', size: '7 KB' },
  { filename: 'calibration_posteriors.json', label: 'Calibration Posteriors', desc: 'ABC posterior parameter distributions', size: '34 KB' },
  { filename: 'scenarios_interpolation_grid.json', label: 'Interpolation Grid', desc: 'Precomputed counterfactual grid', size: '105 KB' },
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

      <EditorialBlock>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <h3 className="font-serif" style={{ fontSize: '1.125rem', fontWeight: 600, margin: 0, color: '#1c211d' }}>
            Pipeline Data Files
          </h3>
          <button
            onClick={downloadAll}
            disabled={downloading}
            style={{
              padding: '0.5rem 1rem',
              background: downloading ? '#c7cfc7' : '#003d1e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: downloading ? 'default' : 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {downloading ? 'Zipping...' : 'Download all (ZIP)'}
          </button>
        </div>

        <div>
          {DATA_FILES.map((file) => (
            <button
              key={file.filename}
              onClick={() => downloadFile(file.filename)}
              style={{
                display: 'block',
                padding: '1rem 0',
                cursor: 'pointer',
                background: 'none',
                border: 'none',
                borderTop: '1px solid #c7cfc7',
                textAlign: 'left',
                width: '100%',
                fontFamily: 'inherit',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <div className="font-serif" style={{ fontWeight: 600, fontSize: '1rem', color: '#1c211d' }}>
                    {file.label}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#697269', marginTop: '0.2rem' }}>
                    {file.desc}
                  </div>
                  <div
                    style={{
                      fontSize: '0.8125rem',
                      color: '#003d1e',
                      marginTop: '0.3rem',
                      fontFamily: 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace',
                    }}
                  >
                    {file.filename}
                  </div>
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#697269', whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums' }}>
                  {file.size}
                </div>
              </div>
            </button>
          ))}
        </div>
      </EditorialBlock>
    </div>
  );
}
