import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar  from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { getEtudiants }  from '../../api/etudiant.api';
import { getFilieres }   from '../../api/filiere.api';
import { getMatieres }   from '../../api/matiere.api';
import { getExamens }    from '../../api/examen.api';

const Dashboard = () => {
  const [stats, setStats]     = useState({ etudiants: 0, filieres: 0, matieres: 0, examens: 0 });
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      // On utilise Promise.all
      // pour que si une requête échoue, les autres continuent
      const [etudiants, filieres, matieres, examens] = await Promise.allSettled([
        getEtudiants(),
        getFilieres(),
        getMatieres(),
        getExamens(),
      ]);

      setStats({
        etudiants: etudiants.status === 'fulfilled' ? (etudiants.value.data.data?.length || 0) : 0,
        filieres:  filieres.status  === 'fulfilled' ? (filieres.value.data.data?.length  || 0) : 0,
        matieres:  matieres.status  === 'fulfilled' ? (matieres.value.data.data?.length  || 0) : 0,
        examens:   examens.status   === 'fulfilled' ? (examens.value.data.data?.length   || 0) : 0,
      });
      setLoading(false);
    };
    fetchStats();
  }, []);

  const cards = [
    { label: 'Étudiants', value: stats.etudiants, icon: '👨‍🎓', color: '#dbeafe', route: '/admin/etudiants' },
    { label: 'Filières',  value: stats.filieres,  icon: '🏫',   color: '#dcfce7', route: '/admin/filieres'  },
    { label: 'Matières',  value: stats.matieres,  icon: '📚',   color: '#fef3c7', route: '/admin/matieres'  },
    { label: 'Examens',   value: stats.examens,   icon: '📝',   color: '#fce7f3', route: '/admin/examens'   },
  ];

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Dashboard" />
        <div className="page-content">
          {loading ? <Spinner /> : (
            <>
              <div className="stats-grid">
                {cards.map(card => (
                  <div
                    key={card.label}
                    className="stat-card"
                    style={{ cursor: 'pointer' }}
                    onClick={() => navigate(card.route)}
                  >
                    <div className="stat-icon" style={{ background: card.color }}>
                      {card.icon}
                    </div>
                    <div className="stat-info">
                      <h3>{card.value}</h3>
                      <p>{card.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="card">
                <h3 style={{ marginBottom: '16px', color: '#1e293b' }}>
                  ⚡ Actions rapides
                </h3>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <button className="btn btn-primary"
                    onClick={() => navigate('/admin/etudiants/nouveau')}>
                    ➕ Nouvel étudiant
                  </button>
                  <button className="btn btn-success"
                    onClick={() => navigate('/admin/bulletins')}>
                    📊 Gérer bulletins
                  </button>
                  <button className="btn btn-warning"
                    onClick={() => navigate('/admin/notes')}>
                    🎯 Saisir notes
                  </button>
                  <button className="btn btn-secondary"
                    onClick={() => navigate('/admin/matieres')}>
                    📚 Gérer matières
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
