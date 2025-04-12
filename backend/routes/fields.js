const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const getAvailableSlots = require('../utils/getAvailableSlots');
const isBooked = require('../utils/isBooked');
const authenticateToken = require('../middleware/authenticateToken');
const checkAdminRole = require('../middleware/checkAdminRole');
const sendReservationConfirmation = require('../emails/sendReservationEmail');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/fields/');
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, name + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const fields = await pool.query(
            "select * from fields"
        )
        res.json(fields.rows);
    } catch (err) {
       console.error(err.message); 
    }
})

router.post('/add', authenticateToken, checkAdminRole, upload.single('image'), async (req, res) => {
  try {
    const { name, description, location, price_per_hour } = req.body;
    const imagePath = `/uploads/fields/${req.file.filename}`;

    const result = await pool.query(
      'INSERT INTO fields (name, description, location, price_per_hour, image_path) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, location, price_per_hour, imagePath]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Error adding field' });
  }
});

router.get('/:fieldId/availability', async (req, res) => {
  const { fieldId }  = req.params;
  const { date } = req.query;    
  
  try {
    const availableSlots = await getAvailableSlots(fieldId, date);

    res.json(availableSlots);  
  } catch (error) {
    console.error('Error fetching field availability:', error);
    res.status(500).json({ message: 'Error fetching availability', date, fieldId });
  }
});

router.post('/book/:fieldId/:slot_id', authenticateToken, async (req, res) => {
    const { fieldId, slot_id } = req.params;
    const { date } = req.query;
    const { userId, email } = req.user;

    const availableSlots = await getAvailableSlots(fieldId, date);

    if (isBooked(availableSlots, slot_id)){
        return res.json({message: "slot booked"});
    }

    const newBooking = await pool.query(
      "insert into reservations (user_id, field_id, reservation_date, time_slot_id, status) values ($1,$2,$3,$4,'pending')",
      [userId, fieldId, date, slot_id,]
    )

    const confirmationSent = sendReservationConfirmation(email, )

})


module.exports = router;