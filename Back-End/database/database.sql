CREATE DATABASE vendasmart;

USE vendasmart;

CREATE TABLE users(

id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(100) NOT NULL,

email VARCHAR(100) UNIQUE,

password VARCHAR(255) NOT NULL,

role ENUM('admin','employee') DEFAULT 'employee',

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE products(

id INT AUTO_INCREMENT PRIMARY KEY,

name VARCHAR(100) NOT NULL,

price DECIMAL(10,2) NOT NULL,

stock INT DEFAULT 0,

min_stock INT DEFAULT 5,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

CREATE TABLE sales(

id INT AUTO_INCREMENT PRIMARY KEY,

seller_id INT,

customer_phone VARCHAR(20),

total DECIMAL(10,2),

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY (seller_id) REFERENCES users(id)

);

CREATE TABLE sale_items(

id INT AUTO_INCREMENT PRIMARY KEY,

sale_id INT,

product_id INT,

quantity INT,

unit_price DECIMAL(10,2),

subtotal DECIMAL(10,2),

FOREIGN KEY(sale_id) REFERENCES sales(id),

FOREIGN KEY(product_id) REFERENCES products(id)

);

CREATE TABLE stock_movements(

id INT AUTO_INCREMENT PRIMARY KEY,

product_id INT,

user_id INT,

type ENUM('entrada','saida','ajuste'),

quantity INT,

created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

FOREIGN KEY(product_id) REFERENCES products(id),

FOREIGN KEY(user_id) REFERENCES users(id)

);

