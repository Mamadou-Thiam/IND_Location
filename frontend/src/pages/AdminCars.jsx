import { useState, useEffect, useRef } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiUpload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import api from '../api/axios';
import { optimiserImage } from '../utils/image';

const AdminCars = () => {
  const [voitures, setVoitures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [preview, setPreview] = useState('');
  const fileRef = useRef(null);
  const [form, setForm] = useState({
    nom: '',
    categorie: 'citadine',
    prixParJour: '',
    description: '',
    image: '',
    transmission: 'manuelle',
    places: 5,
    disponible: true,
  });

  useEffect(() => {
    fetchCars();
  }, []);

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

  const openCreate = () => {
    setEditing(null);
    setForm({
      nom: '',
      categorie: 'citadine',
      prixParJour: '',
      description: '',
      image: '',
      transmission: 'manuelle',
      places: 5,
      disponible: true,
    });
    setPreview('');
    setShowModal(true);
  };

  const openEdit = (voiture) => {
    setEditing(voiture);
    setForm({
      nom: voiture.nom,
      categorie: voiture.categorie,
      prixParJour: voiture.prixParJour,
      description: voiture.description || '',
      image: voiture.image || '',
      transmission: voiture.transmission,
      places: voiture.places,
      disponible: voiture.disponible,
    });
    setPreview(voiture.image || '');
    setShowModal(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    setForm({ ...form, image: file });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.nom || !form.prixParJour) {
      toast.error('Le nom et le prix sont requis');
      return;
    }

    setUploading(true);
    try {
      let imageUrl = form.image;

      if (form.image instanceof File) {
        const fd = new FormData();
        fd.append('image', form.image);
        const { data } = await api.post('/upload', fd, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        imageUrl = data.url;
      }

      const payload = { ...form, image: imageUrl };

      if (editing) {
        await api.put(`/voitures/${editing._id}`, payload);
        toast.success('Voiture modifiée');
      } else {
        await api.post('/voitures', payload);
        toast.success('Voiture créée');
      }
      setShowModal(false);
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer cette voiture ?')) return;
    try {
      await api.delete(`/voitures/${id}`);
      toast.success('Voiture supprimée');
      fetchCars();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
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
          <h1>Gestion des voitures</h1>
          <p>{voitures.length} véhicule(s)</p>
        </div>
        <button
          className="btn btn-primary"
          style={{ width: 'auto' }}
          onClick={openCreate}
        >
          <FiPlus /> Ajouter une voiture
        </button>
      </div>

      <div className="cars-grid">
        {voitures.map((v) => (
          <div key={v._id} className="card">
            <img
              className="card-img"
              src={optimiserImage(v.image, { w: 400, h: 200 }) || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=60'}
              alt={v.nom}
            />
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <h3 className="card-title" style={{ margin: 0 }}>{v.nom}</h3>
                <span className={`badge ${v.disponible ? 'badge-success' : 'badge-danger'}`}>
                  {v.disponible ? 'Dispo' : 'Indispo'}
                </span>
              </div>
              <p className="card-text" style={{ textTransform: 'capitalize' }}>
                {v.categorie} - {v.transmission} - {v.places} places
              </p>
              <div className="card-price">
                {v.prixParJour?.toLocaleString()} F <span>/ jour</span>
              </div>
            </div>
            <div className="card-footer">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => openEdit(v)}
              >
                <FiEdit2 /> Modifier
              </button>
              <button
                className="btn btn-sm btn-outline"
                style={{ color: 'var(--danger)', borderColor: 'var(--danger)' }}
                onClick={() => handleDelete(v._id)}
              >
                <FiTrash2 /> Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Modifier' : 'Ajouter'} une voiture</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nom</label>
                <input
                  type="text"
                  value={form.nom}
                  onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex: Toyota Corolla"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Catégorie</label>
                  <select
                    value={form.categorie}
                    onChange={(e) => setForm({ ...form, categorie: e.target.value })}
                  >
                    <option value="citadine">Citadine</option>
                    <option value="berline">Berline</option>
                    <option value="suv">SUV</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Prix par jour (F)</label>
                  <input
                    type="number"
                    value={form.prixParJour}
                    onChange={(e) => setForm({ ...form, prixParJour: e.target.value })}
                    placeholder="10000"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Transmission</label>
                  <select
                    value={form.transmission}
                    onChange={(e) => setForm({ ...form, transmission: e.target.value })}
                  >
                    <option value="manuelle">Manuelle</option>
                    <option value="automatique">Automatique</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Places</label>
                  <input
                    type="number"
                    value={form.places}
                    onChange={(e) => setForm({ ...form, places: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  rows="3"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Description du véhicule..."
                />
              </div>

              <div className="form-group">
                <label>Image</label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: '2px dashed var(--gray-300)',
                    borderRadius: 'var(--radius)',
                    padding: 24,
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: preview ? 'transparent' : 'var(--gray-100)',
                  }}
                >
                  {preview ? (
                    <img
                      src={preview}
                      alt="Aperçu"
                      style={{ maxHeight: 180, borderRadius: 8, objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ color: 'var(--gray-500)' }}>
                      <FiUpload size={28} style={{ marginBottom: 8 }} />
                      <p>Cliquez pour sélectionner une image</p>
                    </div>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  style={{ display: 'none' }}
                />
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <input
                  type="checkbox"
                  id="disponible"
                  checked={form.disponible}
                  onChange={(e) => setForm({ ...form, disponible: e.target.checked })}
                  style={{ width: 'auto' }}
                />
                <label htmlFor="disponible" style={{ margin: 0 }}>Disponible</label>
              </div>

              <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
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
                  disabled={uploading}
                >
                  {uploading ? 'Upload en cours...' : editing ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCars;
