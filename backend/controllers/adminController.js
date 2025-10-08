const pool = require('../db');

exports.makeReservation = async (req, res) => {
  try {
    const { guest_name, guest_phone, fieldId, date, slotId } = req.body;

    if (!guest_name || !guest_phone || !fieldId || !date || !slotId) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const result = await pool.query(
      `INSERT INTO reservations (guest_name, guest_phone, field_id, reservation_date, time_slot_id)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [guest_name, guest_phone, fieldId, date, slotId]
    );

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error making reservation:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.seeReservations = async (req, res) => {
  try {
    const { date, fieldId } = req.query;

    const result = await pool.query(
      `SELECT
         ts.id AS slot_id,
         ts.slot_name,
         u.name AS user_name,
         u.email AS user_email,
         r.id AS reservation_id,
         r.guest_name,
         r.guest_phone,
         CASE WHEN r.id IS NULL THEN false ELSE true END AS isBooked
       FROM time_slots ts
       LEFT JOIN reservations r ON r.time_slot_id = ts.id
         AND r.field_id = $1
         AND r.reservation_date = $2
       LEFT JOIN users u ON r.user_id = u.id`,
      [fieldId, date]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservations:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteField = async (req, res) => {
  try {
    const { field_id } = req.body;

    const result = await pool.query(
      "DELETE FROM fields WHERE id = $1 RETURNING *",
      [field_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Field not found" });
    }

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error deleting field:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.modifyFieldDetails = async (req, res) => {
  try {
    const { field_id, name, description, location, price_per_hour } = req.body;

    const fields = [];
    const values = [];
    let index = 1;

    if (name !== undefined) {
      fields.push(`name = $${index++}`);
      values.push(name);
    }

    if (description !== undefined) {
      fields.push(`description = $${index++}`);
      values.push(description);
    }

    if (location !== undefined) {
      fields.push(`location = $${index++}`);
      values.push(location);
    }

    if (price_per_hour !== undefined) {
      fields.push(`price_per_hour = $${index++}`);
      values.push(price_per_hour);
    }

    if (fields.length === 0) {
      return res.status(400).json({ message: "No fields provided to update" });
    }

    values.push(field_id);

    const result = await pool.query(
      `UPDATE fields SET ${fields.join(', ')} WHERE id = $${index} RETURNING *`,
      values
    );

    res.json({ data: result.rows[0] });
  } catch (error) {
    console.error("Error updating field:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addField = async (req, res) => {
  try {
    const { name, description, location, price_per_hour } = req.body;
    const imagePath = req.file.path;

    const result = await pool.query(
      `INSERT INTO fields (name, description, location, price_per_hour, image_path)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [name, description, location, price_per_hour, imagePath]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error adding field:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
