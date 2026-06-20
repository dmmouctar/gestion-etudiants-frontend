import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { login as loginApi } from '../../api/auth.api';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [form, setForm]       = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login }             = useAuth();
  const navigate              = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res  = await loginApi(form);
      const data = res.data.data;
      login(data, data.token);
      toast.success('Connexion réussie !');
      if (data.role === 'ADMIN') navigate('/admin/dashboard');
      else navigate('/etudiant/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex',
      alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2044 100%)',
      padding: '16px'
    }}>
      <div style={{
        background: 'white', borderRadius: '16px',
        padding: 'clamp(24px, 5vw, 40px)',
        width: '100%', maxWidth: '420px',
        boxShadow: '0 25px 60px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{ fontSize: 'clamp(30px, 8vw, 40px)', marginBottom: '12px' }}>🎓</div>
          <h1 style={{ fontSize: 'clamp(24px, 10vw, 32px)', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            BadjarStudy
          </h1>
          <p style={{ color: '#64748b', margin: '6px 0 0', fontSize: '13px' }}>
            Connectez-vous pour continuer
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="votre email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
              autoComplete="email"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '12px', fontSize: '15px', marginTop: '8px' }}
            disabled={loading}
          >
            {loading ? '⏳ Connexion...' : '🔐 Se connecter'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
