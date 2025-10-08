const pool = require('../db');
const getAvailableSlots = require('../utils/getAvailableSlots');
const sendReservationConfirmation = require('../emails/sendReservationEmail');
const checkValidCancel = require('../utils/checkValidCancel');

exports.getAllFields = async (req, res) => {
  try {
    const fields = await pool.query("SELECT * FROM fields");
    res.json(fields.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Server error while fetching fields" });
  }
};

exports.getAvailability = async (req, res) => {
  const { fieldId } = req.params;
  const { date } = req.query;

  try {
    const availableSlots = await getAvailableSlots(fieldId, date);
    res.json(availableSlots);
  } catch (error) {
    console.error("Error fetching field availability:", error);
    res.status(500).json({ message: "Error fetching availability", date, fieldId });
  }
};

exports.bookSlot = async (req, res) => {
  try {
    const { fieldId, slot_id } = req.params;
    const { date } = req.query;
    const { userId, email } = req.user;

    const existingReservation = await pool.query(
      `SELECT * FROM reservations 
       WHERE reservation_date = $1 AND field_id = $2 AND time_slot_id = $3`,
      [date, fieldId, slot_id]
    );

    if (existingReservation.rowCount > 0) {
      return res.status(409).json({ message: "Slot is unavailable" });
    }

    const newBooking = await pool.query(
      `WITH new_res AS (
         INSERT INTO reservations (user_id, field_id, reservation_date, time_slot_id)
         VALUES ($1, $2, $3, $4)
         RETURNING *
       )
       SELECT new_res.*, f.name AS field_name, t.slot_name
       FROM new_res
       JOIN fields f ON new_res.field_id = f.id
       JOIN time_slots t ON new_res.time_slot_id = t.id`,
      [userId, fieldId, date, slot_id]
    );

    const { field_name, slot_name } = newBooking.rows[0];

    res.status(201).json({ message: "Reservation made and email sent" });

    const sendEmailWithRetry = async (attempts = 3, delay = 2000) => {
      for (let i = 0; i < attempts; i++) {
        try {
          await sendReservationConfirmation(email, field_name, date, slot_name);
          console.log(`Confirmation email sent to ${email}`);
          return;
        } catch (err) {
          console.error(`Attempt ${i + 1} failed to send email:`, err.message);
          if (i < attempts - 1) await new Promise(r => setTimeout(r, delay)); // wait before retry
        }
      }
      console.error(`All ${attempts} attempts to send email to ${email} failed.`);
    };

    sendEmailWithRetry();

  } catch (error) {
    console.error("Error booking slot:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getReservationHistory = async (req, res) => {
  try {
    const { userId } = req.user;

    const result = await pool.query(
      `SELECT
         r.reservation_date,
         r.id,
         r.created_at,
         t.slot_name,
         f.name AS field_name,
         f.price_per_hour,
         t.start_time
       FROM reservations r
       JOIN fields f ON r.field_id = f.id
       JOIN time_slots t ON r.time_slot_id = t.id
       WHERE r.user_id = $1`,
      [userId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching reservation history:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

exports.cancelReservation = async (req, res) => {
  try {
    const { reservationId } = req.params;

    const result = await pool.query(
      `SELECT r.reservation_date, t.start_time
       FROM reservations r
       JOIN time_slots t ON r.time_slot_id = t.id
       WHERE r.id = $1`,
      [reservationId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Invalid reservation id" });
    }

    const { reservation_date, start_time } = result.rows[0];

    if (!checkValidCancel(reservation_date, start_time)) {
      return res.status(400).json({ message: "Can't cancel reservation" });
    }

    await pool.query("DELETE FROM reservations WHERE id = $1", [reservationId]);

    res.json(result.rows);
  } catch (error) {
    console.error("Error cancelling reservation:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};
