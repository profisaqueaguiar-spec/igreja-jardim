const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false
    },
    family: 4 // Força o uso de IPv4 para evitar o bloqueio no Render
});

module.exports = pool;

