import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { uploadPhoto } from '../api/profile.api';
import { toast } from 'react-toastify';

const Navbar = ({ title }) => {
  const { user, logout, updatePhoto, isAdmin } = useAuth();
  const [showMenu, setShowMenu]   = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef  = useRef(null);
  const navigate = useNavigate();

  const BASE_URL = 'http://localhost:8080';

  const photoUrl = user?.photoUrl
    ? (user.photoUrl.startsWith('http') ? user.photoUrl : `${BASE_URL}${user.photoUrl}`)
    : null;

  const handlePhotoClick = () => {
    setShowMenu(false);
    fileRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La photo ne doit pas dépasser 5MB');
      return;
    }
    setUploading(true);
    try {
      const res = await uploadPhoto(file);
      updatePhoto(res.data.data.photoUrl);
      toast.success('📷 Photo de profil mise à jour !');
    } catch {
      toast.error('Erreur lors du chargement de la photo');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const goToProfil = () => {
    setShowMenu(false);
    if (isAdmin()) navigate('/admin/mon-profil');
    else navigate('/etudiant/profil');
  };

  return (
    // ← CORRECTION : sticky top:0 pour rester visible au scroll
    <header className="navbar-sticky" style={{
      height: '64px', background: 'white',
      borderBottom: '1px solid #e2e8f0',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 20px', flexShrink: 0,
      position: 'sticky', top: 0, zIndex: 60
    }}>
      <h1 className="navbar-title" style={{
        margin: 0, fontSize: '18px',
        fontWeight: '700', color: '#1e293b',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
      }}>
        {title}
      </h1>

      <div style={{ position: 'relative', flexShrink: 0 }}>
        <div
          onClick={() => setShowMenu(!showMenu)}
          style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            cursor: 'pointer', padding: '6px 10px',
            borderRadius: '10px', border: '1px solid #e2e8f0',
            background: showMenu ? '#f8fafc' : 'white',
            transition: 'all 0.2s'
          }}
        >
          {uploading ? (
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: '#f1f5f9', display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', color: '#94a3b8'
            }}>⏳</div>
          ) : photoUrl ? (
            <img
              src={photoUrl}
              alt="Photo de profil"
              style={{
                width: '36px', height: '36px',
                borderRadius: '50%', objectFit: 'cover',
                border: '2px solid #3b82f6'
              }}
              onError={(e) => { e.target.style.display = 'none'; }}
            />
          ) : (
            <div style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: '700', fontSize: '14px'
            }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
          )}

          <div className="navbar-user-info">
            <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>
              {user?.name}
            </p>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8' }}>
              {user?.role === 'ADMIN' ? '👑 Admin' : '👨‍🎓 Étudiant'}
            </p>
          </div>
          <span style={{ color: '#94a3b8', fontSize: '10px' }}>▼</span>
        </div>

        {showMenu && (
          <>
            <div style={{ position: 'fixed', inset: 0, zIndex: 98 }} onClick={() => setShowMenu(false)} />
            <div style={{
              position: 'absolute', right: 0, top: '52px',
              background: 'white', borderRadius: '12px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
              border: '1px solid #e2e8f0',
              minWidth: '220px', maxWidth: '90vw', zIndex: 99, overflow: 'hidden'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid #f1f5f9' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt="Profil"
                      style={{ width: '44px', height: '44px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #3b82f6' }} />
                  ) : (
                    <div style={{
                      width: '44px', height: '44px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: '700', fontSize: '18px'
                    }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <div style={{ minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.name}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {user?.email}
                    </p>
                  </div>
                </div>
              </div>

              <div style={{ padding: '8px' }}>
                <MenuItem icon="👤" label="Voir mon profil" onClick={goToProfil} />
                <MenuItem icon="📷" label="Changer la photo" onClick={handlePhotoClick} />
                <div style={{ borderTop: '1px solid #f1f5f9', margin: '4px 0' }} />
                <MenuItem icon="🚪" label="Déconnexion" onClick={logout} danger />
              </div>
            </div>
          </>
        )}

        <input
          ref={fileRef}
          type="file"
          accept="image/jpeg,image/png,image/gif,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
      </div>
    </header>
  );
};

const MenuItem = ({ icon, label, onClick, danger }) => (
  <button
    onClick={onClick}
    style={{
      width: '100%', padding: '9px 12px',
      border: 'none', background: 'transparent',
      cursor: 'pointer', textAlign: 'left',
      fontSize: '14px',
      color: danger ? '#ef4444' : '#374151',
      display: 'flex', alignItems: 'center', gap: '10px',
      borderRadius: '8px', transition: 'background 0.15s'
    }}
    onMouseEnter={e => e.currentTarget.style.background = danger ? '#fef2f2' : '#f8fafc'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
  >
    <span>{icon}</span>
    <span>{label}</span>
  </button>
);

export default Navbar;
