const express = require('express');
const db = require('./config/database');

const app = express();

app.use(express.json());

app.get('/', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 AS status');
        res.json({
            message: 'Backend funcionando!',
            database: rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: 'Erro ao conectar ao banco.'
        });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});