const express = require('express');
const { inscrire, connecter, getProfil } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/inscrire', inscrire);
router.post('/connecter', connecter);
router.get('/profil', protect, getProfil);

module.exports = router;
