import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import PageHeader from '../components/shared/PageHeader';
import SiteNav from '../components/shared/SiteNav';
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
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <SiteNav activePage="explorer" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <PageHeader title="Technical Explorer" subtitle="Detailed outputs from each pipeline stage" />

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', flexWrap: 'wrap', borderBottom: '2px solid #e0e0e0', paddingBottom: '0.5rem' }}>
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={`/explorer/${tab.id}`}
              end
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
