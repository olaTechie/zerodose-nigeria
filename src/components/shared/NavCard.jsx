export default function NavCard({ icon, title, description, accentColor = '#006633', onClick }) {
  return (
    <button
      className="nav-card glass-card"
      onClick={onClick}
      type="button"
      style={{
        cursor: 'pointer',
        '--nav-card-accent': accentColor,
      }}
    >
      <div className="nav-card-icon" aria-hidden="true">{icon}</div>
      <h3 className="nav-card-title">
        {title}
      </h3>
      <p className="nav-card-desc">
        {description}
      </p>
      <span className="nav-card-action" aria-hidden="true">Open</span>
    </button>
  );
}
