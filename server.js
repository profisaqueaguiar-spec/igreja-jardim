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

// ROTA: Cadastrar Membro
app.post('/api/membros', upload.single('foto'), async (req, res) => {
    const { nome, email, telefone, endereco, cargo } = req.body;
    const foto = req.file ? req.file.filename : null;

    if (!nome || !email || !telefone || !cargo) {
        return res.status(400).json({ message: 'Campos obrigatórios faltando.' });
    }

    try {
        const sql = `INSERT INTO membros (nome, email, telefone, endereco, cargo, foto) VALUES ($1, $2, $3, $4, $5, $6)`;
        await db.query(sql, [nome, email, telefone, endereco, cargo, foto]);
        
        res.status(201).json({ message: 'Membro cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao salvar no banco:', error);
        res.status(500).json({ message: 'Erro no servidor ao salvar membro.' });
    }
});

// Rota GET: Listar todos os membros cadastrados
app.get('/api/membros', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM membros ORDER BY id DESC');
        res.status(200).json(result.rows);
    } catch (err) {
        console.error('Erro ao buscar membros no PostgreSQL:', err);
        res.status(500).json({ 
            message: 'Erro ao buscar membros no banco de dados',
            error: err.message 
        });
    }
});

// Rota PUT: Atualizar os dados de um membro pelo ID (com foto opcional)
app.put('/api/membros/:id', upload.single('foto'), async (req, res) => {
    const { id } = req.params;
    const { nome, email, telefone, endereco, cargo } = req.body;
    const foto = req.file ? req.file.filename : null;

    try {
        let sql;
        let values;

        if (foto) {
            sql = `
                UPDATE membros 
                SET nome = $1, email = $2, telefone = $3, endereco = $4, cargo = $5, foto = $6
                WHERE id = $7
            `;
            values = [nome, email, telefone, endereco, cargo, foto, id];
        } else {
            sql = `
                UPDATE membros 
                SET nome = $1, email = $2, telefone = $3, endereco = $4, cargo = $5
                WHERE id = $6
            `;
            values = [nome, email, telefone, endereco, cargo, id];
        }

        const result = await db.query(sql, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Membro não encontrado.' });
        }

        res.status(200).json({ message: 'Membro atualizado com sucesso!' });
    } catch (err) {
        console.error('Erro ao atualizar membro no PostgreSQL:', err);
        res.status(500).json({ 
            message: 'Erro ao atualizar dados no banco de dados',
            error: err.message 
        });
    }
});

// Rota DELETE: Remover um membro pelo ID
app.delete('/api/membros/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const sql = 'DELETE FROM membros WHERE id = $1';
        const result = await db.query(sql, [id]);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'Membro não encontrado.' });
        }

        res.status(200).json({ message: 'Membro excluído com sucesso!' });
    } catch (err) {
        console.error('Erro ao excluir membro no PostgreSQL:', err);
        res.status(500).json({ 
            message: 'Erro ao excluir dados no banco de dados',
            error: err.message 
        });
    }
});

// Inicialização do Servidor
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});