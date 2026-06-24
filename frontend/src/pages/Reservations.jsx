import { useState, useEffect } from 'react';
import { FiCalendar } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/reservations');
        setReservations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const handleAnnuler = async (id) => {
    if (!window.confirm('Voulez-vous vraiment annuler cette réservation ?')) return;
    try {
      await api.put(`/reservations/${id}/annuler`);
      setReservations((prev) =>
        prev.map((r) => (r._id === id ? { ...r, statut: 'annulee' } : r))
      );
      toast.success('Réservation annulée');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

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
          <h1>Mes réservations</h1>
          <p>{reservations.length} réservation(s)</p>
        </div>
      </div>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <FiCalendar />
          <h3>Aucune réservation</h3>
          <p>Parcourez notre flotte et réservez un véhicule</p>
        </div>
      ) : (
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Voiture</th>
                <th>Catégorie</th>
                <th>Début</th>
                <th>Fin</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res._id}>
                  <td>
                    <strong>{res.voiture?.nom || 'N/A'}</strong>
                  </td>
                  <td style={{ textTransform: 'capitalize' }}>
                    {res.voiture?.categorie}
                  </td>
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
                  <td>
                    {res.statut !== 'annulee' && res.statut !== 'terminee' && (
                      <button
                        className="btn btn-sm btn-outline"
                        style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                        onClick={() => handleAnnuler(res._id)}
                      >
                        Annuler
                      </button>
                    )}
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

export default Reservations;
