CREATE DATABASE IF NOT EXISTS vendasmart;
USE vendasmart;

-- ==========================
-- Usuários
-- ==========================
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin','employee') DEFAULT 'employee',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- Estoque (antigo products)
-- ==========================
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,
    description TEXT,

    category VARCHAR(80),

    barcode VARCHAR(50),

    supplier VARCHAR(120),

    photo VARCHAR(255),

    cost_price DECIMAL(10,2) NOT NULL,

    sell_price DECIMAL(10,2) NOT NULL,

    stock INT DEFAULT 0,

    min_stock INT DEFAULT 5,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ON UPDATE CURRENT_TIMESTAMP
);

-- ==========================
-- Vendas
-- ==========================
CREATE TABLE sales (
    id INT AUTO_INCREMENT PRIMARY KEY,

    seller_id INT,

    customer_phone VARCHAR(20),

    total DECIMAL(10,2) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (seller_id)
        REFERENCES users(id)
);

-- ==========================
-- Itens da venda
-- ==========================
CREATE TABLE sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,

    sale_id INT NOT NULL,

    product_id INT NOT NULL,

    quantity INT NOT NULL,

    unit_cost DECIMAL(10,2),

    unit_price DECIMAL(10,2),

    subtotal DECIMAL(10,2),

    FOREIGN KEY (sale_id)
        REFERENCES sales(id)
        ON DELETE CASCADE,

    FOREIGN KEY (product_id)
        REFERENCES products(id)
);

-- ==========================
-- Controle de Fiados
-- ==========================
CREATE TABLE fiados (
    id INT AUTO_INCREMENT PRIMARY KEY,

    customer_name VARCHAR(120) NOT NULL,

    customer_phone VARCHAR(20),

    total DECIMAL(10,2) NOT NULL,

    paid DECIMAL(10,2) DEFAULT 0,

    balance DECIMAL(10,2) NOT NULL,

    due_date DATE,

    status ENUM('aberto','pago','atrasado')
    DEFAULT 'aberto',

    observations TEXT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================
-- Histórico dos pagamentos
-- ==========================
CREATE TABLE fiado_payments (
    id INT AUTO_INCREMENT PRIMARY KEY,

    fiado_id INT NOT NULL,

    amount DECIMAL(10,2) NOT NULL,

    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (fiado_id)
        REFERENCES fiados(id)
        ON DELETE CASCADE
);

-- ==========================
-- Movimentação de estoque
-- ==========================
CREATE TABLE stock_movements (
    id INT AUTO_INCREMENT PRIMARY KEY,

    product_id INT NOT NULL,

    user_id INT,

    type ENUM('entrada','saida','ajuste') NOT NULL,

    quantity INT NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (product_id)
        REFERENCES products(id),

    FOREIGN KEY (user_id)
        REFERENCES users(id)
);