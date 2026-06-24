import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCalendar, FiTruck, FiCheckCircle, FiXCircle } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalReservations: 0,
    actives: 0,
    termine: 0,
    annulee: 0,
  });
  const [recentes, setRecentes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/reservations');
        setRecentes(data.slice(0, 5));

        const total = data.length;
        const actives = data.filter(
          (r) => r.statut === 'en_attente' || r.statut === 'confirmee'
        ).length;
        const termine = data.filter((r) => r.statut === 'terminee').length;
        const annulee = data.filter((r) => r.statut === 'annulee').length;

        setStats({ totalReservations: total, actives, termine, annulee });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const statutBadge = (statut) => {
    const map = {
      en_attente: 'badge-warning',
      confirmee: 'badge-info',
      terminee: 'badge-success',
      annulee: 'badge-danger',
    };
    return map[statut] || 'badge-info';
  };

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Tableau de bord</h1>
          <p>Bienvenue, {user?.nom}</p>
        </div>
        <Link to="/voitures" className="btn btn-primary" style={{ width: 'auto' }}>
          <FiTruck /> Réserver
        </Link>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <FiCalendar />
          </div>
          <div className="stat-info">
            <h3>{stats.totalReservations}</h3>
            <p>Total réservations</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon orange">
            <FiCheckCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.actives}</h3>
            <p>Réservations actives</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon green">
            <FiTruck />
          </div>
          <div className="stat-info">
            <h3>{stats.termine}</h3>
            <p>Terminées</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon red">
            <FiXCircle />
          </div>
          <div className="stat-info">
            <h3>{stats.annulee}</h3>
            <p>Annulées</p>
          </div>
        </div>
      </div>

      <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--secondary)', marginBottom: 16 }}>
        Réservations récentes
      </h2>

      {recentes.length === 0 ? (
        <div className="empty-state">
          <FiCalendar />
          <h3>Aucune réservation</h3>
          <p>Commencez par réserver un véhicule</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Voiture</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {recentes.map((res) => (
                <tr key={res._id}>
                  <td>{res.voiture?.nom || 'N/A'}</td>
                  <td>{formatDate(res.dateDebut)}</td>
                  <td>{formatDate(res.dateFin)}</td>
                  <td>
                    <strong>{res.prixTotal?.toLocaleString()} F</strong>
                  </td>
                  <td>
                    <span className={`badge ${statutBadge(res.statut)}`}>
                      {res.statut}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
