const express = require('express');
const router = express.Router();
const pool = require('../db');
const authenticateToken = require('../middleware/authenticateToken');
const checkAdminRole = require('../middleware/checkAdminRole');

router.post('/make-reservation', authenticateToken, checkAdminRole,  async (req, res) => {

    try {
        const { 
            guestName,
            guestPhone,
            field_id,
            reservation_date,
            time_slot_id
        } = req.body;
    
        const insertResult = await pool.query(
            `insert into reservations
                (guest_name, guest_phone, field_id, reservation_date, time_slot_id)
             values
                ($1, $2, $3, $4, $5)
             returning *`,
             [guestName, guestPhone, field_id, reservation_date, time_slot_id]
        );
    
        res.json({data: insertResult.rows[0]});   
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
})



module.exports = router;