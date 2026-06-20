import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMe } from '../api/profile.api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [loading, setLoading] = useState(true);

  // Au démarrage, récupère les données du localStorage
  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser  = localStorage.getItem('user');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      // Recharger les infos depuis le serveur (incluant photoUrl)
      fetchUserInfo(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  // Récupère les infos à jour depuis le backend
  const fetchUserInfo = async (savedToken) => {
    try {
      const res = await getMe();
      const serverUser = res.data.data;
      const updatedUser = {
        ...JSON.parse(localStorage.getItem('user') || '{}'),
        photoUrl: serverUser.photoUrl,
        name: serverUser.name,
        email: serverUser.email,
        role: serverUser.role,
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Erreur chargement profil:', err);
    } finally {
      setLoading(false);
    }
  };

  // Appelée après un login réussi
  const login = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('token', jwtToken);
    localStorage.setItem('user', JSON.stringify(userData));
    // Recharger les infos du serveur après login
    setTimeout(() => fetchUserInfo(jwtToken), 500);
  };

  // Mettre à jour la photo dans le contexte
  const updatePhoto = (photoUrl) => {
    const updatedUser = { ...user, photoUrl };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  // Déconnexion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.clear();
    window.location.href = '/login';
  };

  const isAdmin    = () => user?.role === 'ADMIN';
  const isEtudiant = () => user?.role === 'ETUDIANT';
  const isLoggedIn = () => !!token;

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      login, logout, updatePhoto,
      isAdmin, isEtudiant, isLoggedIn
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth doit être utilisé dans AuthProvider');
  return ctx;
};

export default AuthContext;
