const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');
const db = require('./db');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos (HTML, CSS, imagens e uploads)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do Upload de Fotos de Membros
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// ROTA: Cadastrar Membro (Substitui o gravar.jsp)
app.post('/api/membros', upload.single('foto'), async (req, res) => {
    const { nome, email, telefone, endereco, cargo } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nome || !email || !telefone || !cargo) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
        const sql = `INSERT INTO membros (nome, email, telefone, endereco, cargo, foto) VALUES (?, ?, ?, ?, ?, ?)`;
        await db.execute(sql, [nome, email, telefone, endereco, cargo, foto]);
        
        // Retorna sucesso em JSON
        res.status(201).json({ message: 'Membro cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar no banco:', error);
        res.status(500).json({ message: 'Erro no servidor ao salvar membro.' });
    }
});

// Rota GET: Listar todos os membros cadastrados
app.get('/api/membros', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM membros ORDER BY id DESC');
        res.status(200).json(results);
    } catch (err) {
        console.error('Erro ao buscar membros no MySQL:', err);
        res.status(500).json({ 
            message: 'Erro ao buscar membros no banco de dados',
            error: err.message 
        });
    }
});

// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});