import { Link } from 'react-router-dom';
import { useMethods } from './MethodsDrawer';

const linkBase = {
  textDecoration: 'none',
  fontSize: '0.85rem',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

// Map each top-level page to the most relevant Methods drawer section.
const PAGE_TO_METHODS = {
  home: 'overview',
  story: 'overview',
  policy: 'causal-recipes',
  explorer: 'risk-model',
};

export default function SiteNav({ activePage }) {
  const methods = useMethods();
  const methodsSection = PAGE_TO_METHODS[activePage] || 'overview';

  return (
    <nav className="site-nav" aria-label="Main navigation">
      <Link to="/" className="site-nav-brand">
        <span className="site-nav-mark" aria-hidden="true">ZD</span>
        <span>Zero-Dose Nigeria</span>
      </Link>
      <div className="site-nav-links">
        <Link
          to="/story"
          className={`site-nav-link ${activePage === 'story' ? 'is-active' : ''}`}
          style={linkBase}
          aria-current={activePage === 'story' ? 'page' : undefined}
        >
          Story
        </Link>
        <Link
          to="/policy"
          className={`site-nav-link ${activePage === 'policy' ? 'is-active' : ''}`}
          style={linkBase}
          aria-current={activePage === 'policy' ? 'page' : undefined}
        >
          Policy
        </Link>
        <Link
          to="/explorer/descriptive"
          className={`site-nav-link ${activePage === 'explorer' ? 'is-active' : ''}`}
          style={linkBase}
          aria-current={activePage === 'explorer' ? 'page' : undefined}
        >
          Explorer
        </Link>
        <button
          type="button"
          onClick={() => methods?.open(methodsSection)}
          className="site-nav-link"
          style={linkBase}
        >
          Methods
        </button>
      </div>
    </nav>
  );
}
