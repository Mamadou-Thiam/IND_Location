import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaWhatsapp, FaCalendarAlt, FaPlaneDeparture, FaRoute } from 'react-icons/fa';
import api from '../api/axios';
import { optimiserImage } from '../utils/image';

const Landing = () => {
  const [voitures, setVoitures] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/voitures').then(({ data }) => setVoitures(data)).catch(() => {});
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }, []);

  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ nom: '', telephone: '', dateDebut: '', dateFin: '', voiture: '' });
  const [prixTotal, setPrixTotal] = useState(0);
  const [contactForm, setContactForm] = useState({ nom: '', email: '', message: '' });

  const calculerPrix = (field, value) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    if (updated.dateDebut && updated.dateFin && updated.voiture) {
      const voiture = voitures.find((v) => v._id === updated.voiture);
      if (voiture) {
        const jours = Math.ceil((new Date(updated.dateFin) - new Date(updated.dateDebut)) / (1000 * 60 * 60 * 24));
        setPrixTotal(jours > 0 ? jours * voiture.prixParJour : 0);
      }
    }
  };

  return (
    <div className="landing">
      <a href="https://wa.me/221771450218" className="whatsapp-float" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
        <FaWhatsapp />
      </a>

      <nav className="landing-nav">
        <div className="landing-nav-inner">
          <Link to="/" className="landing-logo">
            <span className="landing-logo-icon">IL</span>
            <span>IND Location</span>
          </Link>
          <button className="landing-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            &#9776;
          </button>
          <ul className={`landing-nav-links ${menuOpen ? 'active' : ''}`}>
            <li><a href="#accueil">Accueil</a></li>
            <li><a href="#flotte">Nos Véhicules</a></li>
            <li><a href="#services">Services</a></li>
            <li><a href="#contact">Contact</a></li>
            <li><Link to="/connexion" className="landing-btn-connect">Connexion</Link></li>
          </ul>
        </div>
      </nav>

      <section id="accueil" className="landing-hero">
        <div className="landing-hero-overlay" />
        <div className="landing-hero-content">
          <h1>Liberté de mouvement avec IND Location</h1>
          <p>Louez votre voiture idéale pour un week-end ou un long voyage. Simple, rapide et au meilleur prix.</p>
          <button className="landing-cta" onClick={() => navigate('/connexion')}>
            Réserver en 3 clics
          </button>
        </div>
      </section>

      <section id="a-propos" className="landing-section landing-about">
        <h2>À Propos de IND Location</h2>
        <p className="landing-about-mission">
          IND Location est une entreprise de location de voitures dédiée à simplifier votre mobilité.
          Notre mission est de mettre en relation nos clients avec un service de location de véhicules fiable et de qualité.
        </p>
        <p>
          Grâce à une plateforme de réservation en ligne conviviale et un support client exceptionnel disponible 24/7,
          nous rendons la location de voiture sans stress, que ce soit pour une escapade rapide ou un besoin à long terme.
        </p>
        <div className="landing-about-promise">
          <p>Notre Promesse : Transparence des prix et rapidité du service.</p>
        </div>
      </section>

      <section id="flotte" className="landing-section landing-fleet">
        <h2>Découvrez notre flotte de véhicules</h2>
        <div className="landing-fleet-grid">
          {voitures.map((v) => (
            <div key={v._id} className="landing-fleet-card">
              <img src={optimiserImage(v.image, { w: 400, h: 200 }) || 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=400&q=60'} alt={v.nom} />
              <h3>{v.nom}</h3>
              <p className="landing-fleet-desc">{v.description || `Parfaite pour tous vos déplacements.`}</p>
              <div className="landing-fleet-features">
                <span>👤 {v.places} places</span>
                <span>⚙️ {v.transmission}</span>
                <span>⛽️ {v.categorie}</span>
              </div>
              <div className="landing-fleet-price">{v.prixParJour?.toLocaleString()} F <span>/ jour</span></div>
              <button className="landing-fleet-btn" onClick={() => navigate('/connexion')}>Réserver ce modèle</button>
            </div>
          ))}
        </div>
      </section>

      <section id="reservation" className="landing-section landing-reservation">
        <h2>📅 Réservez votre véhicule en ligne</h2>
        <form className="landing-form" onSubmit={(e) => { e.preventDefault(); navigate('/connexion'); }}>
          <label>Nom Complet</label>
          <input type="text" placeholder="Votre nom" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })} />

          <label>Téléphone</label>
          <input type="tel" placeholder="+221 77 000 00 00" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })} />

          <div className="landing-form-row">
            <div>
              <label>Date de début</label>
              <input type="date" value={form.dateDebut} onChange={(e) => calculerPrix('dateDebut', e.target.value)} />
            </div>
            <div>
              <label>Date de fin</label>
              <input type="date" value={form.dateFin} onChange={(e) => calculerPrix('dateFin', e.target.value)} />
            </div>
          </div>

          <label>Véhicule</label>
          <select value={form.voiture} onChange={(e) => calculerPrix('voiture', e.target.value)}>
            <option value="">-- Choisir un modèle --</option>
            {voitures.map((v) => (
              <option key={v._id} value={v._id}>{v.nom} ({v.prixParJour?.toLocaleString()} F/jour)</option>
            ))}
          </select>

          <div className="landing-form-total">
            Prix estimé : <strong>{prixTotal.toLocaleString()} F CFA</strong>
          </div>

          <button type="submit" className="landing-submit-btn">Confirmer la Réservation</button>
        </form>
      </section>

      <section id="services" className="landing-section landing-services">
        <h2>Nos Services Complémentaires</h2>
        <div className="landing-services-grid">
          <div className="landing-service-card">
            <FaCalendarAlt className="landing-service-icon" />
            <h3>Locations Flexibles</h3>
            <ul>
              <li>Location à la journée, à la semaine, au mois et/ou à l'année</li>
              <li>Location longue durée (LLD) avec ou sans option de rachat</li>
            </ul>
          </div>
          <div className="landing-service-card">
            <FaPlaneDeparture className="landing-service-icon" />
            <h3>Transferts Spécialisés</h3>
            <ul>
              <li>Transfert Aéroport (Accueil personnalisé)</li>
              <li>Transfert dans la région (Voyages inter-villes)</li>
            </ul>
          </div>
          <div className="landing-service-card">
            <FaRoute className="landing-service-icon" />
            <h3>Transport sur Mesure</h3>
            <ul>
              <li>Transport Événementiel (Mariages, séminaires)</li>
              <li>Transport Personnel (Chauffeur privé)</li>
              <li>Transport Touristique (Circuits et excursions)</li>
            </ul>
          </div>
        </div>
      </section>

      <section id="contact" className="landing-section landing-contact">
        <h2>💬 Une question ? Contactez-nous !</h2>
        <form className="landing-form" onSubmit={(e) => { e.preventDefault(); alert('Message envoyé ! Nous vous répondrons rapidement.'); }}>
          <label>Nom Complet</label>
          <input type="text" placeholder="Votre nom" value={contactForm.nom} onChange={(e) => setContactForm({ ...contactForm, nom: e.target.value })} />

          <label>Email</label>
          <input type="email" placeholder="votre@email.com" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} />

          <label>Message</label>
          <textarea rows="5" placeholder="Votre message..." value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} />

          <button type="submit" className="landing-submit-btn">Envoyer le message</button>
        </form>
      </section>

      <footer className="landing-footer">
        <p>IND Location - Votre partenaire mobilité.</p>
        <div className="landing-footer-links">
          <a href="#">Conditions Générales</a> | <a href="#">Mentions Légales</a> | <a href="#">FAQ</a>
        </div>
        <p>&copy; {new Date().getFullYear()} Tous droits réservés.</p>
      </footer>
    </div>
  );
};

export default Landing;
