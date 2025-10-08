require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
})

if (process.env.NODE_ENV !== 'test'){
  pool.connect()
    .then(() => console.log('Connected to the database!'))
    .catch(err => console.error('Database connection error:', err.stack));
}

module.exports = pool;