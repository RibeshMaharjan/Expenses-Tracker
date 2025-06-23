// setupDatabase.js
import * as db from "../config/db.js";

const dbinit = async () => {
  await db.query('BEGIN');

  try {
    console.log('Starting safe DB setup...');
    await db.query(`DROP TABLE IF EXISTS stock_transactions CASCADE`);
    await db.query(`DROP TABLE IF EXISTS stocks CASCADE`);
    await db.query(`DROP TABLE IF EXISTS transactions CASCADE`);
    await db.query(`DROP TABLE IF EXISTS brokerage_accounts CASCADE`);
    await db.query(`DROP TABLE IF EXISTS bank_accounts CASCADE`);
    await db.query(`DROP TABLE IF EXISTS transaction_categories CASCADE`);
    await db.query(`DROP TABLE IF EXISTS users CASCADE`);
    await db.query(`DROP TYPE IF EXISTS user_type CASCADE`);
    
    // 1. Safely create ENUM
    const res = await db.query(`
      SELECT 1 FROM pg_type WHERE typname = 'user_type';
    `);
    if (res.rowCount === 0) {
      await db.query(`CREATE TYPE user_type AS ENUM ('admin', 'user');`);
    }

    // 2. Create tables safely
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(60) UNIQUE NOT NULL,
        user_type user_type NOT NULL DEFAULT 'user',
        created_at TIMESTAMP NOT NULL,
        updated_at TIMESTAMP,
        refresh_token TEXT[]
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS transaction_categories (
        id SERIAL PRIMARY KEY,
        name VARCHAR(30) NOT NULL,
        user_id INTEGER REFERENCES users(id) NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS bank_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        account_no VARCHAR(30) NOT NULL,
        account_holder_name VARCHAR(30) NOT NULL,
        bank_name VARCHAR(50) NOT NULL,
        balance DECIMAL(10, 2) NOT NULL DEFAULT 0.00
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS brokerage_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        brokerage_no VARCHAR(5) NOT NULL,
        brokerage_account_no VARCHAR(30) NOT NULL,
        brokerage_account_holder_name VARCHAR(30) NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS transactions (
        id SERIAL PRIMARY KEY,
        user_id INT REFERENCES users(id) NOT NULL,
        bank_account_id INTEGER REFERENCES bank_accounts(id) NOT NULL,
        transaction_amount DECIMAL(10, 2) NOT NULL,
        transaction_type VARCHAR(20) NOT NULL CHECK (transaction_type IN ('income', 'expense')),
        category_id INTEGER REFERENCES transaction_categories(id),
        transaction_date DATE NOT NULL,
        description TEXT,
        transaction_time TIME
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS stocks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        symbol VARCHAR(10) NOT NULL,
        stock_name VARCHAR(50) NOT NULL,
        quantity INT NOT NULL
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS stock_transactions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) NOT NULL,
        bank_account_id INTEGER REFERENCES bank_accounts(id),
        brokerage_account_id INTEGER REFERENCES brokerage_accounts(id) NOT NULL,
        stock_id INTEGER REFERENCES stocks(id) NOT NULL,
        transaction_type VARCHAR(10) NOT NULL CHECK (transaction_type IN ('buy', 'sell')),
        quantity INTEGER NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        total_amount DECIMAL(10, 2) NOT NULL,
        transaction_date DATE NOT NULL,
        transaction_time TIME
      );
    `);

    await db.query('COMMIT');
    console.log('Database setup completed successfully.');
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Setup failed, rolled back changes.', error);
  }
};

dbinit();
