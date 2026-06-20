import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import ConfirmModal from '../../../components/ConfirmModal';
import { getFilieres, creerFiliere, modifierFiliere, supprimerFiliere } from '../../../api/filiere.api';

const FiliereList = () => {
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState({ open: false, id: null });
  const [form, setForm]         = useState({ nom: '', description: '' });
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    try { const r = await getFilieres(); setFilieres(r.data.data || []); }
    catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await modifierFiliere(editId, form); toast.success('Filière modifiée'); }
      else        { await creerFiliere(form);            toast.success('Filière créée');    }
      setShowForm(false); setEditId(null); setForm({ nom: '', description: '' }); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const startEdit = (f) => {
    setEditId(f.id); setForm({ nom: f.nom, description: f.description || '' }); setShowForm(true);
  };

  const handleSupprimer = async () => {
    try { await supprimerFiliere(modal.id); toast.success('Filière supprimée'); fetch(); }
    catch { toast.error('Erreur suppression'); }
    finally { setModal({ open: false, id: null }); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Gestion des Filières" />
        <div className="page-content">
          <div className="page-header">
            <h2>🏫 Filières ({filieres.length})</h2>
            <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ nom:'', description:'' }); }}>
              ➕ Nouvelle filière
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom:'20px' }}>
              <h3 style={{ marginBottom:'16px' }}>{editId ? '✏️ Modifier' : '➕ Nouvelle'} filière</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required placeholder="ex: Informatique" />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <input value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="Description de la filière" />
                  </div>
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button type="submit" className="btn btn-primary">💾 Enregistrer</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Annuler</button>
                </div>
              </form>
            </div>
          )}

          <div className="card" style={{ padding:0 }}>
            {loading ? <Spinner /> : (
              <div className="table-container">
                <table>
                  <thead><tr><th>#</th><th>Nom</th><th>Description</th><th>Actions</th></tr></thead>
                  <tbody>
                    {filieres.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>Aucune filière</td></tr>
                    ) : filieres.map((f, i) => (
                      <tr key={f.id}>
                        <td style={{ color:'#94a3b8' }}>{i+1}</td>
                        <td style={{ fontWeight:'600' }}>{f.nom}</td>
                        <td style={{ color:'#64748b' }}>{f.description || '—'}</td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-warning btn-sm" onClick={() => startEdit(f)}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setModal({ open:true, id:f.id })}>🗑</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
      <ConfirmModal isOpen={modal.open} message="Supprimer cette filière ?"
        onConfirm={handleSupprimer} onCancel={() => setModal({ open:false, id:null })} />
    </div>
  );
};

export default FiliereList;
