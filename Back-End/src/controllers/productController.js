const db = require('../config/database');

exports.getProducts = async (req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products ORDER BY id DESC'
        );

        res.status(200).json(products);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erro ao buscar produtos.'
        });
    }
};