import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import ConfirmModal from '../../../components/ConfirmModal';
import { getMatieres, creerMatiere, modifierMatiere, supprimerMatiere } from '../../../api/matiere.api';
import { getFilieres } from '../../../api/filiere.api';

const MatiereList = () => {
  const [matieres, setMatieres] = useState([]);
  const [filieres, setFilieres] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState({ open: false, id: null });
  const [form, setForm]         = useState({ nom: '', coefficient: 1, filiereId: '' });
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [filtreFiliere, setFiltreFiliere] = useState('');

  const fetch = async () => {
    try {
      const params = filtreFiliere ? { filiereId: filtreFiliere } : {};
      const [m, f] = await Promise.all([getMatieres(params), getFilieres()]);
      setMatieres(m.data.data || []);
      setFilieres(f.data.data || []);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [filtreFiliere]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await modifierMatiere(editId, form); toast.success('Matière modifiée'); }
      else        { await creerMatiere(form);            toast.success('Matière créée');    }
      setShowForm(false); setEditId(null); setForm({ nom:'', coefficient:1, filiereId:'' }); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const startEdit = (m) => {
    setEditId(m.id); setForm({ nom: m.nom, coefficient: m.coefficient, filiereId: m.filiereId }); setShowForm(true);
  };

  const handleSupprimer = async () => {
    try { await supprimerMatiere(modal.id); toast.success('Matière supprimée'); fetch(); }
    catch { toast.error('Erreur suppression'); }
    finally { setModal({ open: false, id: null }); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Gestion des Matières" />
        <div className="page-content">
          <div className="page-header">
            <h2>📚 Matières ({matieres.length})</h2>
            <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ nom:'', coefficient:1, filiereId:'' }); }}>
              ➕ Nouvelle matière
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom:'20px' }}>
              <h3 style={{ marginBottom:'16px' }}>{editId ? '✏️ Modifier' : '➕ Nouvelle'} matière</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0 16px' }}>
                  <div className="form-group">
                    <label>Nom *</label>
                    <input value={form.nom} onChange={e => setForm({...form, nom: e.target.value})} required placeholder="ex: Algorithmique" />
                  </div>
                  <div className="form-group">
                    <label>Coefficient *</label>
                    <input type="number" step="0.5" min="0.5" max="10"
                      value={form.coefficient} onChange={e => setForm({...form, coefficient: parseFloat(e.target.value)})} required />
                  </div>
                  <div className="form-group">
                    <label>Filière *</label>
                    <select value={form.filiereId} onChange={e => setForm({...form, filiereId: e.target.value})} required>
                      <option value="">-- Sélectionner --</option>
                      {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
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

          <div className="search-bar">
            <select value={filtreFiliere} onChange={e => setFiltreFiliere(e.target.value)}>
              <option value="">Toutes les filières</option>
              {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
          </div>

          <div className="card" style={{ padding:0 }}>
            {loading ? <Spinner /> : (
              <div className="table-container">
                <table>
                  <thead><tr><th>#</th><th>Nom</th><th>Coefficient</th><th>Filière</th><th>Actions</th></tr></thead>
                  <tbody>
                    {matieres.length === 0 ? (
                      <tr><td colSpan="5" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>Aucune matière</td></tr>
                    ) : matieres.map((m, i) => (
                      <tr key={m.id}>
                        <td style={{ color:'#94a3b8' }}>{i+1}</td>
                        <td style={{ fontWeight:'600' }}>{m.nom}</td>
                        <td><span className="badge badge-warning">×{m.coefficient}</span></td>
                        <td><span className="badge badge-info">{m.filiereNom}</span></td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-warning btn-sm" onClick={() => startEdit(m)}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setModal({ open:true, id:m.id })}>🗑</button>
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
      <ConfirmModal isOpen={modal.open} message="Supprimer cette matière ?"
        onConfirm={handleSupprimer} onCancel={() => setModal({ open:false, id:null })} />
    </div>
  );
};

export default MatiereList;

