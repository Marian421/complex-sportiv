const Pool = require('pg').Pool;

const pool = new Pool({
    user: "marian",
    password: "Stunter!12",
    host: 'localhost',
    port: 5432,
    database: "sports_booking"
})

module.exports = pool;