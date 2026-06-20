import React, { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar  from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { getHistoriqueBulletins } from '../../api/bulletin.api';
import { getMonProfil }           from '../../api/etudiant.api';

const HistoriqueBulletins = () => {
  const [bulletins, setBulletins] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    getMonProfil().then(r => {
      const etudiantId = r.data.data?.id;
      if (etudiantId) {
        getHistoriqueBulletins(etudiantId)
          .then(res => setBulletins(res.data.data || []))
          .finally(() => setLoading(false));
      } else setLoading(false);
    });
  }, []);

  const getMention = (moy) => {
    if (!moy) return { label: '—', color: '#94a3b8' };
    if (moy >= 16) return { label: 'Très Bien',   color: '#16a34a' };
    if (moy >= 14) return { label: 'Bien',         color: '#2563eb' };
    if (moy >= 12) return { label: 'Assez Bien',   color: '#d97706' };
    if (moy >= 10) return { label: 'Passable',     color: '#d97706' };
    return { label: 'Insuffisant', color: '#dc2626' };
  };

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Historique des Bulletins" />
        <div className="page-content">
          <div className="page-header">
            <h2>📅 Historique des bulletins</h2>
          </div>
          <div className="card" style={{ padding:0 }}>
            {loading ? <Spinner /> : (
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Année académique</th>
                      <th>Moyenne générale</th>
                      <th>Mention</th>
                      <th>Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bulletins.length === 0 ? (
                      <tr><td colSpan="4" style={{ textAlign:'center', padding:'32px', color:'#94a3b8' }}>
                        Aucun bulletin disponible
                      </td></tr>
                    ) : bulletins.map(b => {
                      const m = getMention(b.moyenneGenerale);
                      return (
                        <tr key={b.id}>
                          <td style={{ fontWeight:'600' }}>{b.anneeAcademiqueNom}</td>
                          <td style={{ fontWeight:'700', color: m.color }}>
                            {b.moyenneGenerale ? `${b.moyenneGenerale}/20` : '—'}
                          </td>
                          <td>
                            <span style={{ fontSize:'13px', color: m.color, fontWeight:'600' }}>
                              {m.label}
                            </span>
                          </td>
                          <td>
                            <span className={`badge ${b.estValide ? 'badge-success' : 'badge-warning'}`}>
                              {b.estValide ? '✅ Validé' : '⏳ En attente'}
                            </span>
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

export default HistoriqueBulletins;
