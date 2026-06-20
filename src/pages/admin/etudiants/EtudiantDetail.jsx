import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import { getEtudiant } from '../../../api/etudiant.api';

const EtudiantDetail = () => {
  const { id }   = useParams();
  const navigate = useNavigate();
  const [etudiant, setEtudiant] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => {
    getEtudiant(id).then(r => setEtudiant(r.data.data)).finally(() => setLoading(false));
  }, [id]);

  const Row = ({ label, value }) => (
    <div style={{ display:'flex', padding:'12px 0', borderBottom:'1px solid #f1f5f9' }}>
      <span style={{ width:'180px', color:'#64748b', fontSize:'13px', fontWeight:'600' }}>{label}</span>
      <span style={{ color:'#1e293b', fontSize:'14px' }}>{value || '—'}</span>
    </div>
  );

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Détail Étudiant" />
        <div className="page-content">
          {loading ? <Spinner /> : etudiant && (
            <div className="card" style={{ maxWidth:'600px' }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'24px' }}>
                <div>
                  <h2 style={{ fontSize:'20px', fontWeight:'700', color:'#1e293b' }}>
                    {etudiant.prenom} {etudiant.nom}
                  </h2>
                  <span className="badge badge-info">{etudiant.filiereNom}</span>
                </div>
                <div style={{ display:'flex', gap:'8px' }}>
                  <button className="btn btn-warning btn-sm"
                    onClick={() => navigate(`/admin/etudiants/modifier/${id}`)}>
                    ✏️ Modifier
                  </button>
                  <button className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/admin/etudiants')}>
                    ← Retour
                  </button>
                </div>
              </div>
              <Row label="CIN"              value={etudiant.cin} />
              <Row label="Email personnel"  value={etudiant.email} />
              <Row label="Email compte"     value={etudiant.emailCompte} />
              <Row label="Téléphone"        value={etudiant.telephone} />
              <Row label="Date naissance"   value={etudiant.dateNaissance} />
              <Row label="Adresse"          value={etudiant.adresse} />
              <Row label="Sexe"             value={etudiant.sexeNom} />
              <Row label="Filière"          value={etudiant.filiereNom} />
              <Row label="Année académique" value={etudiant.anneeAcademiqueNom} />
              <Row label="Niveau"           value={etudiant.anneeNiveau ? `Niveau ${etudiant.anneeNiveau}` : null} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EtudiantDetail;
