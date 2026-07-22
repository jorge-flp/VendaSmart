const db = require('../config/database');


// LISTAR PRODUTOS
exports.getProducts = async (req, res) => {
    try {
        const [products] = await db.query(
            'SELECT * FROM products ORDER BY id DESC'
        );

        res.json(products);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Erro ao buscar produtos.'
        });
    }
};


// CRIAR PRODUTO
exports.createProduct = async (req, res) => {
    try {
        const { name, price, stock, minStock } = req.body;

        const [result] = await db.query(
        `INSERT INTO products 
        (name, price, stock, min_stock)
        VALUES (?, ?, ?, ?)`,
        [name, price, stock, minStock]
);


        const [newProduct] = await db.query(
            'SELECT * FROM products WHERE id = ?',
            [result.insertId]
        );


        res.status(201).json(newProduct[0]);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: 'Erro ao criar produto.'
        });
    }
};


// ATUALIZAR PRODUTO
exports.updateProduct = async (req, res) => {
    try {

        const { id } = req.params;
        const { name, price, stock, minStock } = req.body;


        await db.query(
            `UPDATE products 
             SET name=?, price=?, stock=?, minStock=?
             WHERE id=?`,
            [name, price, stock, minStock, id]
        );


        const [updated] = await db.query(
            'SELECT * FROM products WHERE id=?',
            [id]
        );


        res.json(updated[0]);

    } catch(error){

        console.error(error);

        res.status(500).json({
            message:'Erro ao atualizar produto.'
        });
    }
};


// DELETAR PRODUTO
exports.deleteProduct = async (req,res)=>{
    try{

        const { id } = req.params;


        await db.query(
            'DELETE FROM products WHERE id=?',
            [id]
        );


        res.json({
            message:'Produto removido.'
        });


    }catch(error){

        console.error(error);

        res.status(500).json({
            message:'Erro ao remover produto.'
        });

    }
};