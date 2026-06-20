import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar  from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { useAuth } from '../../context/AuthContext';
import { getMe, uploadPhoto } from '../../api/profile.api';
import { toast } from 'react-toastify';

const MonProfil = () => {
  const { updatePhoto, user } = useAuth();
  const [profil, setProfil]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const [imgError, setImgError]   = useState(false);
  const fileRef = useRef(null);
  const BASE_URL = 'http://localhost:8080';

  useEffect(() => {
    getMe().then(r => {
      setProfil(r.data.data);
      setImgError(false);
    }).finally(() => setLoading(false));
  }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Desolé la photo ne doit pas dépasser 5MB');
      return;
    }
    setUploading(true);
    setImgError(false);
    try {
      const res = await uploadPhoto(file);
      const newPhotoUrl = res.data.data.photoUrl;
      updatePhoto(newPhotoUrl);
      setProfil(prev => ({ ...prev, photoUrl: newPhotoUrl }));
      toast.success('Photo mise à jour !');
    } catch { toast.error('Erreur upload photo'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const photoUrl = profil?.photoUrl && !imgError
    ? `${BASE_URL}${profil.photoUrl}?t=${Date.now()}`
    : null;

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Mon Profil" />
        <div className="page-content">
          {loading ? <Spinner /> : (
            <div className="card" style={{ maxWidth:'500px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:'700', marginBottom:'24px' }}>
                👑 Admin
              </h2>

              {/* Photo */}
              <div style={{ display:'flex', alignItems:'center', gap:'20px', marginBottom:'28px' }}>
                <div style={{ position:'relative' }}>
                  {photoUrl ? (
                    <img
                      src={photoUrl}
                      alt="Photo de profil"
                      onError={() => setImgError(true)}
                      style={{
                        width:'90px', height:'90px', borderRadius:'50%',
                        objectFit:'cover', border:'3px solid #3b82f6',
                        display:'block'
                      }}
                    />
                  ) : (
                    <div style={{
                      width:'90px', height:'90px', borderRadius:'50%',
                      background:'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      display:'flex', alignItems:'center', justifyContent:'center',
                      color:'white', fontWeight:'700', fontSize:'32px'
                    }}>
                      {profil?.name?.[0]?.toUpperCase()}
                    </div>
                  )}
                  <button
                    onClick={() => fileRef.current.click()}
                    title="Changer photo"
                    style={{
                      position:'absolute', bottom:0, right:0,
                      width:'28px', height:'28px', borderRadius:'50%',
                      background:'#3b82f6', border:'2px solid white',
                      cursor:'pointer', fontSize:'13px',
                      display:'flex', alignItems:'center', justifyContent:'center'
                    }}
                  >📷</button>
                </div>

                <div>
                  <h3 style={{ margin:'0 0 4px', fontSize:'18px', fontWeight:'700' }}>
                    {profil?.name}
                  </h3>
                  <p style={{ margin:'0 0 8px', color:'#64748b', fontSize:'14px' }}>
                    {profil?.email}
                  </p>
                  <span className="badge badge-info">👑 Admin</span>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => fileRef.current.click()}
                disabled={uploading}
                style={{ width:'100%' }}
              >
                {uploading ? ' Chargement...' : '📷 Changer photo'}
              </button>

              <input ref={fileRef} type="file" accept="image/*"
                style={{ display:'none' }} onChange={handleFileChange} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MonProfil;
