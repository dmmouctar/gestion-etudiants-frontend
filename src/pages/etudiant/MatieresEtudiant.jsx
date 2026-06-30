import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Sidebar from '../../components/Sidebar';
import Navbar  from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { getMatieresEtudiant } from '../../api/matiere.api';
import { getExamensEtudiant }  from '../../api/examen.api';
import { getMonProfil }        from '../../api/etudiant.api';

const MatieresEtudiant = () => {
  const [profil, setProfil]       = useState(null);
  const [matieres, setMatieres]   = useState([]);
  const [examensParMatiere, setExamensParMatiere] = useState({});
  const [loading, setLoading]     = useState(true);
  const [recherche, setRecherche] = useState('');
  const [tri, setTri]             = useState('nom-asc');
  const [matiereOuverte, setMatiereOuverte] = useState(null);

  // Charger le profil puis les matières de la filière de l'étudiant
  useEffect(() => {
    const init = async () => {
      try {
        const p = await getMonProfil();
        setProfil(p.data.data);
        const m = await getMatieresEtudiant({ filiereId: p.data.data.filiereId });
        setMatieres(m.data.data || []);
      } catch (err) {
        toast.error('Erreur lors du chargement des matières');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  // Charger les examens d'une matière au clic (accordéon)
  const toggleMatiere = async (matiereId) => {
    if (matiereOuverte === matiereId) {
      setMatiereOuverte(null);
      return;
    }
    setMatiereOuverte(matiereId);

    // Si déjà chargé, ne pas re-fetch
    if (examensParMatiere[matiereId]) return;

    try {
      const res = await getExamensEtudiant({ matiereId });
      setExamensParMatiere(prev => ({ ...prev, [matiereId]: res.data.data || [] }));
    } catch {
      toast.error('Erreur chargement des examens');
    }
  };

  // Filtrage par recherche (nom de la matière)
  const matieresFiltrees = matieres.filter(m =>
    m.nom.toLowerCase().includes(recherche.toLowerCase())
  );

  // Tri
  const matieresTriees = [...matieresFiltrees].sort((a, b) => {
    switch (tri) {
      case 'nom-asc':  return a.nom.localeCompare(b.nom);
      case 'nom-desc': return b.nom.localeCompare(a.nom);
      case 'coef-asc':  return a.coefficient - b.coefficient;
      case 'coef-desc': return b.coefficient - a.coefficient;
      default: return 0;
    }
  });

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Mes Matières" />
        <div className="page-content">

          <div className="page-header">
            <h2>📚 Mes matières — {profil?.filiereNom}</h2>
          </div>

          {/* Recherche + Tri */}
          <div className="search-bar">
            <input
              placeholder="🔍 Rechercher une matière..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)}
            />
            <select value={tri} onChange={e => setTri(e.target.value)}>
              <option value="nom-asc">Nom (A → Z)</option>
              <option value="nom-desc">Nom (Z → A)</option>
              <option value="coef-asc">Coefficient (croissant)</option>
              <option value="coef-desc">Coefficient (décroissant)</option>
            </select>
          </div>

          {loading ? <Spinner /> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {matieresTriees.length === 0 ? (
                <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
                  <p style={{ fontSize: '32px' }}>📭</p>
                  <p>Aucune matière trouvée</p>
                </div>
              ) : matieresTriees.map(matiere => (
                <div key={matiere.id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
                  {/* En-tête cliquable de la matière */}
                  <div
                    onClick={() => toggleMatiere(matiere.id)}
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', cursor: 'pointer',
                      background: matiereOuverte === matiere.id ? '#f8fafc' : 'white'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>📘</span>
                      <div>
                        <p style={{ margin: 0, fontWeight: '700', fontSize: '15px', color: '#1e293b' }}>
                          {matiere.nom}
                        </p>
                        <p style={{ margin: 0, fontSize: '12px', color: '#94a3b8' }}>
                          {matiere.filiereNom}
                        </p>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span className="badge badge-warning">×{matiere.coefficient}</span>
                      <span style={{
                        color: '#94a3b8', fontSize: '14px',
                        transform: matiereOuverte === matiere.id ? 'rotate(180deg)' : 'none',
                        transition: 'transform 0.2s'
                      }}>
                        ▼
                      </span>
                    </div>
                  </div>

                  {/* Liste des examens (accordéon) */}
                  {matiereOuverte === matiere.id && (
                    <div style={{ borderTop: '1px solid #e2e8f0' }}>
                      {!examensParMatiere[matiere.id] ? (
                        <div style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '13px' }}>
                          Chargement des examens...
                        </div>
                      ) : examensParMatiere[matiere.id].length === 0 ? (
                        <div style={{ padding: '16px 20px', color: '#94a3b8', fontSize: '13px' }}>
                          Aucun examen programmé pour cette matière
                        </div>
                      ) : (
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                          <thead style={{ background: '#f8fafc' }}>
                            <tr>
                              <th style={{ padding: '8px 20px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Type d'examen</th>
                              <th style={{ padding: '8px 20px', textAlign: 'left', color: '#64748b', fontWeight: '600' }}>Date</th>
                            </tr>
                          </thead>
                          <tbody>
                            {examensParMatiere[matiere.id].map(ex => (
                              <tr key={ex.id}>
                                <td style={{ padding: '8px 20px' }}>
                                  <span className="badge badge-info">{ex.typeExamenNom}</span>
                                </td>
                                <td style={{ padding: '8px 20px', color: '#475569' }}>
                                  {ex.dateExamen || 'Non planifiée'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatieresEtudiant;
