import EditorialBlock from '../../components/shared/EditorialBlock';
import KeyFigure from '../../components/shared/KeyFigure';
import LoadingSpinner from '../../components/shared/LoadingSpinner';
import { useData } from '../../hooks/useData';
import { explorerTabDescriptions } from '../../data/storyContent';
import { PIPELINE_METRICS } from '../../data/constants';
import { thStyle, tdStyle } from '../../styles/tableStyles';

export default function DescriptiveTab() {
  const { data: tableData, loading, error } = useData('table_one.json');

  if (error) return <div style={{ padding: '2rem', color: '#b33000', textAlign: 'center' }}>Failed to load data. Please refresh the page.</div>;
  if (loading) return <LoadingSpinner />;

  const rows = tableData?.rows || [];

  return (
    <div>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', marginBottom: '1rem' }}>
        {explorerTabDescriptions.descriptive}
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <KeyFigure label="Children" value={PIPELINE_METRICS.n_children.toLocaleString()} color="green" />
        <KeyFigure label="Clusters" value={PIPELINE_METRICS.n_clusters.toLocaleString()} color="green" />
        <KeyFigure label="ZD Prevalence" value={`${(PIPELINE_METRICS.weighted_zd_prevalence * 100).toFixed(1)}%`} color="red" />
        <KeyFigure label="Model AUC" value={PIPELINE_METRICS.model_auc_roc.toFixed(4)} color="gold" />
      </div>

      <EditorialBlock>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
          Table 1: Sample Characteristics by Zero-Dose Status
        </h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem', fontFamily: '"Source Sans 3", ui-sans-serif, system-ui, sans-serif' }}>
            <thead>
              <tr>
                <th style={thStyle}>Variable</th>
                <th style={thStyle}>Category</th>
                <th style={thStyle}>Overall</th>
                <th style={thStyle}>Vaccinated</th>
                <th style={thStyle}>Zero-dose</th>
                <th style={thStyle}>P-value</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => {
                const isHeader = row.pvalue === '' && row.category === '' && row.variable !== 'n';
                return (
                  <tr key={i} style={{ background: isHeader ? '#f8f9f8' : 'transparent' }}>
                    <td style={{ ...tdStyle, fontWeight: isHeader || !row.category ? 600 : 400 }}>
                      {row.variable}
                    </td>
                    <td style={tdStyle}>{row.category}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{row.overall}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{row.vaccinated}</td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>{row.zerodose}</td>
                    <td style={{ ...tdStyle, textAlign: 'center', color: row.pvalue === '<0.001' ? '#b33000' : '#546e7a', fontWeight: row.pvalue === '<0.001' ? 600 : 400 }}>
                      {row.pvalue}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </EditorialBlock>
    </div>
  );
}

