import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { isAdmin, logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  const adminLinks = [
    { to: '/admin/dashboard', label: '🏠 Dashboard' },
    { to: '/admin/etudiants', label: '👨‍🎓 Étudiants' },
    { to: '/admin/filieres',  label: '🏫 Filières' },
    { to: '/admin/annees',    label: '📅 Années' },
    { to: '/admin/matieres',  label: '📚 Matières' },
    { to: '/admin/examens',   label: '📝 Examens' },
    { to: '/admin/notes',     label: '🎯 Notes' },
    { to: '/admin/bulletins', label: '📊 Bulletins' },
  ];

  const etudiantLinks = [
    { to: '/etudiant/dashboard', label: '🏠 Accueil' },
    { to: '/etudiant/profil',    label: '👤 Mon Profil' },
    { to: '/etudiant/bulletins', label: '📊 Bulletins' },
  ];

  const links = isAdmin() ? adminLinks : etudiantLinks;

  return (
    <>
      {/* Bouton hamburger — visible uniquement sur mobile */}
      <button
        className="mobile-menu-btn"
        onClick={() => setIsOpen(true)}
        aria-label="Ouvrir le menu"
      >
        ☰
      </button>

      {/* Overlay sombre derrière le menu mobile */}
      <div
        className={`sidebar-overlay ${isOpen ? 'show' : ''}`}
        onClick={() => setIsOpen(false)}
      />

      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* En-tête : logo + bouton fermer sur sa propre ligne */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {/* Ligne du bouton fermer — mobile uniquement, via CSS */}
          <div className="sidebar-close-row">
            <button
              onClick={() => setIsOpen(false)}
              className="sidebar-close-btn"
              aria-label="Fermer le menu"
            >
              ✕
            </button>
          </div>

          {/* Logo — toujours visible, jamais caché */}
          <div style={{ padding: '11px 8px 8px' }}>
            <h2 style={{ color: 'white', margin: 0, fontSize: '22px', fontWeight: '700', textAlign: 'left' }}>
              🎓 BadjarStudy
            </h2>
            <p style={{ color: 'rgba(11, 232, 55, 0.5)', margin: '4px 0 0', fontSize: '13px' , textAlign: 'center'}}>
              {isAdmin() ? ' Admin' : '👨‍🎓 Étudiant'}
            </p>
          </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, padding: '4px 8px', overflowY: 'auto' }}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              style={({ isActive }) => ({
                display: 'block',
                padding: '11px 12px',
                marginBottom: '4px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '15px',
                color: isActive ? 'white' : 'rgba(255,255,255,0.65)',
                background: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                fontWeight: isActive ? '600' : '400',
                transition: 'all 0.2s',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Utilisateur + Déconnexion */}
        <div style={{ padding: '0px 10px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <p style={{
            color: 'rgba(219, 161, 156, 0.7)', margin: '0 0 5px',
            fontSize: '12px', fontWeight: '500', textAlign:'center',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
          }}>
            {user?.name}
          </p>
          <button onClick={logout} style={{
            width: '100%', padding: '8px',
            background: 'rgba(239,68,68,0.2)',
            border: '1px solid rgba(239,68,68,0.4)',
            borderRadius: '8px', color: '#fca5a5',
            cursor: 'pointer', fontSize: '13px',
            fontWeight: '600', transition: 'all 0.2s'
          }}>
            🚪 Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
