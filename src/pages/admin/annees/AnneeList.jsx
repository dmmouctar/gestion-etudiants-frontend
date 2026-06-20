import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import ConfirmModal from '../../../components/ConfirmModal';
import { getAnneesAdmin as getAnnees, creerAnnee, modifierAnnee, supprimerAnnee } from '../../../api/annee.api';

const AnneeList = () => {
  const [annees, setAnnees]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal]     = useState({ open: false, id: null });
  const [form, setForm]       = useState({ nom: '', niveau: 1 });
  const [editId, setEditId]   = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    try { const r = await getAnnees(); setAnnees(r.data.data || []); }
    catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await modifierAnnee(editId, form); toast.success('Année modifiée'); }
      else        { await creerAnnee(form);            toast.success('Année créée');    }
      setShowForm(false); setEditId(null); setForm({ nom:'', niveau:1 }); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const startEdit = (a) => {
    setEditId(a.id); setForm({ nom: a.nom, niveau: a.niveau }); setShowForm(true);
  };

  const handleSupprimer = async () => {
    try { await supprimerAnnee(modal.id); toast.success('Année supprimée'); fetch(); }
    catch { toast.error('Erreur suppression'); }
    finally { setModal({ open: false, id: null }); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Années Académiques" />
        <div className="page-content">
          <div className="page-header">
            <h2>📅 Années académiques ({annees.length})</h2>
            <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ nom:'', niveau:1 }); }}>
              ➕ Nouvelle année
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom:'20px' }}>
              <h3 style={{ marginBottom:'16px' }}>{editId ? '✏️ Modifier' : '➕ Nouvelle'} année</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0 16px' }}>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required placeholder="ex: 2024-2025" />
                  </div>
                  <div className="form-group">
                    <label>Niveau *</label>
                    <select value={form.niveau} onChange={e => setForm({...form, niveau: parseInt(e.target.value)})}>
                      {[1,2,3,4,5].map(n => <option key={n} value={n}>Niveau {n}</option>)}
                    </select>
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
                  <thead><tr><th>#</th><th>Nom</th><th>Niveau</th><th>Actions</th></tr></thead>
                  <tbody>
                    {annees.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>Aucune année</td></tr>
                    ) : annees.map((a, i) => (
                      <tr key={a.id}>
                        <td style={{ color:'#94a3b8' }}>{i+1}</td>
                        <td style={{ fontWeight:'600' }}>{a.nom}</td>
                        <td><span className="badge badge-info">Niveau {a.niveau}</span></td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-warning btn-sm" onClick={() => startEdit(a)}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setModal({ open:true, id:a.id })}>🗑</button>
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
      <ConfirmModal isOpen={modal.open} message="Supprimer cette année académique ?"
        onConfirm={handleSupprimer} onCancel={() => setModal({ open:false, id:null })} />
    </div>
  );
};

export default AnneeList;
