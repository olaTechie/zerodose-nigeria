import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LoadingSpinner from './components/shared/LoadingSpinner';
import ErrorBoundary from './components/shared/ErrorBoundary';
import { MethodsProvider } from './components/shared/MethodsDrawer';

const Landing = lazy(() => import('./pages/Landing'));
const Story = lazy(() => import('./pages/Story'));
const Policy = lazy(() => import('./pages/Policy'));
const Explorer = lazy(() => import('./pages/Explorer'));

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter basename="/zerodose-nigeria">
        <MethodsProvider>
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/story" element={<Story />} />
              <Route path="/policy" element={<Policy />} />
              <Route path="/explorer/*" element={<Explorer />} />
            </Routes>
          </Suspense>
        </MethodsProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
}
