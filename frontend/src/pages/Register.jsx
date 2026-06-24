import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiPhone, FiArrowLeft } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [form, setForm] = useState({
    nom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    confirmMotDePasse: '',
  });
  const [loading, setLoading] = useState(false);
  const { inscrire } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.values(form).some((v) => !v)) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    if (form.motDePasse !== form.confirmMotDePasse) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    if (form.motDePasse.length < 6) {
      toast.error('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }
    setLoading(true);
    try {
      await inscrire(form.nom, form.email, form.telephone, form.motDePasse);
      toast.success('Compte créé avec succès');
      navigate('/tableau-de-bord');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de l\'inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-left">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--gray-500)', fontSize: '0.85rem', marginBottom: 16, textDecoration: 'none' }}>
          <FiArrowLeft size={14} /> Retour à l'accueil
        </Link>
        <div className="auth-logo">
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1.2rem' }}>IL</div>
          <span>IND Location</span>
        </div>

        <h1 className="auth-title">Créer un compte</h1>
        <p className="auth-subtitle">
          Rejoignez IND Location et louez votre véhicule facilement
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nom complet</label>
            <div className="input-wrapper">
              <FiUser />
              <input
                type="text"
                name="nom"
                placeholder="Votre nom"
                value={form.nom}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Email</label>
            <div className="input-wrapper">
              <FiMail />
              <input
                type="email"
                name="email"
                placeholder="votre@email.com"
                value={form.email}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <div className="input-wrapper">
              <FiPhone />
              <input
                type="tel"
                name="telephone"
                placeholder="+221 77 000 00 00"
                value={form.telephone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Mot de passe</label>
              <div className="input-wrapper">
                <FiLock />
                <input
                  type="password"
                  name="motDePasse"
                  placeholder="••••••••"
                  value={form.motDePasse}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-group">
              <label>Confirmer</label>
              <div className="input-wrapper">
                <FiLock />
                <input
                  type="password"
                  name="confirmMotDePasse"
                  placeholder="••••••••"
                  value={form.confirmMotDePasse}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Inscription...' : 'Créer mon compte'}
          </button>
        </form>

        <div className="auth-footer">
          Déjà un compte ?{' '}
          <Link to="/connexion">Se connecter</Link>
        </div>
      </div>

      <div className="auth-right">
        <img src="https://images.unsplash.com/photo-1544636331-e26879cd4d9b?auto=format&fit=crop&w=1200&q=80" alt="Voiture" />
        <div className="auth-right-content">
          <h2>Bienvenue</h2>
          <p>Des véhicules de qualité pour tous vos déplacements</p>
        </div>
      </div>
    </div>
  );
};

export default Register;
