import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Sidebar from '../../../components/Sidebar';
import Navbar  from '../../../components/Navbar';
import Spinner from '../../../components/Spinner';
import { validerBulletin, invaliderBulletin } from '../../../api/bulletin.api';
import api from '../../../api/axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const BulletinDetail = () => {
  const { id }      = useParams();
  const navigate    = useNavigate();
  const bulletinRef = useRef(null);
  const [bulletin, setBulletin] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [printing, setPrinting] = useState(false);

  const fetch = async () => {
    try {
      const r = await api.get(`/admin/bulletins/${id}`);
      setBulletin(r.data.data);
    } catch {
      toast.error('Bulletin non trouvé');
      navigate('/admin/bulletins');
    } finally { setLoading(false); }
  };

  useEffect(() => { fetch(); }, [id]);

  const getMention = (moy) => {
    if (!moy) return { label: 'Non évalué', color: '#94a3b8' };
    if (moy >= 16) return { label: 'Très Bien',  color: '#16a34a' };
    if (moy >= 14) return { label: 'Bien',        color: '#2563eb' };
    if (moy >= 12) return { label: 'Assez Bien',  color: '#d97706' };
    if (moy >= 10) return { label: 'Passable',    color: '#d97706' };
    return { label: 'Insuffisant', color: '#dc2626' };
  };

  const handleValider = async () => {
    try { await validerBulletin(id); toast.success('Bulletin validé !'); fetch(); }
    catch (err) { toast.error(err.response?.data?.message || 'Erreur'); }
  };

  const handleInvalider = async () => {
    try { await invaliderBulletin(id); toast.success('Bulletin invalidé'); fetch(); }
    catch { toast.error('Erreur'); }
  };

  // ── Impression PDF ───────────────────────────
  const handlePrint = async () => {
    if (!bulletinRef.current) return;
    setPrinting(true);
    try {
      const canvas = await html2canvas(bulletinRef.current, {
        scale: 2, useCORS: true, backgroundColor: '#ffffff'
      });
      const imgData   = canvas.toDataURL('image/png');
      const pdf       = new jsPDF('p', 'mm', 'a4');
      const pdfWidth  = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`bulletin_${bulletin.etudiantNom}_${bulletin.anneeAcademiqueNom}.pdf`);
      toast.success('Bulletin téléchargé en PDF !');
    } catch { toast.error('Erreur génération PDF'); }
    finally { setPrinting(false); }
  };

  if (loading) return (
    <div className="layout">
      <Sidebar /><div className="main-content">
      <Navbar title="Bulletin" /><div className="page-content"><Spinner /></div></div>
    </div>
  );

  if (!bulletin) return null;
  const mention = getMention(bulletin.moyenneGenerale);

  return (
    <div className="layout">
      <Sidebar />
      <div className="main-content">
        <Navbar title="Détail du Bulletin" />
        <div className="page-content">

          {/* Boutons d'action */}
          <div style={{ display:'flex', gap:'10px', marginBottom:'16px', flexWrap:'wrap' }}>
            <button className="btn btn-secondary btn-sm"
              onClick={() => navigate('/admin/bulletins')}>
              ← Retour
            </button>
            <button className="btn btn-primary"
              onClick={handlePrint} disabled={printing}>
              {printing ? '⏳ Générer...' : '🖨️ Imprimer'}
            </button>
            {!bulletin.estValide ? (
              <button className="btn btn-success" onClick={handleValider}>✅ Valider</button>
            ) : (
              <button className="btn btn-danger" onClick={handleInvalider}>❌ Invalider</button>
            )}
          </div>

          {/* Zone capturée pour le PDF */}
          <div ref={bulletinRef} style={{ maxWidth:'800px', background:'white', padding:'8px' }}>

            {/* En-tête */}
            <div className="card" style={{ marginBottom:'16px' }}>
              <div style={{
                textAlign:'center', marginBottom:'20px',
                paddingBottom:'16px', borderBottom:'2px solid #1e3a5f'
              }}>
                <h2 style={{ fontSize:'20px', fontWeight:'800', color:'#1e3a5f', margin:'0 0 4px' }}>
                  🎓 BULLETIN DE NOTES
                </h2>
                <p style={{ color:'#64748b', margin:0, fontSize:'16px' }}>
                  Étudiant
                </p>
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
                <table style={{ fontSize:'15px', borderCollapse:'separate', borderSpacing:'0 4px' }}>
                  <tbody>
                    <tr>
                      <td style={{ color:'#64748b', paddingRight:'80px', fontWeight:'600' }}>Étudiant :</td>
                      <td style={{ fontWeight:'700', color:'#1e293b' }}>
                        {bulletin.etudiantPrenom} {bulletin.etudiantNom}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ color:'#64748b', fontWeight:'600' }}>CIN :</td>
                      <td>{bulletin.etudiantCin || '—'}</td>
                    </tr>
                    <tr>
                      <td style={{ color:'#64748b', fontWeight:'600' }}>Filière :</td>
                      <td>{bulletin.filiereNom}</td>
                    </tr>
                    <tr>
                      <td style={{ color:'#64748b', fontWeight:'600' }}>Année :</td>
                      <td>{bulletin.anneeAcademiqueNom}</td>
                    </tr>
                    <tr>
                      <td style={{ color:'#64748b', fontWeight:'600' }}>Niveau :</td>
                      <td>Niveau {bulletin.anneeNiveau}</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{
                  textAlign:'center', background:'#f8fafc',
                  borderRadius:'20px', padding:'12px 20px',
                  border:`2px solid ${mention.color}`
                }}>
                  <div style={{ fontSize:'36px', fontWeight:'800', color:mention.color, lineHeight:1 }}>
                    {bulletin.moyenneGenerale ?? '—'}
                  </div>
                  <div style={{ fontSize:'14px', color:'#64748b', margin:'4px 0' }}>/20</div>
                  <div style={{ fontSize:'13px', fontWeight:'700', color:mention.color }}>
                    {mention.label}
                  </div>
                  <div style={{ marginTop:'6px' }}>
                    <span style={{
                      fontSize:'14px', padding:'2px 8px', borderRadius:'12px', fontWeight:'600',
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
            <div className="card" style={{ padding:0 }}>
              <div style={{
                padding:'14px 20px', borderBottom:'1px solid #e2e8f0',
                background:'#1e3a5f', borderRadius:'10px 10px 0 0'
              }}>
                <h3 style={{ margin:0, fontSize:'14px', color:'white', fontWeight:'600' }}>
                  📚 Détail des notes par matière
                </h3>
              </div>
              <table style={{ width:'99%', borderCollapse:'collapse', fontSize:'14px' }}>
                <thead style={{ background:'#f8fafc' }}>
                  <tr>
                    {['Matière','Coefficient','Moyenne','Moy. pondérée','Mention'].map(h => (
                      <th key={h} style={{
                        padding:'16px 10px', textAlign: h === 'Matière' ? 'left' : 'center',
                        color:'#475569', fontWeight:'600', fontSize:'14px',
                        borderBottom:'2px solid #e2e8f0'
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(bulletin.moyennesMatieres || []).map((mm, i) => {
                    const m = getMention(mm.moyenne);
                    return (
                      <tr key={mm.matiereId} style={{ background: i%2===0 ? 'white' : '#fafafa' }}>
                        <td style={{ padding:'10px 16px', fontWeight:'600', borderBottom:'1px solid #f1f5f9' }}>
                          {mm.matiereNom}
                        </td>
                        <td style={{ padding:'10px 16px', textAlign:'center', borderBottom:'1px solid #f1f5f9' }}>
                          ×{mm.coefficient}
                        </td>
                        <td style={{ padding:'10px 16px', textAlign:'center', fontWeight:'700', borderBottom:'1px solid #f1f5f9' }}>
                          {mm.moyenne != null ? `${mm.moyenne}/20` : '—'}
                        </td>
                        <td style={{ padding:'10px 16px', textAlign:'center', color:'#64748b', borderBottom:'1px solid #f1f5f9' }}>
                          {mm.moyennePonderee ?? '—'}
                        </td>
                        <td style={{ padding:'10px 16px', textAlign:'center', borderBottom:'1px solid #f1f5f9' }}>
                          <span style={{ fontSize:'12px', color:m.color, fontWeight:'700' }}>
                            {m.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr style={{ background:'#1e3a5f' }}>
                    <td colSpan="2" style={{ padding:'12px 16px', fontWeight:'700', color:'white', fontSize:'14px' }}>
                      MOYENNE GÉNÉRALE
                    </td>
                    <td style={{ padding:'12px 16px', textAlign:'center', fontWeight:'800', color:'white', fontSize:'16px' }}>
                      {bulletin.moyenneGenerale ?? '—'}/20
                    </td>
                    <td colSpan="2" style={{ padding:'12px 44px', textAlign:'right', fontWeight:'700', color:'#fbbf24', fontSize:'14px' }}>
                      {mention.label}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Pied de page */}
            <div style={{
              marginTop:'16px', padding:'12px 10px',
              background:'#f8fafc', borderRadius:'8px', textAlign:'right'
            }}>
              <p style={{ margin:0, fontSize:'14px', color:'#94a3b8' }}>
                {' '}
                {new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default BulletinDetail;
