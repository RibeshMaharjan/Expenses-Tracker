-- CUSTOM TYPES
CREATE TYPE user_type as enum
('admin', 'user');

-- CREATE users TABLE
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) NOT NULL,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
	email VARCHAR(60) NOT NULL,
	user_type user_type NOT NULL DEFAULT 'user',
	created_at TIMESTAMP NOT NULL,
	updated_at TIMESTAMP
);

TRUNCATE TABLE users RESTART IDENTITY CASCADE;

INSERT INTO users(name, username, password, email, user_type, created_at)
VALUES
	('John Doe', 'johndoe', 'johndoe', 'johndoe@gmail.com', 'user', CURRENT_TIMESTAMP),
	('Dave Smith', 'davesmith', 'davesmith', 'davesmith@gmail.com', 'user', CURRENT_TIMESTAMP),
	('Andre White', 'andrewhite', 'andrewhite', 'andrewhite@gmail.com', 'user', CURRENT_TIMESTAMP);

SELECT * FROM users;
SELECT * FROM brokerage_accounts;

ALTER TABLE brokerage_accounts 
DISABLE CONSTRAINT "brokerage_accounts_user_id_fkey";

UPDATE brokerage_accounts SET 
	user_id = 3,
	WHERE name = 'Andre White';

SELECT * FROM users WHERE email = 'johndoe@gmal.com';

SELECT EXISTS (SELECT * FROM users WHERE email = 'johndoe@gmail.com');

DROP TABLE users CASCADE;
-- users TABLE END

-- CREATE categories TABLE
CREATE TABLE transaction_categories (
	id SERIAL PRIMARY KEY,
	name VARCHAR(30) NOT NULL,
	user_id INTEGER REFERENCES users(id) NOT NULL
);

ALTER TABLE expenses_categories RENAME TO transaction_categories;

SELECT * FROM transaction_categories;
-- categories TABLE END

-- CREATE bank_accounts TABLE
CREATE TABLE bank_accounts (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) NOT NULL,
	account_no VARCHAR(30) NOT NULL,
	account_holder_name VARCHAR(30) NOT NULL,
	bank_name VARCHAR(50) NOT NULL,
	balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
);

ALTER TABLE bank_accounts ADD COLUMN updated_at TIMESTAMP;

TRUNCATE TABLE bank_accounts RESTART IDENTITY;

SELECT * FROM bank_accounts;

-- bank_accounts TABLE END

-- CREATE bank_accounts TABLE
CREATE TABLE brokerage_accounts (
	id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) NOT NULL,
	brokerage_no VARCHAR(5) NOT NULL,
	brokerage_account_no VARCHAR(30) NOT NULL,
	brokerage_account_holder_name VARCHAR(30) NOT NULL
);

SELECT * FROM brokerage_accounts;

-- accounts TABLE END

-- CREATE transactions TABLE
CREATE TABLE transactions (
    id SERIAL PRIMARY KEY,
	user_id INT REFERENCES users(id) NOT NULL
    bank_account_id INTEGER REFERENCES bank_accounts(id) NOT NULL,
    transaction_amount DECIMAL(10, 2) NOT NULL,
    transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
    category_id INTEGER REFERENCES transaction_categories(id),
    transaction_date DATE NOT NULL,
    description TEXT,
);

SELECT * FROM transactions;

-- transactions TABLE END

-- CREATE stocks TABLE
CREATE TABLE stocks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) NOT NULL,
    symbol VARCHAR(10) NOT NULL,
	stock_name VARCHAR(50) NOT NULL,
	quantity INT NOT NULL
);

INSERT INTO stocks (user_id, symbol, stock_name, quantity) VALUES
('AAPL', 'Apple Inc. test', 30) RETURNING id;


SELECT * FROM stocks;

-- stocks TABLE END

-- CREATE stock_transactions TABLE
CREATE TABLE stock_transactions (
    id SERIAL PRIMARY KEY,
	user_id INTEGER REFERENCES users(id) NOT NULL,
    brokerage_account_id INTEGER REFERENCES brokerage_accounts(id) NOT NULL,
    stock_id INTEGER REFERENCES stocks(id) NOT NULL,
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    transaction_date DATE NOT NULL,
    transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
	bank_account_id INTEGER REFERENCES bank_accounts(id)
);

SELECT * FROM stock_transactions;

-- stock_transactions TABLE END 