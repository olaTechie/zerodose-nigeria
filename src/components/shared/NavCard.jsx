export default function NavCard({ icon, title, description, accentColor = '#006633', onClick }) {
  return (
    <button
      className="nav-card glass-card"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderLeft: `4px solid ${accentColor}`,
        padding: '1.5rem',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        background: 'none',
        border: 'none',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        borderLeftColor: accentColor,
        textAlign: 'left',
        width: '100%',
        fontFamily: 'inherit',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,102,51,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.4rem', color: accentColor }}>
        {title}
      </h3>
      <p style={{ fontSize: '0.88rem', color: '#546e7a', lineHeight: 1.55, margin: 0 }}>
        {description}
      </p>
    </button>
  );
}
