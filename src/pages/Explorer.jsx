import { Routes, Route, Navigate, NavLink } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import PageHeader from '../components/shared/PageHeader';
import SiteNav from '../components/shared/SiteNav';
import { explorerTabDescriptions } from '../data/storyContent';

const DescriptiveTab = lazy(() => import('./explorer/DescriptiveTab'));
const SpatialTab = lazy(() => import('./explorer/SpatialTab'));
const RiskTab = lazy(() => import('./explorer/RiskTab'));
const ClassesTab = lazy(() => import('./explorer/ClassesTab'));
const SimulationTab = lazy(() => import('./explorer/SimulationTab'));
const CNATab = lazy(() => import('./explorer/CNATab'));
const EconomicsTab = lazy(() => import('./explorer/EconomicsTab'));
const FairnessTab = lazy(() => import('./explorer/FairnessTab'));
const ExportTab = lazy(() => import('./explorer/ExportTab'));

const TABS = [
  { id: 'descriptive', label: 'Descriptive' },
  { id: 'spatial', label: 'Spatial' },
  { id: 'risk', label: 'Risk Factors' },
  { id: 'fairness', label: 'Fairness' },
  { id: 'classes', label: 'Engagement Classes' },
  { id: 'simulation', label: 'Simulation' },
  { id: 'configurations', label: 'Configurations' },
  { id: 'economics', label: 'Economics' },
  { id: 'export', label: 'Export' },
];

export default function Explorer() {
  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      {/* Nav */}
      <SiteNav activePage="explorer" />

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
        <PageHeader title="Technical Explorer" subtitle="Detailed outputs from each pipeline stage" />
        <p className="data-note">
          Pre-computed outputs of the NDHS 2024 analysis; not connected to live health-system data.
        </p>

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
            <Route path="fairness" element={<FairnessTab />} />
            <Route path="classes" element={<ClassesTab />} />
            <Route path="simulation" element={<SimulationTab />} />
            <Route path="configurations" element={<CNATab />} />
            <Route path="economics" element={<EconomicsTab />} />
            <Route path="export" element={<ExportTab />} />
            {/* Old tab addresses, kept so earlier links still work */}
            <Route path="trust" element={<Navigate to="../classes" replace />} />
            <Route path="abm" element={<Navigate to="../simulation" replace />} />
            <Route path="cna" element={<Navigate to="../configurations" replace />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}
