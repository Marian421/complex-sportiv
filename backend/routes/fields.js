const express = require('express');
const router = express.Router();
const pool = require('../db');
const multer = require('multer');
const path = require('path');
const getAvailableSlots = require('../utils/getAvailableSlots');
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
       res.status(500).json({ message: "Server error while fetching fields" });
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
  try {
    const { fieldId, slot_id } = req.params;
    const { date } = req.query;
    const { userId, email } = req.user;

    const existingReservation = await pool.query(
      "select * from reservations where reservation_date=$1 and field_id=$2 and time_slot_id=$3",
      [date, fieldId, slot_id]
    );

    if(existingReservation.rowCount > 0){
      return res.status(409).json({ message: "Slot is unavailable"});
    }

    const newBooking = await pool.query(
      `with new_res as(
      insert into reservations (user_id, field_id, reservation_date, time_slot_id, status)
      values($1, $2, $3, $4, 'pending')
      returning *)
      select new_res.*, f.name as field_name, t.slot_name
      from new_res
      join fields f on new_res.field_id = f.id
      join time_slots t on new_res.time_slot_id = t.id`,
      [userId, fieldId, date, slot_id,]
    )

    const { field_name, slot_name} = newBooking.rows[0];

    const confirmationSent = await sendReservationConfirmation(email, field_name, date, slot_name);

    if(!confirmationSent){
      return res.status(201).json({message: "Reservation created but failed to send confirmation email"});
    }

    res.status(201).json({message: "Reservation made and email sent"});

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }

})

router.get("/reservations-history", authenticateToken, async (req, res) => {
  try {
    const { userId } = req.user;

    const reservations = await pool.query(
      "select * from reservations where user_id=$1",
      [userId]
    )

    res.json(reservations.rows);


  } catch(error){
    console.error(error.message);
    res.status(500).json({ message: "Server error" });
  }


})


module.exports = router;