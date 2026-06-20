import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import { getEtudiant, creerEtudiant, modifierEtudiant } from '../../../api/etudiant.api';
import { getFilieres } from '../../../api/filiere.api';
import { getAnneesAdmin } from '../../../api/annee.api';
import api from '../../../api/axios';

const BASE_URL = 'http://localhost:8080';

const EtudiantForm = () => {
  const { id }     = useParams();
  const isEdit     = !!id;
  const navigate   = useNavigate();
  const [loading, setLoading]     = useState(false);
  const [filieres, setFilieres]   = useState([]);
  const [annees, setAnnees]       = useState([]);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [userId, setUserId]       = useState(null);
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    nom: '', prenom: '', cin: '', email: '',
    dateNaissance: '', adresse: '', telephone: '',
    emailCompte: '', motDePasse: '',
    sexeId: 1, filiereId: '', anneeAcademiqueId: ''
  });

  useEffect(() => {
    const init = async () => {
      const [f, a] = await Promise.all([getFilieres(), getAnneesAdmin()]);
      setFilieres(f.data.data || []);
      setAnnees(a.data.data   || []);
      if (isEdit) {
        const res = await getEtudiant(id);
        const e   = res.data.data;
        setUserId(e.userId);
        setForm({
          nom: e.nom, prenom: e.prenom, cin: e.cin || '',
          email: e.email || '', dateNaissance: e.dateNaissance || '',
          adresse: e.adresse || '', telephone: e.telephone || '',
          emailCompte: e.emailCompte || '', motDePasse: '',
          sexeId: e.sexeId || 1,
          filiereId: e.filiereId || '',
          anneeAcademiqueId: e.anneeAcademiqueId || ''
        });
        // Charger la photo existante si disponible
        if (e.photoUrl) setPhotoPreview(BASE_URL + e.photoUrl);
      }
    };
    init();
  }, [id]);

  // Prévisualisation photo sélectionnée
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('La photo ne doit pas dépasser 5MB');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let savedUserId = userId;

      if (isEdit) {
        await modifierEtudiant(id, form);
        toast.success('Étudiant modifié avec succès');
      } else {
        const res = await creerEtudiant(form);
        savedUserId = res.data.data?.userId;
        toast.success('Étudiant créé avec succès');
      }

      // Upload de la photo si sélectionnée
      if (photoFile && savedUserId) {
        try {
          const formData = new FormData();
          formData.append('file', photoFile);
          // Upload via l'endpoint admin en passant le userId
          await api.post(`/profile/photo/user/${savedUserId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
          });
        } catch {
          toast.warning('Étudiant enregistré mais erreur upload photo');
        }
      }

      navigate('/admin/etudiants');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title={isEdit ? 'Modifier Étudiant' : 'Nouvel Étudiant'} />
        <div className="page-content">
          <div className="card" style={{ maxWidth: '720px' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'24px' }}>
              <h2 style={{ fontSize:'18px', fontWeight:'700' }}>
                {isEdit ? '✏️ Modifier' : '➕ Créer'} un étudiant
              </h2>
              <button className="btn btn-secondary" onClick={() => navigate('/admin/etudiants')}>
                ← Retour
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              {/* ── Section Photo ── */}
              <div style={{ marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '14px' }}>
                  📷 Photo de profil
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                  {/* Prévisualisation */}
                  <div style={{ flexShrink: 0 }}>
                    {photoPreview ? (
                      <img src={photoPreview} alt="Aperçu"
                        style={{ width: '80px', height: '80px', borderRadius: '50%',
                          objectFit: 'cover', border: '3px solid #3b82f6' }} />
                    ) : (
                      <div style={{
                        width: '80px', height: '80px', borderRadius: '50%',
                        background: '#f1f5f9', border: '2px dashed #cbd5e1',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '24px', cursor: 'pointer'
                      }} onClick={() => fileRef.current.click()}>
                        📷
                      </div>
                    )}
                  </div>
                  <div>
                    <button type="button" className="btn btn-secondary"
                      onClick={() => fileRef.current.click()}>
                      {photoPreview ? '🔄 Changer la photo' : '📷 Ajouter une photo'}
                    </button>
                    <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                      JPG, PNG ou GIF — max 5MB
                    </p>
                    <input ref={fileRef} type="file" accept="image/*"
                      style={{ display: 'none' }} onChange={handlePhotoChange} />
                  </div>
                </div>
              </div>

              {/* ── Informations personnelles ── */}
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '14px' }}>
                👤 Informations personnelles
              </h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                <div className="form-group">
                  <label>Nom *</label>
                  <input value={form.nom} onChange={set('nom')} required placeholder="Nom de famille" />
                </div>
                <div className="form-group">
                  <label>Prénom *</label>
                  <input value={form.prenom} onChange={set('prenom')} required placeholder="Prénom" />
                </div>
                <div className="form-group">
                  <label>CIN</label>
                  <input value={form.cin} onChange={set('cin')} placeholder="AB123456" />
                </div>
                <div className="form-group">
                  <label>Date de naissance</label>
                  <input type="date" value={form.dateNaissance} onChange={set('dateNaissance')} />
                </div>
                <div className="form-group">
                  <label>Email personnel</label>
                  <input type="email" value={form.email} onChange={set('email')} placeholder="email@exemple.com" />
                </div>
                <div className="form-group">
                  <label>Téléphone</label>
                  <input value={form.telephone} onChange={set('telephone')} placeholder="+212 6xx xxx xxx" />
                </div>
                <div className="form-group" style={{ gridColumn:'span 2' }}>
                  <label>Adresse</label>
                  <input value={form.adresse} onChange={set('adresse')} placeholder="Adresse complète" />
                </div>
                <div className="form-group">
                  <label>Sexe</label>
                  <select value={form.sexeId} onChange={set('sexeId')}>
                    <option value={1}>Masculin</option>
                    <option value={2}>Féminin</option>
                  </select>
                </div>
              </div>

              {/* ── Informations académiques ── */}
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', margin: '8px 0 14px' }}>
                🎓 Informations académiques
              </h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                <div className="form-group">
                  <label>Filière *</label>
                  <select value={form.filiereId} onChange={set('filiereId')} required>
                    <option value="">-- Sélectionner --</option>
                    {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label>Année académique *</label>
                  <select value={form.anneeAcademiqueId} onChange={set('anneeAcademiqueId')} required>
                    <option value="">-- Sélectionner --</option>
                    {annees.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                  </select>
                </div>
              </div>

              {/* ── Compte de connexion ── */}
              <h3 style={{ fontSize: '14px', fontWeight: '600', color: '#475569', margin: '8px 0 14px' }}>
                🔐 Compte de connexion
              </h3>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                <div className="form-group">
                  <label>Email du compte *</label>
                  <input type="email" value={form.emailCompte} onChange={set('emailCompte')}
                    required={!isEdit} placeholder="compte@school.ma" />
                </div>
                <div className="form-group">
                  <label>Mot de passe {isEdit ? '(vide = inchangé)' : '*'}</label>
                  <input type="password" value={form.motDePasse} onChange={set('motDePasse')}
                    required={!isEdit} placeholder="••••••••" minLength={6} />
                </div>
              </div>

              {/* Boutons */}
              <div style={{ display:'flex', gap:'12px', justifyContent:'flex-end', marginTop:'16px' }}>
                <button type="button" className="btn btn-secondary"
                  onClick={() => navigate('/admin/etudiants')}>
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? '⏳ Enregistrement...' : '💾 Enregistrer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EtudiantForm;
