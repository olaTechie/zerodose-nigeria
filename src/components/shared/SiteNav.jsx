import { Link } from 'react-router-dom';
import { useMethods } from './MethodsDrawer';

// SiteNav — solid white nav with 1 px neutral hairline rule.
// No backdrop blur, no rgba background, no shadow. Active link uses gold underline
// (the gold accent's only role in nav per design brief §9).
const navStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: '#ffffff',
  padding: '0.75rem 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid #c7cfc7',
};

const linkBase = {
  textDecoration: 'none',
  fontSize: '0.9375rem',
  background: 'none',
  border: 'none',
  padding: '0.25rem 0',
  cursor: 'pointer',
  fontFamily: 'inherit',
  position: 'relative',
};

function navLinkStyle(isActive) {
  return {
    ...linkBase,
    color: isActive ? '#1c211d' : '#697269',
    fontWeight: isActive ? 600 : 500,
    borderBottom: isActive ? '2px solid #cc8400' : '2px solid transparent',
  };
}

export default function SiteNav({ activePage }) {
  const methods = useMethods();
  return (
    <nav style={navStyle} aria-label="Main navigation">
      <Link
        to="/"
        className="font-serif"
        style={{ fontWeight: 600, color: '#003d1e', textDecoration: 'none', fontSize: '1.125rem' }}
      >
        Zero-Dose Nigeria
      </Link>
      <div style={{ display: 'flex', gap: '1.75rem' }}>
        <Link
          to="/story"
          style={navLinkStyle(activePage === 'story')}
          aria-current={activePage === 'story' ? 'page' : undefined}
        >
          Story
        </Link>
        <Link
          to="/policy"
          style={navLinkStyle(activePage === 'policy')}
          aria-current={activePage === 'policy' ? 'page' : undefined}
        >
          Policy
        </Link>
        <Link
          to="/explorer/descriptive"
          style={navLinkStyle(activePage === 'explorer')}
          aria-current={activePage === 'explorer' ? 'page' : undefined}
        >
          Explorer
        </Link>
        <button
          type="button"
          onClick={() => methods?.open(methodsSectionForPage(activePage))}
          style={{ ...navLinkStyle(false), cursor: 'pointer' }}
          aria-label="Open methods drawer"
        >
          Methods
        </button>
      </div>
    </nav>
  );
}

function methodsSectionForPage(activePage) {
  switch (activePage) {
    case 'story':
      return 'overview';
    case 'policy':
      return 'causal-recipes';
    case 'explorer':
      return 'risk-model';
    default:
      return 'overview';
  }
}
