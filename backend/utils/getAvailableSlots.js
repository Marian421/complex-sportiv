const pool = require("../db");

// querry the database to find all availabe time slots for a given date and field

const getAvailableSlots = async (fieldId, date) => {
  try {
    const result = await pool.query(
      `
      SELECT ts.id AS slot_id, 
             ts.slot_name, 
             CASE WHEN r.id IS NULL THEN false ELSE true END AS isBooked
      FROM time_slots ts
      LEFT JOIN reservations r
        ON r.time_slot_id = ts.id 
        AND r.field_id = $1
        AND r.reservation_date = $2
      WHERE ts.id IS NOT NULL
    `,
      [fieldId, date],
    );

    return result.rows;
  } catch (error) {
    console.error("Error fetching available slots:", error);
    throw error;
  }
};

module.exports = getAvailableSlots;
