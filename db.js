const { Pool } = require('pg');
require('dotenv').config(); // Caso utilize variáveis de ambiente (.env)

// Criação da pool de conexões utilizando a Connection String do Supabase
const db = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Necessário para conexões externas com o Supabase
    },
    family: 4 //Força o uso de IPv4 para evitar o erro ENETUNREACH no Render
});

module.exports = db;