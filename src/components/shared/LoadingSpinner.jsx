export default function LoadingSpinner() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '60vh',
      flexDirection: 'column',
      gap: '1rem',
    }}>
      <div
        className="motion-keep"
        style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e8f0e8',
          borderTopColor: '#006633',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ color: '#546e7a', fontSize: '0.85rem', fontWeight: 500 }}>Loading...</span>
    </div>
  );
}
