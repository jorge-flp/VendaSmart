const express = require('express');
const cors = require('cors');

const productRoutes = require('./routes/RotaProdutos');
const saleRoutes = require('./routes/saleRoutes');

const app = express();

app.use(cors());
app.use(express.json());


// Rotas
app.use('/products', productRoutes);
app.use('/sales', saleRoutes);


// Rota inicial
app.get('/', (req,res)=>{
    res.json({
        message:"API VendaSmart funcionando"
    });
});


module.exports = app;