require("dotenv").config();
const Pool = require("pg").Pool;

let pool;

if (process.env.NODE_ENV === "PRODUCTION") {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
} else {
  pool = new Pool();
}

if (process.env.NODE_ENV !== "test") {
  pool
    .connect()
    .then(() => console.log("Connected to the database!"))
    .catch((err) => console.error("Database connection error:", err.stack));
}

module.exports = pool;
