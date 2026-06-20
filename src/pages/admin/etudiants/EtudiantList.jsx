import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import ConfirmModal from '../../../components/ConfirmModal';
import { getEtudiants, supprimerEtudiant } from '../../../api/etudiant.api';
import { getFilieres } from '../../../api/filiere.api';
import { getAnnees }   from '../../../api/annee.api';

const EtudiantList = () => {
  const [etudiants, setEtudiants]   = useState([]);
  const [filieres, setFilieres]     = useState([]);
  const [annees, setAnnees]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [recherche, setRecherche]   = useState('');
  const [filiereId, setFiliereId]   = useState('');
  const [anneeId, setAnneeId]       = useState('');
  const [modal, setModal]           = useState({ open: false, id: null });
  const navigate = useNavigate();

  const fetchEtudiants = async () => {
    try {
      const params = {};
      if (recherche) params.recherche = recherche;
      if (filiereId) params.filiereId = filiereId;
      if (anneeId)   params.anneeId   = anneeId;
      const res = await getEtudiants(params);
      setEtudiants(res.data.data || []);
    } catch { toast.error('Erreur lors du chargement'); }
    finally  { setLoading(false); }
  };

  useEffect(() => {
    const init = async () => {
      const [f, a] = await Promise.all([getFilieres(), getAnnees()]);
      setFilieres(f.data.data || []);
      setAnnees(a.data.data   || []);
      fetchEtudiants();
    };
    init();
  }, []);

  useEffect(() => { fetchEtudiants(); }, [recherche, filiereId, anneeId]);

  const handleSupprimer = async () => {
    try {
      await supprimerEtudiant(modal.id);
      toast.success('Étudiant supprimé');
      setModal({ open: false, id: null });
      fetchEtudiants();
    } catch { toast.error('Erreur lors de la suppression'); }
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Gestion des Étudiants" />
        <div className="page-content">
          <div className="page-header">
            <h2>👨‍🎓 Étudiants ({etudiants.length})</h2>
            <button className="btn btn-primary"
              onClick={() => navigate('/admin/etudiants/nouveau')}>
              ➕ Nouvel étudiant
            </button>
          </div>

          {/* Filtres */}
          <div className="search-bar">
            <input placeholder="🔍 Rechercher par nom..."
              value={recherche}
              onChange={e => setRecherche(e.target.value)} />
            <select value={filiereId} onChange={e => setFiliereId(e.target.value)}>
              <option value="">Toutes les filières</option>
              {filieres.map(f => <option key={f.id} value={f.id}>{f.nom}</option>)}
            </select>
            <select value={anneeId} onChange={e => setAnneeId(e.target.value)}>
              <option value="">Toutes les années</option>
              {annees.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
            </select>
          </div>

          {/* Tableau */}
          <div className="card" style={{ padding: 0 }}>
            {loading ? <Spinner /> : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Nom complet</th>
                      <th>CIN</th>
                      <th>Email</th>
                      <th>Filière</th>
                      <th>Année</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {etudiants.length === 0 ? (
                      <tr><td colSpan="7" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>
                        Aucun étudiant trouvé
                      </td></tr>
                    ) : etudiants.map((e, i) => (
                      <tr key={e.id}>
                        <td style={{ color:'#94a3b8' }}>{i + 1}</td>
                        <td style={{ fontWeight:'600' }}>{e.prenom} {e.nom}</td>
                        <td>{e.cin || '—'}</td>
                        <td>{e.emailCompte}</td>
                        <td><span className="badge badge-info">{e.filiereNom || '—'}</span></td>
                        <td>{e.anneeAcademiqueNom || '—'}</td>
                        <td>
                          <div className="actions">
                            <button className="btn btn-secondary btn-sm"
                              onClick={() => navigate(`/admin/etudiants/${e.id}`)}>
                              👁
                            </button>
                            <button className="btn btn-warning btn-sm"
                              onClick={() => navigate(`/admin/etudiants/modifier/${e.id}`)}>
                              ✏️
                            </button>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => setModal({ open: true, id: e.id })}>
                              🗑
                            </button>
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
      <ConfirmModal
        isOpen={modal.open}
        message="Êtes-vous sûr de vouloir supprimer cet étudiant ?"
        onConfirm={handleSupprimer}
        onCancel={() => setModal({ open: false, id: null })}
      />
    </div>
  );
};

export default EtudiantList;
