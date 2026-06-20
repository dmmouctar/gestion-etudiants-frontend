import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar  from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { getMonProfil } from '../../api/etudiant.api';
import { uploadPhoto }  from '../../api/profile.api';
import { useAuth }      from '../../context/AuthContext';
import { toast }        from 'react-toastify';

const ProfilEtudiant = () => {
  const { updatePhoto } = useAuth();
  const [profil, setProfil]       = useState(null);
  const [loading, setLoading]     = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileRef   = useRef(null);
  const BASE_URL  = 'http://localhost:8080';

  useEffect(() => {
    getMonProfil().then(r => setProfil(r.data.data))
                  .catch(err => console.error(err))
                  .finally(() => setLoading(false));
  }, []);

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
      toast.success('Photo mise à jour !');
    } catch { toast.error('Erreur upload photo'); }
    finally { setUploading(false); e.target.value = ''; }
  };

  const photoUrl = profil?.photoUrl
    ? BASE_URL + profil.photoUrl
    : null;

  const Row = ({ label, value }) => (
    <div style={{ display:'flex', padding:'11px 0', borderBottom:'1px solid #f1f5f9' }}>
      <span style={{ width:'180px', color:'#64748b', fontSize:'13px', fontWeight:'600' }}>{label}</span>
      <span style={{ color:'#1e293b', fontSize:'14px' }}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Mon Profil" />
        <div className="page-content">
          {loading ? <Spinner /> : profil && (
            <div className="card" style={{ maxWidth: '580px' }}>
              {/* Photo + infos principales */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  {photoUrl ? (
                    <img src={photoUrl} alt="Photo profil"
                      style={{ width: '90px', height: '90px', borderRadius: '50%',
                        objectFit: 'cover', border: '3px solid #3b82f6' }} />
                  ) : (
                    <div style={{
                      width: '90px', height: '90px', borderRadius: '50%',
                      background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'white', fontWeight: '700', fontSize: '32px'
                    }}>
                      {profil.prenom?.[0]}{profil.nom?.[0]}
                    </div>
                  )}
                  {/* Bouton caméra */}
                  <button
                    onClick={() => fileRef.current.click()}
                    style={{
                      position: 'absolute', bottom: 0, right: 0,
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: '#3b82f6', border: '2px solid white',
                      cursor: 'pointer', fontSize: '12px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                    title="Changer photo"
                  >
                    📷
                  </button>
                </div>

                <div>
                  <h2 style={{ margin: '0 0 4px', fontSize: '20px', fontWeight: '700' }}>
                    {profil.prenom} {profil.nom}
                  </h2>
                  <span className="badge badge-info">{profil.filiereNom}</span>
                  <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '13px' }}>
                    {profil.anneeAcademiqueNom} — Niveau {profil.anneeNiveau}
                  </p>
                </div>
              </div>

              {/* Bouton changer photo */}
              <button className="btn btn-secondary" style={{ marginBottom: '20px', width: '100%' }}
                onClick={() => fileRef.current.click()} disabled={uploading}>
                {uploading ? 'Chargement...' : '📷 Changer photo'}
              </button>

              <input ref={fileRef} type="file" accept="image/*"
                style={{ display: 'none' }} onChange={handleFileChange} />

              {/* Informations */}
              <Row label="CIN"              value={profil.cin} />
              <Row label="Email personnel"  value={profil.email} />
              <Row label="Email compte"     value={profil.emailCompte} />
              <Row label="Téléphone"        value={profil.telephone} />
              <Row label="Date naissance"   value={profil.dateNaissance} />
              <Row label="Adresse"          value={profil.adresse} />
              <Row label="Sexe"             value={profil.sexeNom} />
              <Row label="Filière"          value={profil.filiereNom} />
              <Row label="Année académique" value={profil.anneeAcademiqueNom} />
              <Row label="Niveau"           value={profil.anneeNiveau ? `Niveau ${profil.anneeNiveau}` : null} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilEtudiant;
