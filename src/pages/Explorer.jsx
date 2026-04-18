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
    <div style={{ background: '#fbfcfb', minHeight: '100vh' }}>
      {/* Nav */}
      <SiteNav activePage="explorer" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <PageHeader title="Technical Explorer" subtitle="Detailed outputs from each pipeline stage" />

        {/* Underline tab bar (design brief §9) */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            gap: '1.75rem',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            borderBottom: '1px solid #c7cfc7',
          }}
        >
          {TABS.map((tab) => (
            <NavLink
              key={tab.id}
              to={tab.id}
              style={({ isActive }) => ({
                padding: '0.5rem 0',
                background: 'transparent',
                color: isActive ? '#1c211d' : '#697269',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.9375rem',
                textDecoration: 'none',
                borderBottom: isActive ? '2px solid #cc8400' : '2px solid transparent',
                marginBottom: '-1px',
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
