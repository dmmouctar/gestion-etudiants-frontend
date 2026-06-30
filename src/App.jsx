import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

import {AuthProvider} from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

// Auth
import Login from './pages/auth/Login';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import MonProfil        from './pages/admin/MonProfil';
import EtudiantList from './pages/admin/etudiants/EtudiantList';
import EtudiantForm from './pages/admin/etudiants/EtudiantForm';
import EtudiantDetail from './pages/admin/etudiants/EtudiantDetail';
import FiliereList from './pages/admin/filieres/FiliereList';
import AnneeList from './pages/admin/annees/AnneeList';
import MatiereList from './pages/admin/matieres/MatiereList';
import ExamenList from './pages/admin/examens/ExamenList';
import NoteSaisie from './pages/admin/notes/NoteSaisie';
import BulletinList from './pages/admin/bulletins/BulletinList';
import BulletinDetail from './pages/admin/bulletins/BulletinDetail';

// Etudiant pages
import DashboardEtudiant from './pages/etudiant/DashboardEtudiant';
import ProfilEtudiant from './pages/etudiant/ProfilEtudiant';
import BulletinEtudiant from './pages/etudiant/BulletinEtudiant';
import HistoriqueBulletins from './pages/etudiant/HistoriqueBulletins';
import MatieresEtudiant from './pages/etudiant/MatieresEtudiant';

function App(){
    return(
        <AuthProvider>
            <BrowserRouter>
            <Routes>
                {/*Redirection racine */}
                <Route path="/" element={<Navigate to="/login" replace />} />

                {/*PAGES PUBLIQUES */}
                <Route path="/login" element={<Login />} />

                {/*Routes ADMIN */}
                <Route path="/admin/dashboard" element={
                    <PrivateRoute role ="ADMIN"><Dashboard /></PrivateRoute>
                } />

                <Route path="/admin/etudiants" element={
                    <PrivateRoute role ="ADMIN"><EtudiantList /></PrivateRoute>
                } />

                 <Route path="/admin/etudiants/nouveau" element={
                    <PrivateRoute role ="ADMIN"><EtudiantForm /></PrivateRoute>
                } />

                 <Route path="/admin/etudiants/modifier/:id" element={
                    <PrivateRoute role ="ADMIN"><EtudiantForm /></PrivateRoute>
                } />

                 <Route path="/admin/etudiants/:id" element={
                    <PrivateRoute role ="ADMIN"><EtudiantDetail /></PrivateRoute>
                } />

                 <Route path="/admin/filieres" element={
                    <PrivateRoute role ="ADMIN"><FiliereList /></PrivateRoute>
                } />

                 <Route path="/admin/annees" element={
                    <PrivateRoute role ="ADMIN"><AnneeList /></PrivateRoute>
                } />

                 <Route path="/admin/matieres" element={
                    <PrivateRoute role ="ADMIN"><MatiereList /></PrivateRoute>
                } />

                 <Route path="/admin/examens" element={
                    <PrivateRoute role ="ADMIN"><ExamenList /></PrivateRoute>
                } />

                 <Route path="/admin/notes" element={
                    <PrivateRoute role ="ADMIN"><NoteSaisie /></PrivateRoute>
                } />

                 <Route path="/admin/bulletins" element={
                    <PrivateRoute role ="ADMIN"><BulletinList /></PrivateRoute>
                } />

                 <Route path="/admin/bulletins/:id" element={
                    <PrivateRoute role ="ADMIN"><BulletinDetail /></PrivateRoute>
                } />


                {/*Routes ETUDIANT */}
                <Route path="/etudiant/dashboard" element={
                    <PrivateRoute role ="ETUDIANT"><DashboardEtudiant /></PrivateRoute>
                } />

                <Route path="/etudiant/profil" element={
                    <PrivateRoute role ="ETUDIANT"><ProfilEtudiant /></PrivateRoute>
                } />

                 <Route path="/etudiant/matieres" element={
                    <PrivateRoute role="ETUDIANT"><MatieresEtudiant /></PrivateRoute>
                } />


                <Route path="/etudiant/bulletins" element={
                    <PrivateRoute role ="ETUDIANT"><BulletinEtudiant /></PrivateRoute>
                } />

                <Route path="/etudiant/bulletins/historique" element={
                    <PrivateRoute role ="ETUDIANT"><HistoriqueBulletins /></PrivateRoute>
                } />

                {/*Routes 404 */}

               <Route path="*" element={<Navigate to="/login" replace />} />

            </Routes>

            {/*Notifications toast globales */}
            <ToastContainer
                position="top-right"
                autoClose= {3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
                theme="colored"
            />

            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;