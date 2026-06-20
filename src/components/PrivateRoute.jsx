import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, role }) => {
  const { isLoggedIn, isAdmin, isEtudiant, loading } = useAuth();

  if (loading) return <div className="spinner-center">Chargement...</div>;

  if (!isLoggedIn()) return <Navigate to="/login" replace />;

  if (role === 'ADMIN' && !isAdmin())
    return <Navigate to="/etudiant/dashboard" replace />;

  if (role === 'ETUDIANT' && !isEtudiant() && !isAdmin())
    return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;