import React from 'react';

const Spinner = ({ message = 'Chargement...' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    height: '200px', gap: '16px'
  }}>
    <div style={{
      width: '40px', height: '40px',
      border: '4px solid #e2e8f0',
      borderTop: '4px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <p style={{ color: '#64748b', fontSize: '14px' }}>{message}</p>
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
  </div>
);

export default Spinner;