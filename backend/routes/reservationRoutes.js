const express = require('express');
const {
  getReservations,
  getReservation,
  creerReservation,
  modifierStatutReservation,
  annulerReservation,
} = require('../controllers/reservationController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');
const router = express.Router();

router.get('/', protect, getReservations);
router.get('/:id', protect, getReservation);
router.post('/', protect, creerReservation);
router.put('/:id/statut', protect, authorize('admin'), modifierStatutReservation);
router.put('/:id/annuler', protect, annulerReservation);

module.exports = router;
