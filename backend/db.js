require('dotenv').config();
const Pool = require('pg').Pool;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
})

if (process.env.NODE_ENV !== 'test'){
  pool.connect()
    .then(() => console.log('Connected to the database!'))
    .catch(err => console.error('Database connection error:', err.stack));
}

module.exports = pool;