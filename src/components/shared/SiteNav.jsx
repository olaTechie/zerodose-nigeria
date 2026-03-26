import { Link } from 'react-router-dom';

const navStyle = {
  position: 'sticky',
  top: 0,
  zIndex: 100,
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(12px)',
  padding: '0.6rem 1.5rem',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  borderBottom: '1px solid rgba(0,102,51,0.1)',
};

const linkBase = {
  textDecoration: 'none',
  fontSize: '0.85rem',
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export default function SiteNav({ activePage }) {
  return (
    <nav style={navStyle} aria-label="Main navigation">
      <Link to="/" style={{ fontWeight: 700, color: '#006633', textDecoration: 'none' }}>
        Zero-Dose Nigeria
      </Link>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link
          to="/story"
          style={{
            ...linkBase,
            color: activePage === 'story' ? '#006633' : '#546e7a',
            fontWeight: activePage === 'story' ? 600 : 400,
          }}
          aria-current={activePage === 'story' ? 'page' : undefined}
        >
          Story
        </Link>
        <Link
          to="/policy"
          style={{
            ...linkBase,
            color: activePage === 'policy' ? '#006633' : '#546e7a',
            fontWeight: activePage === 'policy' ? 600 : 400,
          }}
          aria-current={activePage === 'policy' ? 'page' : undefined}
        >
          Policy
        </Link>
        <Link
          to="/explorer/descriptive"
          style={{
            ...linkBase,
            color: activePage === 'explorer' ? '#006633' : '#546e7a',
            fontWeight: activePage === 'explorer' ? 600 : 400,
          }}
          aria-current={activePage === 'explorer' ? 'page' : undefined}
        >
          Explorer
        </Link>
      </div>
    </nav>
  );
}
