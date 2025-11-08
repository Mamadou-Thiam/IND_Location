document.addEventListener('DOMContentLoaded', () => {

    // ====================================
    // A. Gestion du Menu Mobile (Responsive)
    // ====================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.getElementById('navLinks');
    // Si la balise navLinks n'a pas l'ID, utilisez document.querySelector('.nav-links')
    if (navLinks) {
        // La liste ul doit avoir l'ID "navLinks" pour que cela fonctionne.
        // Si vous n'avez pas mis d'ID, utilisez : const navLinks = document.querySelector('.nav-links');
        const navItems = navLinks.querySelectorAll('a');

        // 1. Bascule du menu au clic du bouton (Hamburger)
        if (menuToggle) {
            menuToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }

        // 2. Fermeture du menu après un clic sur un lien (UX Mobile)
        navItems.forEach(item => {
            item.addEventListener('click', () => {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                }
            });
        });
    }


    // ====================================
    // B. Logique du Formulaire de Réservation (Calcul du Prix)
    // ====================================
    const formReservation = document.getElementById('formReservation');
    const dateDebutInput = document.getElementById('date_debut');
    const dateFinInput = document.getElementById('date_fin');
    const vehiculeSelect = document.getElementById('vehicule');
    const prixTotalElement = document.getElementById('prixTotal');

    // Fonction de calcul du prix
    const calculerPrix = () => {
        // Cette ligne est cruciale : elle s'assure que les champs existent et sont remplis
        if (!dateDebutInput.value || !dateFinInput.value || !vehiculeSelect.value) {
            prixTotalElement.innerHTML = 'Prix estimé : **0 €**';
            return;
        }

        const debut = new Date(dateDebutInput.value);
        const fin = new Date(dateFinInput.value);
        
        // Validation des dates
        if (debut.getTime() >= fin.getTime()) {
            prixTotalElement.innerHTML = 'Prix estimé : **Dates invalides**';
            return;
        }

        // Calcul du nombre de jours
        const differenceTemps = fin.getTime() - debut.getTime();
        const jours = Math.ceil(differenceTemps / (1000 * 3600 * 24)); 
        
        // Récupération du prix journalier
        const optionSelectionnee = vehiculeSelect.options[vehiculeSelect.selectedIndex];
        const prixJournalier = parseFloat(optionSelectionnee.dataset.prix) || 0; // Utilise .dataset pour lire data-prix

        // Calcul du prix total
        const prixTotal = jours * prixJournalier;

        if (prixTotal > 0) {
            prixTotalElement.innerHTML = `Prix estimé : **${prixTotal.toFixed(2)} €** pour ${jours} jours.`;
        } else {
            prixTotalElement.innerHTML = 'Prix estimé : **0 €**';
        }
    };

    // Écouteurs pour le calcul en direct (C'est ce qui déclenche le calcul sans soumettre)
    dateDebutInput.addEventListener('change', calculerPrix);
    dateFinInput.addEventListener('change', calculerPrix);
    vehiculeSelect.addEventListener('change', calculerPrix);

    // S'assurer que le formulaire ne s'envoie pas à Formspree avant la validation
    formReservation.addEventListener('submit', (e) => {
        // ⚠️ C'est la ligne la PLUS importante : elle empêche l'envoi direct
        e.preventDefault(); 
        
        const debut = new Date(dateDebutInput.value);
        const fin = new Date(dateFinInput.value);

        if (debut.getTime() >= fin.getTime() || vehiculeSelect.value === "") {
             alert("Veuillez vérifier les dates et sélectionner un véhicule.");
             return;
        }
        
        alert("Votre demande de réservation a été envoyée ! Un commercial vous recontactera rapidement.");
        // Pour un envoi réel (après la validation JS), vous pouvez utiliser AJAX ou décommenter la ligne suivante :
        // formReservation.submit(); 
        formReservation.reset();
        calculerPrix(); 
    });


    // ====================================
    // C. Logique du Formulaire de Contact
    // ====================================
    const formContact = document.getElementById('formContact');

    formContact.addEventListener('submit', (e) => {
        e.preventDefault();
        alert("Merci ! Votre message a été envoyé à IND Location. Nous vous répondrons dans les plus brefs délais.");
        formContact.reset();
        // Ici aussi, il faudrait utiliser AJAX ou formspree.io pour l'envoi réel de l'email.
    });
});