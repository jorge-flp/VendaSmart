const db = require('../config/database');

// CRIAR VENDA
exports.createSale = async (req, res) => {
    try {

        const {
            sellerId,
            customerPhone,
            items
        } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({
                message: 'A venda deve possuir pelo menos um item.'
            });
        }

        let total = 0;

        for (const item of items) {

            const [product] = await db.query(
                'SELECT sell_price FROM products WHERE id = ?',
                [item.productId]
            );

            if (product.length === 0) {
                return res.status(404).json({
                    message: `Produto ${item.productId} não encontrado.`
                });
            }

            total += Number(product[0].sell_price) * item.quantity;
        }

        const [result] = await db.query(
            `
            INSERT INTO sales
            (
                seller_id,
                customer_phone,
                total
            )
            VALUES (?, ?, ?)
            `,
            [
                sellerId,
                customerPhone,
                total
            ]
        );

        const [sale] = await db.query(
            'SELECT * FROM sales WHERE id = ?',
            [result.insertId]
        );

        res.status(201).json(sale[0]);

    } catch (error) {

        console.error(error);

        res.status(500).json({
            message: 'Erro ao registrar venda.'
        });

    }
};

exports.getSales = async (req, res) => {
    res.json([]);
};

exports.getSaleById = async (req, res) => {
    res.json({});
};