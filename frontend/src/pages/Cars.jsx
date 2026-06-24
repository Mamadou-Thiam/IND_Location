import { useState, useEffect } from 'react';
import { FiClock, FiUsers, FiTool } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const Cars = () => {
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [reservation, setReservation] = useState({
    dateDebut: '',
    dateFin: '',
  });
  const [reserving, setReserving] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCars = async () => {
      try {
        const { data } = await api.get('/voitures');
        setVoitures(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, []);

  const handleReserve = async (e) => {
    e.preventDefault();
    if (!reservation.dateDebut || !reservation.dateFin) {
      toast.error('Veuillez choisir les dates');
      return;
    }
    setReserving(true);
    try {
      await api.post('/reservations', {
        voiture: selectedCar._id,
        dateDebut: reservation.dateDebut,
        dateFin: reservation.dateFin,
      });
      toast.success('Réservation effectuée avec succès');
      setShowModal(false);
      setSelectedCar(null);
      setReservation({ dateDebut: '', dateFin: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur lors de la réservation');
    } finally {
      setReserving(false);
    }
  };

  const openReserve = (voiture) => {
    setSelectedCar(voiture);
    setReservation({ dateDebut: '', dateFin: '' });
    setShowModal(true);
  };

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
          <h1>Notre flotte</h1>
          <p>{voitures.length} véhicules disponibles</p>
        </div>
      </div>

      <div className="cars-grid">
        {voitures.map((voiture) => (
          <div key={voiture._id} className="card">
            <img
              className="card-img"
              src={voiture.image || '/assets/hero_img.png'}
              alt={voiture.nom}
            />
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 className="card-title" style={{ margin: 0 }}>{voiture.nom}</h3>
                <span className={`badge ${voiture.disponible ? 'badge-success' : 'badge-danger'}`}>
                  {voiture.disponible ? 'Disponible' : 'Indisponible'}
                </span>
              </div>
              <p className="card-text">{voiture.description}</p>
              <div style={{ display: 'flex', gap: 16, marginBottom: 12, fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiUsers /> {voiture.places} places
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiTool /> {voiture.transmission}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <FiClock /> {voiture.categorie}
                </span>
              </div>
              <div className="card-price">
                {voiture.prixParJour?.toLocaleString()} F{' '}
                <span>/ jour</span>
              </div>
            </div>
            {voiture.disponible && (
              <div className="card-footer">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => openReserve(voiture)}
                >
                  Réserver
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Réservation - {selectedCar?.nom}</h2>
            <p style={{ color: 'var(--gray-600)', marginBottom: 20, fontSize: '0.9rem' }}>
              {selectedCar?.prixParJour?.toLocaleString()} F / jour
            </p>
            <form onSubmit={handleReserve}>
              <div className="form-row">
                <div className="form-group">
                  <label>Date de début</label>
                  <input
                    type="date"
                    value={reservation.dateDebut}
                    onChange={(e) =>
                      setReservation({ ...reservation, dateDebut: e.target.value })
                    }
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="form-group">
                  <label>Date de fin</label>
                  <input
                    type="date"
                    value={reservation.dateFin}
                    onChange={(e) =>
                      setReservation({ ...reservation, dateFin: e.target.value })
                    }
                    min={reservation.dateDebut || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>

              {reservation.dateDebut && reservation.dateFin && (
                <div
                  style={{
                    background: 'var(--gray-100)',
                    padding: 16,
                    borderRadius: 'var(--radius)',
                    marginBottom: 20,
                  }}
                >
                  <p style={{ fontSize: '0.85rem', color: 'var(--gray-600)' }}>
                    Nombre de jours :{' '}
                    {Math.ceil(
                      (new Date(reservation.dateFin) -
                        new Date(reservation.dateDebut)) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </p>
                  <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary)' }}>
                    Total :{' '}
                    {(
                      Math.ceil(
                        (new Date(reservation.dateFin) -
                          new Date(reservation.dateDebut)) /
                          (1000 * 60 * 60 * 24)
                      ) * (selectedCar?.prixParJour || 0)
                    ).toLocaleString()}{' '}
                    F
                  </p>
                </div>
              )}

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={reserving}
                >
                  {reserving ? 'Réservation...' : 'Confirmer la réservation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cars;
