const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const fieldsController = require('../controllers/fieldsController');

router.get('/', fieldsController.getAllFields);
router.get('/:fieldId/availability', fieldsController.getAvailability);
router.post('/book/:fieldId/:slot_id', authenticateToken, fieldsController.bookSlot);
router.get('/reservations-history', authenticateToken, fieldsController.getReservationHistory);
router.delete('/cancel-reservation/:reservationId', authenticateToken, fieldsController.cancelReservation);

module.exports = router;
