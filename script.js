document.addEventListener('DOMContentLoaded', () => {

    // ====================================
    // A. Gestion du Menu Mobile & Pop-up
    // ====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('navLinks'); 
    
    // Pop-up elements
    const successPopup = document.getElementById('successPopup');
    const popupTitle = document.getElementById('popupTitle');
    const popupText = document.getElementById('popupText');
    const closeBtn = document.querySelector('.close-btn');

    // Fonction pour afficher le pop-up avec un message personnalisé
    const showSuccessPopup = (title, text) => {
        if (successPopup) {
            popupTitle.textContent = title;
            popupText.innerHTML = text;
            successPopup.style.display = 'block';
        }
    };

    const hideSuccessPopup = () => {
        if (successPopup) {
            successPopup.style.display = 'none';
        }
    };

    // Gestion du menu mobile
    if (navLinks) {
        // ... (Logique du menu mobile identique à l'étape précédente) ...
    }

    // Événements pour fermer le pop-up
    if (closeBtn) {
        closeBtn.addEventListener('click', hideSuccessPopup);
    }
    window.addEventListener('click', (event) => {
        if (event.target === successPopup) {
            hideSuccessPopup();
        }
    });

    // ====================================
    // B. Logique du Formulaire de Réservation
    // ====================================
    const formReservation = document.getElementById('formReservation');
    const dateDebutInput = document.getElementById('date_debut');
    const dateFinInput = document.getElementById('date_fin');
    const vehiculeSelect = document.getElementById('vehicule');
    const prixTotalElement = document.getElementById('prixTotal');

    const calculerPrix = () => {
        // Logique de calcul du prix (inchangée et fonctionnelle)
        if (!dateDebutInput.value || !dateFinInput.value || !vehiculeSelect.value) {
            prixTotalElement.innerHTML = 'Prix estimé : **0 €**';
            return;
        }

        const debut = new Date(dateDebutInput.value);
        const fin = new Date(dateFinInput.value);
        
        if (debut.getTime() >= fin.getTime()) {
            prixTotalElement.innerHTML = 'Prix estimé : **Dates invalides**';
            return;
        }

        const differenceTemps = fin.getTime() - debut.getTime();
        const jours = Math.ceil(differenceTemps / (1000 * 3600 * 24)); 
        
        const optionSelectionnee = vehiculeSelect.options[vehiculeSelect.selectedIndex];
        const prixJournalier = parseFloat(optionSelectionnee.dataset.prix) || 0;

        const prixTotal = jours * prixJournalier;

        if (prixTotal > 0) {
            prixTotalElement.innerHTML = `Prix estimé : **${prixTotal.toFixed(2)} €** pour ${jours} jours.`;
        } else {
            prixTotalElement.innerHTML = 'Prix estimé : **0 €**';
        }
    };

    if (formReservation) {
        // Déclencheurs de calcul
        dateDebutInput.addEventListener('change', calculerPrix);
        dateFinInput.addEventListener('change', calculerPrix);
        vehiculeSelect.addEventListener('change', calculerPrix);
        calculerPrix(); 
        
        // Gestion de la soumission de réservation
        formReservation.addEventListener('submit', (e) => {
            const debut = new Date(dateDebutInput.value);
            const fin = new Date(dateFinInput.value);

            if (debut.getTime() >= fin.getTime() || vehiculeSelect.value === "") {
                e.preventDefault(); 
                alert("Erreur de validation : Veuillez vérifier les dates et sélectionner un véhicule.");
                return;
            }
            
            // Si la validation réussit, on affiche le pop-up, puis Formspree prend le relais.
            showSuccessPopup(
                "Réservation Reçue ! 🚗", 
                "Merci pour votre demande de réservation. Nous vous contacterons **très rapidement** pour confirmer le véhicule et finaliser le paiement."
            );
            
            // ⚠️ On utilise un petit délai avant l'envoi réel pour permettre l'affichage du pop-up
            e.preventDefault(); 
            setTimeout(() => {
                formReservation.submit();
            }, 500); // Envoie le formulaire après 500ms
        });
    }

    // ====================================
    // C. Logique du Formulaire de Contact
    // ====================================
    const formContact = document.getElementById('formContact');

    if (formContact) {
        formContact.addEventListener('submit', (e) => {
            // Pas de validation complexe requise ici
            
            // Affichage du pop-up de succès
            showSuccessPopup(
                "Message Envoyé ! 💬", 
                "Nous avons bien reçu votre message. Nous vous répondrons dans les plus brefs délais."
            );
            
            // On bloque l'envoi initial, puis on l'envoie avec un délai.
            e.preventDefault();
            setTimeout(() => {
                formContact.submit();
            }, 500);
            
            formContact.reset();
        });
    }
});