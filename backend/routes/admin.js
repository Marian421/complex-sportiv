const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkAdminRole = require('../middleware/checkAdminRole');
const adminController = require('../controllers/adminController');
const upload = require('../utils/multerUpload');
const validate = require('../middleware/validate');
const {
  makeReservation,
  seeReservationsQuery,
  deleteField,
  addField
} = require('../validators/adminValidator');

router.post(
    '/make-reservation', 
    validate(makeReservation), 
    authenticateToken, 
    checkAdminRole, 
    adminController.makeReservation
);
router.get(
    '/see-reservations', 
    validate(seeReservationsQuery, 'query'),
    authenticateToken, 
    checkAdminRole, 
    adminController.seeReservations
);
router.delete(
    '/delete-field', 
    validate(deleteField), 
    authenticateToken, 
    checkAdminRole, 
    adminController.deleteField
);
router.post(
    '/add-field',
    authenticateToken, 
    checkAdminRole, 
    upload.single('image'), 
    validate(addField), 
    adminController.addField
);

module.exports = router;
