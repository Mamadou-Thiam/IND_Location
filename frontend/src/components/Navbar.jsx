import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { user, deconnecter } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    deconnecter();
    navigate('/connexion');
  };

  const initials = user?.nom
    ?.split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  const links = [
    { to: '/tableau-de-bord', label: 'Tableau de bord' },
    { to: '/voitures', label: 'Voitures' },
    { to: '/reservations', label: 'Réservations' },
  ];

  if (user?.role === 'admin') {
    links.push({ to: '/admin/voitures', label: 'Gérer voitures' });
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '1rem' }}>IL</div>
        IND Location
      </Link>

      <div className="navbar-links">
        {links.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={location.pathname === link.to ? 'active' : ''}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div className="navbar-user">
        <div className="user-info">
          <div className="user-name">{user?.nom}</div>
          <div className="user-role">{user?.role}</div>
        </div>
        <div className="user-avatar">{initials}</div>
        <button
          onClick={handleLogout}
          className="btn btn-sm btn-outline"
          style={{ width: 'auto', padding: '8px 12px' }}
        >
          <FiLogOut />
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
