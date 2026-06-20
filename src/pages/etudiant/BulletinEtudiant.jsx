import React, { useEffect, useState, useRef } from 'react';
import Sidebar from '../../components/Sidebar';
import Navbar  from '../../components/Navbar';
import Spinner from '../../components/Spinner';
import { consulterBulletin } from '../../api/bulletin.api';
import { getMonProfil }      from '../../api/etudiant.api';
import { getAnnees }         from '../../api/annee.api';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
 
const BulletinEtudiant = () => {
  const [bulletin, setBulletin]   = useState(null);
  const [profil, setProfil]       = useState(null);
  const [annees, setAnnees]       = useState([]);
  const [anneeId, setAnneeId]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [printing, setPrinting]   = useState(false);
  const bulletinRef               = useRef(null);
 
  useEffect(() => {
    Promise.all([getMonProfil(), getAnnees()]).then(([p, a]) => {
      setProfil(p.data.data);
      setAnnees(a.data.data || []);
    }).catch(err => console.error(err));
  }, []);
 
  const fetchBulletin = async () => {
    if (!profil || !anneeId) return;
    setLoading(true);
    try {
      const r = await consulterBulletin(profil.id, anneeId);
      setBulletin(r.data.data);
    } catch {
      toast.error('Aucun bulletin pour cette période');
      setBulletin(null);
    } finally { setLoading(false); }
  };
 
  useEffect(() => { fetchBulletin(); }, [anneeId, profil]);
 
  const getMention = (moy) => {
    if (!moy) return { label: 'Non évalué', color: '#94a3b8' };
    if (moy >= 16) return { label: 'Très Bien',  color: '#16a34a' };
    if (moy >= 14) return { label: 'Bien',        color: '#2563eb' };
    if (moy >= 12) return { label: 'Assez Bien',  color: '#d97706' };
    if (moy >= 10) return { label: 'Passable',    color: '#d97706' };
    return { label: 'Insuffisant', color: '#dc2626' };
  };
 
  // ── Impression PDF ──────────────────────────────────────────────
  const handlePrint = async () => {
    if (!bulletinRef.current) return;
    setPrinting(true);
    try {
      const canvas = await html2canvas(bulletinRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff'
      });
 
      const imgData  = canvas.toDataURL('image/png');
      const pdf      = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight= (canvas.height * pdfWidth) / canvas.width;
 
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`bulletin_${bulletin.etudiantNom}_${bulletin.anneeAcademiqueNom}.pdf`);
      toast.success('Bulletin téléchargé en PDF !');
    } catch {
      toast.error('Erreur lors de la génération du PDF');
    } finally {
      setPrinting(false);
    }
  };
 
  const mention = getMention(bulletin?.moyenneGenerale);
 
  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Mon Bulletin" />
        <div className="page-content">
 
          {/* Sélection année */}
          <div className="card" style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
              <div className="form-group" style={{ margin: 0 }}>
                <label>Sélectionner une année académique</label>
                <select value={anneeId} onChange={e => setAnneeId(e.target.value)}
                  style={{ maxWidth: '300px' }}>
                  <option value="">-- Choisir --</option>
                  {annees.map(a => <option key={a.id} value={a.id}>{a.nom}</option>)}
                </select>
              </div>
              {bulletin && (
                <button
                  className="btn btn-primary"
                  onClick={handlePrint}
                  disabled={printing}
                >
                  {printing ? '⏳ Générer...' : '🖨️ Imprimer'}
                </button>
              )}
            </div>
          </div>
 
          {loading && <Spinner />}
 
          {!loading && bulletin && (
            // Zone à capturer pour le PDF
            <div ref={bulletinRef} style={{ maxWidth: '700px', background: 'white', padding: '8px' }}>
 
              {/* En-tête du bulletin */}
              <div className="card" style={{ marginBottom: '16px' }}>
                {/* Logo école */}
                <div style={{
                  textAlign: 'center', marginBottom: '20px',
                  paddingBottom: '16px', borderBottom: '2px solid #1e3a5f'
                }}>
                  <h2 style={{
                    fontSize: '20px', fontWeight: '800',
                    color: '#1e3a5f', margin: '0 0 4px'
                  }}>
                    🎓 BULLETIN DE NOTES
                  </h2>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '16px' }}>
                    Étudiant
                  </p>
                </div>
 
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <table style={{ fontSize: '14px', borderCollapse: 'separate', borderSpacing: '0 4px' }}>
                      <tbody>
                        <tr>
                          <td style={{ color: '#64748b', paddingRight: '16px', fontWeight: '600' }}>Étudiant :</td>
                          <td style={{ fontWeight: '700', color: '#1e293b' }}>
                            {bulletin.etudiantPrenom} {bulletin.etudiantNom}
                          </td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b', fontWeight: '600' }}>CIN :</td>
                          <td>{bulletin.etudiantCin || '—'}</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b', fontWeight: '600' }}>Filière :</td>
                          <td>{bulletin.filiereNom}</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b', fontWeight: '600' }}>Année :</td>
                          <td>{bulletin.anneeAcademiqueNom}</td>
                        </tr>
                        <tr>
                          <td style={{ color: '#64748b', fontWeight: '600' }}>Niveau :</td>
                          <td>Niveau {bulletin.anneeNiveau}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
 
                  {/* Résultat global */}
                  <div style={{
                    textAlign: 'center',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px 24px',
                    border: `2px solid ${mention.color}`
                  }}>
                    <div style={{
                      fontSize: '36px', fontWeight: '800',
                      color: mention.color, lineHeight: 1
                    }}>
                      {bulletin.moyenneGenerale ?? '—'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#64748b', margin: '4px 0' }}>/20</div>
                    <div style={{
                      fontSize: '13px', fontWeight: '700',
                      color: mention.color
                    }}>
                      {mention.label}
                    </div>
                    <div style={{ marginTop: '8px' }}>
                      <span style={{
                        fontSize: '11px', padding: '2px 8px',
                        borderRadius: '12px', fontWeight: '600',
                        background: bulletin.estValide ? '#dcfce7' : '#fef3c7',
                        color: bulletin.estValide ? '#16a34a' : '#d97706'
                      }}>
                        {bulletin.estValide ? '✅ Validé' : '⏳ Non validé'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
 
              {/* Tableau des notes */}
              <div className="card" style={{ padding: 0 }}>
                <div style={{ padding: '14px 20px', borderBottom: '1px solid #e2e8f0', background: '#1e3a5f', borderRadius: '10px 10px 0 0' }}>
                  <h3 style={{ margin: 0, fontSize: '14px', color: 'white', fontWeight: '600' }}>
                    📚 Détail des notes par matière
                  </h3>
                </div>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '10px 16px', textAlign: 'left', color: '#475569', fontWeight: '600', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>Matière</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>Coefficient</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>Moyenne</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>Moy. pondérée</th>
                      <th style={{ padding: '10px 16px', textAlign: 'center', color: '#475569', fontWeight: '600', fontSize: '13px', borderBottom: '1px solid #e2e8f0' }}>Mention</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(bulletin.moyennesMatieres || []).map((mm, i) => {
                      const m = getMention(mm.moyenne);
                      return (
                        <tr key={mm.matiereId} style={{ background: i % 2 === 0 ? 'white' : '#fafafa' }}>
                          <td style={{ padding: '10px 16px', fontWeight: '600', borderBottom: '1px solid #f1f5f9' }}>{mm.matiereNom}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>×{mm.coefficient}</td>
                          <td style={{ padding: '10px 16px', textAlign: 'center', fontWeight: '700', borderBottom: '1px solid #f1f5f9' }}>
                            {mm.moyenne != null ? `${mm.moyenne}/20` : '—'}
                          </td>
                          <td style={{ padding: '10px 16px', textAlign: 'center', color: '#64748b', borderBottom: '1px solid #f1f5f9' }}>
                            {mm.moyennePonderee ?? '—'}
                          </td>
                          <td style={{ padding: '10px 16px', textAlign: 'center', borderBottom: '1px solid #f1f5f9' }}>
                            <span style={{ fontSize: '12px', color: m.color, fontWeight: '700' }}>
                              {m.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr style={{ background: '#1e3a5f' }}>
                      <td colSpan="2" style={{ padding: '12px 16px', fontWeight: '700', color: 'white', fontSize: '14px' }}>
                        MOYENNE GÉNÉRALE
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '800', color: 'white', fontSize: '16px' }}>
                        {bulletin.moyenneGenerale ?? '—'}/20
                      </td>
                      <td colSpan="2" style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '700', color: '#fbbf24', fontSize: '14px' }}>
                        {mention.label}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
 
              {/* Pied de page */}
              <div style={{ marginTop: '16px', padding: '12px 16px', background: '#f8fafc', borderRadius: '8px', textAlign: 'right', paddingTop: '300px' }}>
                <p style={{ margin: 0, fontSize: '14px', color: '#94a3b8' }}>
                   {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' })}
                </p>
              </div>
 
            </div>
          )}
 
          {!loading && !bulletin && anneeId && (
            <div className="card" style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>
              <p style={{ fontSize: '32px' }}>📭</p>
              <p>Aucun bulletin disponible pour cette année académique.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
 
export default BulletinEtudiant;