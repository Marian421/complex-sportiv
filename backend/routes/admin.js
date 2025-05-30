const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const checkAdminRole = require('../middleware/checkAdminRole');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/fields/');
  },
  filename: (req, file, cb) => {
    const name = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, name + path.extname(file.originalname));
  },
});

const upload = multer({storage});

router.post('/make-reservation', authenticateToken, checkAdminRole,  async (req, res) => {

    try {
        const { 
            guest_name,
            guest_phone,
            fieldId,
            date,
            slotId
        } = req.body;

        if (!guest_name || !guest_phone || !fieldId || !date || !slotId) {
          return res.status(400).json({ message: `Missing required fields ${guest_name} ${guest_phone} ${fieldId} ${date} ${slotId}` });
        }
    
        const insertResult = await pool.query(
            `insert into reservations
                (guest_name, guest_phone, field_id, reservation_date, time_slot_id)
             values
                ($1, $2, $3, $4, $5)
             returning *`,
             [guest_name, guest_phone, fieldId, date, slotId]
        );
    
        res.json({data: insertResult.rows[0]});   
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/see-reservations', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const {
            date,
            fieldId
        } = req.query;

        const users = await pool.query(`
            select
                ts.id AS slot_id,
                ts.slot_name,
                u.name AS user_name,
                u.email AS user_email,
                r.id AS reservation_id,
                r.guest_name,
                r.guest_phone,
                CASE WHEN r.id IS NULL THEN false ELSE true END AS isBooked
            from time_slots ts
            left join reservations r
                on r.time_slot_id = ts.id
                and r.field_id = $1
                and r.reservation_date = $2
            left join users u
                on r.user_id = u.id           
            `, [fieldId, date]
        );

        res.json(users.rows)


    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.delete('/delete-field', authenticateToken, checkAdminRole, async (req, res) => {
    try {
        const { field_id } = req.body;

        const deleteResult = await pool.query(
            "delete from fields where id=$1 returning *",
            [field_id]
        );

        res.json({data: deleteResult.rows[0]});

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.put('/modify-field-details', async (req, res) => {
    try {
        const {
            field_id,
            name,
            description,
            location,
            price_per_hour,
            image_path
        } = req.body;

        const fields = [];
        const values = [];
        let index = 1;

        if (name !== undefined) {
            fields.push(`name=$${index++}`); // fields = ['name=$1']
            values.push(name);
        }

        if (description !== undefined) {
            fields.push(`description=$${index++}`);
            values.push(description);
        }

        if (location !== undefined) {
            fields.push(`location=$${index++}`);
            values.push(location);
        }

        if (price_per_hour !== undefined) {
            fields.push(`price_per_hour=$${index++}`);
            values.push(price_per_hour);
        }
        
        values.push(field_id);

        const updateResult = await pool.query(
            `update fields
                set ${fields.join(', ')}
             where id=$${index}
             returning *`
        )
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

router.post('/add-field', authenticateToken, checkAdminRole, upload.single('image'), async (req, res) => {
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



module.exports = router;