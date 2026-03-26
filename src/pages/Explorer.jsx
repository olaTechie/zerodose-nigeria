import { Routes, Route, Navigate, NavLink, useNavigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import PageHeader from '../components/shared/PageHeader';
import { explorerTabDescriptions } from '../data/storyContent';

const DescriptiveTab = lazy(() => import('./explorer/DescriptiveTab'));
const SpatialTab = lazy(() => import('./explorer/SpatialTab'));
const RiskTab = lazy(() => import('./explorer/RiskTab'));
const TrustTab = lazy(() => import('./explorer/TrustTab'));
const ABMTab = lazy(() => import('./explorer/ABMTab'));
const CNATab = lazy(() => import('./explorer/CNATab'));
const ExportTab = lazy(() => import('./explorer/ExportTab'));

const TABS = [
  { id: 'descriptive', label: 'Descriptive' },
  { id: 'spatial', label: 'Spatial' },
  { id: 'risk', label: 'Risk Factors' },
  { id: 'trust', label: 'Trust States' },
  { id: 'abm', label: 'ABM' },
  { id: 'cna', label: 'CNA' },
  { id: 'export', label: 'Export' },
];

export default function Explorer() {
  const navigate = useNavigate();

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 100,
        background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(12px)',
        padding: '0.6rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        borderBottom: '1px solid rgba(0,102,51,0.1)',
      }}>
        <span style={{ fontWeight: 700, color: '#006633', cursor: 'pointer' }} onClick={() => navigate('/')}>
          Zero-Dose Nigeria
        </span>
        <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
          <span style={{ cursor: 'pointer', color: '#546e7a' }} onClick={() => navigate('/story')}>Story</span>
          <span style={{ cursor: 'pointer', color: '#546e7a' }} onClick={() => navigate('/policy')}>Policy</span>
          <span style={{ cursor: 'pointer', color: '#006633', fontWeight: 600 }}>Explorer</span>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <PageHeader title="Technical Explorer" subtitle="Detailed outputs from each pipeline stage" />

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '2px solid #e0e0e0', paddingBottom: '0.5rem' }}>
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.id}
              style={({ isActive }) => ({
                padding: '0.4rem 1rem',
                borderRadius: '50px 50px 0 0',
                background: isActive ? '#006633' : 'transparent',
                color: isActive ? '#fff' : '#546e7a',
                fontWeight: isActive ? 700 : 500,
                fontSize: '0.82rem',
                textDecoration: 'none',
                transition: 'all 0.2s',
              })}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>

        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route index element={<Navigate to="descriptive" replace />} />
            <Route path="descriptive" element={<DescriptiveTab />} />
            <Route path="spatial" element={<SpatialTab />} />
            <Route path="risk" element={<RiskTab />} />
            <Route path="trust" element={<TrustTab />} />
            <Route path="abm" element={<ABMTab />} />
            <Route path="cna" element={<CNATab />} />
            <Route path="export" element={<ExportTab />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
