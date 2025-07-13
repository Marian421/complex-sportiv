const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const fieldsController = require('../controllers/fieldsController');
const validate = require('../middleware/validate');
const {
  getAvailabilityParams,
  getAvailabilityQuery,
  bookSlotParams,
  bookSlotQuery,
  cancelReservationParams
} = require('../validators/fieldsValidator');

router.get('/', fieldsController.getAllFields);
router.get('/reservations-history', authenticateToken, fieldsController.getReservationHistory);
router.get(
  '/:fieldId/availability',
  validate(getAvailabilityParams, 'params'),
  validate(getAvailabilityQuery, 'query'),
  fieldsController.getAvailability
);
router.post(
  '/book/:fieldId/:slot_id',
  validate(bookSlotParams, 'params'),
  validate(bookSlotQuery, 'query'),
  authenticateToken, 
  fieldsController.bookSlot
);
router.delete(
  '/cancel-reservation/:reservationId',
  validate(cancelReservationParams, 'params'),
  authenticateToken, 
  fieldsController.cancelReservation
);

module.exports = router;
