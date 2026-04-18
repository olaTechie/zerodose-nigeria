import { Routes, Route, Navigate, useParams, useNavigate } from 'react-router-dom';
import { lazy, Suspense, useMemo } from 'react';
import LoadingSpinner from '../components/shared/LoadingSpinner';
import PageHeader from '../components/shared/PageHeader';
import SiteNav from '../components/shared/SiteNav';
import OperationalHeadline from '../components/shared/OperationalHeadline';
import { MethodsLink } from '../components/shared/MethodsDrawer';
import UnderlineTabNav from '../components/shared/UnderlineTabNav';

const DescriptiveTab = lazy(() => import('./explorer/DescriptiveTab'));
const SpatialTab = lazy(() => import('./explorer/SpatialTab'));
const RiskTab = lazy(() => import('./explorer/RiskTab'));
const TrustTab = lazy(() => import('./explorer/TrustTab'));
const ABMTab = lazy(() => import('./explorer/ABMTab'));
const CNATab = lazy(() => import('./explorer/CNATab'));
const ExportTab = lazy(() => import('./explorer/ExportTab'));

// Three-section information architecture per design brief §2 / §9.
// URLs: /explorer/<section>/<sub>
const EXPLORER_IA = [
  {
    id: 'descriptive',
    label: 'Descriptive',
    subTabs: [
      { id: 'descriptive', label: 'Descriptive', component: DescriptiveTab },
      { id: 'spatial', label: 'Spatial', component: SpatialTab },
    ],
  },
  {
    id: 'modelling',
    label: 'Modelling',
    subTabs: [
      { id: 'risk', label: 'Risk Factors', component: RiskTab },
      { id: 'trust', label: 'Trust States', component: TrustTab },
      { id: 'abm', label: 'ABM', component: ABMTab },
    ],
  },
  {
    id: 'causal',
    label: 'Causal',
    subTabs: [
      { id: 'cna', label: 'CNA', component: CNATab },
      { id: 'export', label: 'Export', component: ExportTab },
    ],
  },
];

const DEFAULT_SECTION = EXPLORER_IA[0].id;
const DEFAULT_SUB = EXPLORER_IA[0].subTabs[0].id;

// Backwards-compatibility map: any legacy single-tab URL still resolves.
// Targets are relative (resolved against the /explorer parent route).
const LEGACY_REDIRECTS = {
  spatial: 'descriptive/spatial',
  risk: 'modelling/risk',
  trust: 'modelling/trust',
  abm: 'modelling/abm',
  cna: 'causal/cna',
  export: 'causal/export',
};

export default function Explorer() {
  return (
    <div style={{ background: '#fbfcfb', minHeight: '100vh' }}>
      {/* Nav */}
      <SiteNav activePage="explorer" />

      {/* Operational headline strip — sticky on Explorer routes (design brief §3 Variant B) */}
      <OperationalHeadline mode="strip" sticky />

      <Routes>
        <Route
          index
          element={<Navigate to={`${DEFAULT_SECTION}/${DEFAULT_SUB}`} replace />}
        />
        {/* Legacy single-segment URLs redirect into the two-tier IA. */}
        {Object.entries(LEGACY_REDIRECTS).map(([from, to]) => (
          <Route
            key={from}
            path={from}
            element={<Navigate to={to} replace />}
          />
        ))}
        <Route path=":section" element={<SectionRedirect />} />
        <Route path=":section/:sub" element={<ExplorerShell />} />
        <Route path="*" element={<Navigate to={`${DEFAULT_SECTION}/${DEFAULT_SUB}`} replace />} />
      </Routes>
    </div>
  );
}

// If the user lands on /explorer/<section> without a sub-tab, redirect
// to that section's first sub-tab (default landing per design brief §9).
function SectionRedirect() {
  const { section } = useParams();
  const found = EXPLORER_IA.find((s) => s.id === section);
  if (!found) return <Navigate to={`${DEFAULT_SECTION}/${DEFAULT_SUB}`} replace />;
  return <Navigate to={found.subTabs[0].id} replace />;
}

function ExplorerShell() {
  const { section, sub } = useParams();
  const navigate = useNavigate();

  const activeSection = useMemo(
    () => EXPLORER_IA.find((s) => s.id === section) ?? EXPLORER_IA[0],
    [section]
  );
  const activeSub = useMemo(
    () =>
      activeSection.subTabs.find((t) => t.id === sub) ??
      activeSection.subTabs[0],
    [activeSection, sub]
  );

  const ActiveTabComponent = activeSub.component;

  function handleSectionChange(nextSectionId) {
    const nextSection = EXPLORER_IA.find((s) => s.id === nextSectionId);
    if (!nextSection) return;
    navigate(`/explorer/${nextSection.id}/${nextSection.subTabs[0].id}`);
  }

  function handleSubChange(nextSubId) {
    navigate(`/explorer/${activeSection.id}/${nextSubId}`);
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem' }}>
      <PageHeader title="Technical Explorer" subtitle="Detailed outputs from each pipeline stage" />

      <div style={{ marginBottom: '1rem', fontSize: '0.8125rem', color: '#697269' }}>
        <MethodsLink sectionId="overview">Pipeline overview</MethodsLink>
        {' \u00b7 '}
        <MethodsLink sectionId="risk-model">Risk model</MethodsLink>
        {' \u00b7 '}
        <MethodsLink sectionId="digital-twin">Digital twin</MethodsLink>
        {' \u00b7 '}
        <MethodsLink sectionId="causal-recipes">Causal recipes</MethodsLink>
        {' \u00b7 '}
        <MethodsLink sectionId="glossary">Glossary</MethodsLink>
      </div>

      {/* Tier 1 — sections */}
      <UnderlineTabNav
        ariaLabel="Explorer sections"
        tabs={EXPLORER_IA.map((s) => ({ id: s.id, label: s.label }))}
        activeId={activeSection.id}
        onChange={handleSectionChange}
      />

      {/* Tier 2 — sub-tabs (only when a section is selected; always true here) */}
      <UnderlineTabNav
        ariaLabel={`${activeSection.label} sub-sections`}
        tabs={activeSection.subTabs.map((t) => ({ id: t.id, label: t.label }))}
        activeId={activeSub.id}
        onChange={handleSubChange}
        size="compact"
      />

      <Suspense fallback={<LoadingSpinner />}>
        <ActiveTabComponent />
      </Suspense>
    </div>
  );
}
