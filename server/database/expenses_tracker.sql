CREATE TYPE user_type as enum ('admin', 'user');

CREATE TABLE users (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL,
username VARCHAR(255) UNIQUE NOT NULL,
password VARCHAR(255) NOT NULL,
email VARCHAR(60) NOT NULL,
user_type user_type NOT NULL DEFAULT 'user',
created_at TIMESTAMP NOT NULL,
updated_at TIMESTAMP,
refresh_token text ARRAY
);

CREATE TABLE transaction_categories (
id SERIAL PRIMARY KEY,
name VARCHAR(30) NOT NULL,
user_id INTEGER REFERENCES users(id) NOT NULL
);

CREATE TABLE bank_accounts (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) NOT NULL,
account_no VARCHAR(30) NOT NULL,
account_holder_name VARCHAR(30) NOT NULL,
bank_name VARCHAR(50) NOT NULL,
balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

CREATE TABLE brokerage_accounts (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) NOT NULL,
brokerage_no VARCHAR(5) NOT NULL,
brokerage_account_no VARCHAR(30) NOT NULL,
brokerage_account_holder_name VARCHAR(30) NOT NULL
);

CREATE TABLE transactions (
id SERIAL PRIMARY KEY,
user_id INT REFERENCES users(id) NOT NULL,
bank_account_id INTEGER REFERENCES bank_accounts(id) NOT NULL,
transaction_amount DECIMAL(10, 2) NOT NULL,
transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
category_id INTEGER REFERENCES transaction_categories(id),
transaction_date DATE NOT NULL,
description TEXT
);

CREATE TABLE stocks (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) NOT NULL,
symbol VARCHAR(10) NOT NULL,
stock_name VARCHAR(50) NOT NULL,
quantity INT NOT NULL
);

CREATE TABLE stock_transactions (
id SERIAL PRIMARY KEY,
user_id INTEGER REFERENCES users(id) NOT NULL,
bank_account_id INTEGER REFERENCES bank_accounts(id),
brokerage_account_id INTEGER REFERENCES brokerage_accounts(id) NOT NULL,
stock_id INTEGER REFERENCES stocks(id) NOT NULL,
transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
quantity INTEGER NOT NULL,
price DECIMAL(10, 2) NOT NULL,
transaction_date DATE NOT NULL
);

-- Select Query
SELECT * FROM users;
SELECT * FROM transaction_categories;
SELECT * FROM bank_accounts;
SELECT * FROM brokerage_accounts;
SELECT * FROM transactions;
SELECT * FROM stocks;
SELECT * FROM stock_transactions;

-- Insert Query

-- Sample Data for users table
INSERT INTO users(name, username, password, email, user_type, created_at) VALUES
('John Doe', 'johndoe', 'johndoe', 'johndoe@gmail.com', 'user', CURRENT_TIMESTAMP),
('Dave Smith', 'davesmith', 'davesmith', 'davesmith@gmail.com', 'user', CURRENT_TIMESTAMP),
('Andre White', 'andrewhite', 'andrewhite', 'andrewhite@gmail.com', 'user', CURRENT_TIMESTAMP);

-- Sample Data for expenses_categories
INSERT INTO transaction_categories (name, user_id, color) VALUES
('Initial Deposit', 0, 'orange'),
('Groceries', 4, 'lime'),
('Utilities', 1, 'blue'),
('Entertainment', 4, 'red'),
('Transportation', 4, 'yellow'),
('Salary', 4, 'green');

ALTER TABLE transaction_categories
ADD CONSTRAINT transaction_categories_user_id_fkey
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE transactions
ADD CONSTRAINT transactions_category_id_fkey
FOREIGN KEY (category_id) REFERENCES transaction_categories(id);

-- Sample Data for bank_accounts table
INSERT INTO bank_accounts (user_id, account_no, account_holder_name, bank_name, balance) VALUES
(1, '1234567890', 'Alice Johnson', 'First National Bank', 5000.00),  -- Alice (user_id 1)
(4, '9876543210', 'Asura Maharjan', 'Nabil Bank', 25000.50),        -- Bob (user_id 2)
(1, '1122334455', 'Alice Johnson', 'Global Finance', 7500.25),  -- Alice (user_id 1) - multiple accounts possible
(4, '5566778899', 'Asura Maharjan', 'Siddhartha Bank', 12000.75);           -- Eva (user_id 3)

-- Sample Data for brokerage_accounts table
INSERT INTO brokerage_accounts (user_id, brokerage_no, brokerage_account_no, brokerage_account_holder_name) VALUES
(1, '20', 'A1B2C3D4', 'Alice Johnson'),  -- Alice (user_id 1)
(4, '41', 'E5F6G7H8', 'Asura Maharjan'),       -- Bob (user_id 2)
(4, '47', 'I9J0K1L2', 'Asura Maharjan');   -- Eva (user_id 3)

-- Sample Data for transactions table
INSERT INTO transactions (user_id, bank_account_id, transaction_amount, transaction_type, category_id, transaction_date, description) VALUES
(4, 2, 1000.00, 'expense', 1, '2024-07-26', 'Brought Veggies'),
(4, 4, 500.00, 'income', 5, '2024-07-27', ''),
(4, 2, 500.00, 'expense', 4, '2024-07-28', 'Spend on Indrive'),
(1, 3, 2000.00,'expense', 2, '2024-07-29', '');

-- Sample Data for stocks table
INSERT INTO stocks (user_id, symbol, stock_name, quantity) VALUES
(4, 'NABIL', 'Nabil Bank Limited', 15),
(4, 'NBL', 'NBL', 25),
(4, 'ADBL', 'Agricultural Development Bank Limited', 70),
(2, 'CGH', 'Chandragiri Hills Limited', 30),
(1, 'GBBL', 'Garima Bikas Bank Limited', 15);

-- Sample Data for stock_transactions table
INSERT INTO stock_transactions (user_id, bank_account_id, brokerage_account_id, stock_id, transaction_type, quantity, price, transaction_date) VALUES
(4, 4, 3, 2, 'buy', 10, 2500, '2024-07-26'),
(4, 4, 3, 2, 'sell', 20, 300,'2024-07-27'),
(1, 1, 1, 4, 'buy', 10, 3000, '2024-07-28'),
(4, 2, 2, 6, 'buy', 10, 500, '2024-07-29');
