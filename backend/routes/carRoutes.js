const express = require('express');
const {
  getVoitures,
  getVoiture,
  creerVoiture,
  modifierVoiture,
  supprimerVoiture,
} = require('../controllers/carController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/', getVoitures);
router.get('/:id', getVoiture);
router.post('/', protect, authorize('admin'), creerVoiture);
router.put('/:id', protect, authorize('admin'), modifierVoiture);
router.delete('/:id', protect, authorize('admin'), supprimerVoiture);

module.exports = router;
