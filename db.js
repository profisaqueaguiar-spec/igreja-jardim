const mysql = require('mysql2/promise');

// Criação da piscina de conexões (Pool)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '', // Insira a senha do seu MySQL se houver
    database: 'igrejajardim',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = db;