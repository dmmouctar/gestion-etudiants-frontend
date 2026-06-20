import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import { getBulletinAdmin, genererBulletin, validerBulletin } from '../../../api/bulletin.api';
import { getEtudiants } from '../../../api/etudiant.api';
import { getAnnees }    from '../../../api/annee.api';

const BulletinList = () => {
  const [bulletins, setBulletins] = useState([]);
  const [etudiants, setEtudiants] = useState([]);
  const [annees, setAnnees]       = useState([]);
  const [anneeId, setAnneeId]     = useState('');
  const [loading, setLoading]     = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([getEtudiants(), getAnnees()]).then(([e, a]) => {
      setEtudiants(e.data.data || []);
      setAnnees(a.data.data    || []);
    });
  }, []);

  const fetchBulletins = async () => {
    if (!anneeId) return;
    setLoading(true);
    try {
      const r = await getBulletinAdmin(anneeId);
      setBulletins(r.data.data || []);
    } catch { toast.error('Erreur chargement bulletins'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchBulletins(); }, [anneeId]);

  const handleGenerer = async (etudiantId) => {
    if (!anneeId) return toast.warning('Sélectionnez une année');
    try {
      await genererBulletin(etudiantId, anneeId);
      toast.success('Bulletin généré !');
      fetchBulletins();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const handleValider = async (id) => {
    try {
      await validerBulletin(id);
      toast.success('Bulletin validé !');
      fetchBulletins();
    } catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const getMention = (moy) => {
    if (!moy) return { label: '—', cls: '' };
    if (moy >= 16) return { label: 'Très Bien', cls: 'badge-success' };
    if (moy >= 14) return { label: 'Bien',      cls: 'badge-info'    };
    if (moy >= 12) return { label: 'Assez Bien',cls: 'badge-warning' };
    if (moy >= 10) return { label: 'Passable',  cls: 'badge-warning' };
    return { label: 'Insuffisant', cls: 'badge-danger' };
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Gestion des Bulletins" />
        <div className="page-content">
          <div className="page-header">
            <h2>📊 Bulletins</h2>
          </div>

          {/* Filtres */}
          <div className="card" style={{ marginBottom:'20px' }}>
            <div style={{ display:'flex', gap:'16px', alignItems:'flex-end', flexWrap:'wrap' }}>
              <div className="form-group" style={{ margin:0, minWidth:'200px' }}>
                <label>Année académique</label>
                <select value={anneeId} onChange={e => setAnneeId(e.target.value)}>
                  <option value="">-- Sélectionner --</option>
                  {annees.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Génération groupée */}
          {anneeId && (
            <div className="card" style={{ marginBottom:'20px' }}>
              <h3 style={{ marginBottom:'12px', fontSize:'15px' }}>⚡ Générer les bulletins</h3>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {etudiants.map(et => (
                  <button key={et.id} className="btn btn-secondary btn-sm"
                    onClick={() => handleGenerer(et.id)}>
                    📊 {et.prenom} {et.nom}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tableau bulletins */}
          <div className="card" style={{ padding:0 }}>
            {loading ? <Spinner /> : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Étudiant</th>
                      <th>Filière</th>
                      <th>Moyenne</th>
                      <th>Mention</th>
                      <th>Statut</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulletins.length === 0 ? (
                      <tr><td colSpan="6" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>
                        {anneeId ? 'Aucun bulletin pour cette année' : 'Sélectionnez une année'}
                      </td></tr>
                    ) : bulletins.map(b => {
                      const m = getMention(b.moyenneGenerale);
                      return (
                        <tr key={b.id}>
                          <td style={{ fontWeight:'600' }}>{b.etudiantPrenom} {b.etudiantNom}</td>
                          <td><span className="badge badge-info">{b.filiereNom}</span></td>
                          <td style={{ fontWeight:'700', fontSize:'16px' }}>
                            {b.moyenneGenerale ? `${b.moyenneGenerale}/20` : '—'}
                          </td>
                          <td>{m.label !== '—' && <span className={`badge ${m.cls}`}>{m.label}</span>}</td>
                          <td>
                            <span className={`badge ${b.estValide ? 'badge-success' : 'badge-warning'}`}>
                              {b.estValide ? '✅ Validé' : '⏳ En attente'}
                            </span>
                          </td>
                          <td>
                            <div className="actions">
                              <button className="btn btn-secondary btn-sm"
                                onClick={() => navigate(`/admin/bulletins/${b.id}`)}>
                                👁
                              </button>
                              {!b.estValide && (
                                <button className="btn btn-success btn-sm"
                                  onClick={() => handleValider(b.id)}>
                                  ✅ Valider
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinList;
