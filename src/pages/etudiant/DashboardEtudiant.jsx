import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar  from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const DashboardEtudiant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Mon Espace" />
        <div className="page-content">
          <div className="card" style={{ marginBottom:'20px' }}>
            <h2 style={{ fontSize:'20px', fontWeight:'700', marginBottom:'8px' }}>
              👋 Bienvenue, {user?.name} !
            </h2>
            <p style={{ color:'#64748b', fontSize:'14px' }}>
              Consultez vos informations académiques et vos bulletins.
            </p>
          </div>

          <div className="stats-grid">
            <div className="stat-card" style={{ cursor:'pointer' }}
              onClick={() => navigate('/etudiant/profil')}>
              <div className="stat-icon" style={{ background:'#dbeafe' }}>👤</div>
              <div className="stat-info">
                <h3 style={{ fontSize:'16px' }}>Mon Profil</h3>
                <p>Mes Infos perso</p>
              </div>
            </div>
            <div className="stat-card" style={{ cursor:'pointer' }}
              onClick={() => navigate('/etudiant/bulletins')}>
              <div className="stat-icon" style={{ background:'#dcfce7' }}>📊</div>
              <div className="stat-info">
                <h3 style={{ fontSize:'16px' }}>Bulletins</h3>
                <p>Voir mes notes</p>
              </div>
            </div>
            <div className="stat-card" style={{ cursor:'pointer' }}
              onClick={() => navigate('/etudiant/bulletins/historique')}>
              <div className="stat-icon" style={{ background:'#fef3c7' }}>📅</div>
              <div className="stat-info">
                <h3 style={{ fontSize:'16px' }}>Historique</h3>
                <p>Tous mes bulletins</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEtudiant;
