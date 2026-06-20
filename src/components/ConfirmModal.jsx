import React from 'react';

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;
  return (
    <div style={{
      position: 'fixed', inset: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000
    }}>
      <div style={{
        background: 'white', borderRadius: '12px',
        padding: '32px', maxWidth: '400px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h3 style={{ margin: '0 0 12px', color: '#1e293b', fontSize: '18px' }}>
          Confirmation
        </h3>
        <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px' }}>
          {message}
        </p>
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
          <button onClick={onCancel} style={{
            padding: '8px 20px', borderRadius: '8px',
            border: '1px solid #e2e8f0', background: 'white',
            cursor: 'pointer', fontSize: '14px', color: '#64748b'
          }}>
            Annuler
          </button>
          <button onClick={onConfirm} style={{
            padding: '8px 20px', borderRadius: '8px',
            border: 'none', background: '#ef4444',
            cursor: 'pointer', fontSize: '14px', color: 'white',
            fontWeight: '600'
          }}>
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
