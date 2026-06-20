import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import ConfirmModal from '../../../components/ConfirmModal';
import { getExamens, creerExamen, modifierExamen, supprimerExamen } from '../../../api/examen.api';
import { getMatieres } from '../../../api/matiere.api';

const TYPES = [
  { id: 1, nom: 'Contrôle Continu' },
  { id: 2, nom: 'Examen Final'     },
  { id: 3, nom: 'Rattrapage'       },
];

const ExamenList = () => {
  const [examens, setExamens]   = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [modal, setModal]       = useState({ open: false, id: null });
  const [form, setForm]         = useState({ typeExamenId: 1, matiereId: '', dateExamen: '' });
  const [editId, setEditId]     = useState(null);
  const [showForm, setShowForm] = useState(false);

  const fetch = async () => {
    try {
      const [e, m] = await Promise.all([getExamens(), getMatieres()]);
      setExamens(e.data.data  || []);
      setMatieres(m.data.data || []);
    } catch { toast.error('Erreur chargement'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) { await modifierExamen(editId, form); toast.success('Examen modifié'); }
      else        { await creerExamen(form);            toast.success('Examen créé');    }
      setShowForm(false); setEditId(null); setForm({ typeExamenId:1, matiereId:'', dateExamen:'' }); fetch();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const startEdit = (ex) => {
    setEditId(ex.id);
    setForm({ typeExamenId: ex.typeExamenId, matiereId: ex.matiereId, dateExamen: ex.dateExamen || '' });
    setShowForm(true);
  };

  const handleSupprimer = async () => {
    try { await supprimerExamen(modal.id); toast.success('Examen supprimé'); fetch(); }
    catch { toast.error('Erreur suppression'); }
    finally { setModal({ open: false, id: null }); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Gestion des Examens" />
        <div className="page-content">
          <div className="page-header">
            <h2>📝 Examens ({examens.length})</h2>
            <button className="btn btn-primary" onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ typeExamenId:1, matiereId:'', dateExamen:'' }); }}>
              ➕ Nouvel examen
            </button>
          </div>

          {showForm && (
            <div className="card" style={{ marginBottom:'20px' }}>
              <h3 style={{ marginBottom:'16px' }}>{editId ? '✏️ Modifier' : '➕ Nouvel'} examen</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0 16px' }}>
                  <div className="form-group">
                    <label>Type d'examen *</label>
                    <select value={form.typeExamenId} onChange={e => setForm({...form, typeExamenId: parseInt(e.target.value)})} required>
                      {TYPES.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Matière *</label>
                    <select value={form.matiereId} onChange={e => setForm({...form, matiereId: e.target.value})} required>
                      <option value="">-- Sélectionner --</option>
                      {matieres.map(m => <option key={m.id} value={m.id}>{m.nom} ({m.filiereNom})</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Date</label>
                    <input type="date" value={form.dateExamen} onChange={e => setForm({...form, dateExamen: e.target.value})} />
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
                  <thead><tr><th>#</th><th>Matière</th><th>Type</th><th>Date</th><th>Filière</th><th>Actions</th></tr></thead>
                  <tbody>
                    {examens.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>Aucun examen</td></tr>
                    ) : examens.map((ex, i) => (
                      <tr key={ex.id}>
                        <td style={{ color:'#94a3b8' }}>{i+1}</td>
                        <td style={{ fontWeight:'600' }}>{ex.matiereNom}</td>
                        <td><span className="badge badge-info">{ex.typeExamenNom}</span></td>
                        <td>{ex.dateExamen || '—'}</td>
                        <td style={{ color:'#64748b' }}>{ex.filiereNom || '—'}</td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-warning btn-sm" onClick={() => startEdit(ex)}>✏️</button>
                            <button className="btn btn-danger btn-sm" onClick={() => setModal({ open:true, id:ex.id })}>🗑</button>
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
      <ConfirmModal isOpen={modal.open} message="Supprimer cet examen ?"
        onConfirm={handleSupprimer} onCancel={() => setModal({ open:false, id:null })} />
    </div>
  );
};

export default ExamenList;
