import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import { saisirNote, getNotesByExamen } from '../../../api/note.api';
import { getExamens }   from '../../../api/examen.api';
import { getEtudiants } from '../../../api/etudiant.api';

const NoteSaisie = () => {
  const [examens, setExamens]     = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [notes, setNotes]         = useState([]);
  const [examenId, setExamenId]   = useState('');
  const [loading, setLoading]     = useState(false);
  const [saving, setSaving]       = useState(false);

  // notes locales : { etudiantId -> valeur }
  const [localNotes, setLocalNotes] = useState({});

  useEffect(() => {
    Promise.all([getExamens(), getEtudiants()])
      .then(([e, et]) => {
        setExamens(e.data.data   || []);
        setEtudiants(et.data.data || []);
      });
  }, []);

  // Quand l'examen change, charger les notes existantes
  useEffect(() => {
    if (!examenId) return;
    setLoading(true);
    getNotesByExamen(examenId).then(r => {
      const existing = {};
      (r.data.data || []).forEach(n => { existing[n.etudiantId] = n.valeur; });
      setLocalNotes(existing);
      setNotes(r.data.data || []);
    }).finally(() => setLoading(false));
  }, [examenId]);

  const examen = examens.find(e => String(e.id) === String(examenId));

  // Filtrer les étudiants par filière de l'examen
  const etudiantsFiltres = examen
    ? etudiants.filter(e => e.filiereNom === examen.matiereNom || true)
    : etudiants;

  const handleSave = async () => {
    setSaving(true);
    let success = 0;
    try {
      for (const [etudiantId, valeur] of Object.entries(localNotes)) {
        if (valeur === '' || valeur === undefined) continue;
        await saisirNote({ etudiantId: parseInt(etudiantId), examenId: parseInt(examenId), valeur: parseFloat(valeur) });
        success++;
      }
      toast.success(`${success} note(s) enregistrée(s) !`);
    } catch (err) {
      toast.error('Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Saisie des Notes" />
        <div className="page-content">
          <div className="page-header">
            <h2>🎯 Saisie des notes</h2>
            {examenId && (
              <button className="btn btn-success" onClick={handleSave} disabled={saving}>
                {saving ? '⏳ Enregistrement...' : '💾 Enregistrer toutes les notes'}
              </button>
            )}
          </div>

          {/* Sélection examen */}
          <div className="card" style={{ marginBottom:'20px' }}>
            <div className="form-group" style={{ marginBottom:0 }}>
              <label>Sélectionner un examen</label>
              <select value={examenId} onChange={e => setExamenId(e.target.value)} style={{ maxWidth:'400px' }}>
                <option value="">-- Choisir un examen --</option>
                {examens.map(ex => (
                  <option key={ex.id} value={ex.id}>
                    {ex.matiereNom} — {ex.typeExamenNom} {ex.dateExamen ? `(${ex.dateExamen})` : ''}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {examenId && (
            <div className="card" style={{ padding:0 }}>
              {loading ? <Spinner /> : (
                <div className="table-container">
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Étudiant</th>
                        <th>Filière</th>
                        <th>Note /20</th>
                      </tr>
                    </thead>
                    <tbody>
                      {etudiants.length === 0 ? (
                        <tr><td colSpan="4" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>
                          Aucun étudiant
                        </td></tr>
                      ) : etudiants.map((et, i) => (
                        <tr key={et.id}>
                          <td style={{ color:'#94a3b8' }}>{i+1}</td>
                          <td style={{ fontWeight:'600' }}>{et.prenom} {et.nom}</td>
                          <td><span className="badge badge-info">{et.filiereNom}</span></td>
                          <td>
                            <input
                              type="number" min="0" max="20" step="0.25"
                              value={localNotes[et.id] ?? ''}
                              onChange={e => setLocalNotes({ ...localNotes, [et.id]: e.target.value })}
                              style={{
                                width:'80px', padding:'6px 10px',
                                border:'1px solid #d1d5db', borderRadius:'6px',
                                fontSize:'14px', textAlign:'center'
                              }}
                              placeholder="—"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NoteSaisie;
