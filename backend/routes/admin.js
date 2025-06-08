const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authenticateToken');
const checkAdminRole = require('../middleware/checkAdminRole');
const adminController = require('../controllers/adminController');
const upload = require('../utils/multerUpload');

router.post('/make-reservation', authenticateToken, checkAdminRole, adminController.makeReservation);
router.get('/see-reservations', authenticateToken, checkAdminRole, adminController.seeReservations);
router.delete('/delete-field', authenticateToken, checkAdminRole, adminController.deleteField);
router.put('/modify-field-details', authenticateToken, checkAdminRole, adminController.modifyFieldDetails);
router.post('/add-field', authenticateToken, checkAdminRole, upload.single('image'), adminController.addField);

module.exports = router;
