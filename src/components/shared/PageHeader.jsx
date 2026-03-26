export default function PageHeader({ title, subtitle }) {
  return (
    <div className="page-header" style={{ animation: 'fadeIn 0.45s ease-out' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0d1b2a', marginBottom: '0.35rem' }}>
        {title}
      </h1>
      {subtitle && (
        <p className="page-subtitle" style={{ fontSize: '0.95rem', color: '#546e7a', maxWidth: '700px', lineHeight: 1.55, margin: 0 }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
