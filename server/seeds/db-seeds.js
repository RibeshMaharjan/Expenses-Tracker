import * as db from "../config/db.js";
import {
  hashPassword,
} from "../utils/index.js";

const runSeed = async () => {
  try {
    await db.query('BEGIN');
    console.log("Seeding database...");

    // Hash passwords
    const asuraPass = await hashPassword('Asura#123');
    const ramPass = await hashPassword('Ram#123');

    await db.query(`TRUNCATE stock_transactions, stocks, transactions, brokerage_accounts, bank_accounts, transaction_categories, users RESTART IDENTITY CASCADE`);
    // Seed users
    const user1 = await db.query(`
      INSERT INTO users (name, username, password, email, user_type, created_at)
      VALUES ($1, $2, $3, $4, 'user', CURRENT_TIMESTAMP)
      RETURNING *;
    `, ['Asura Maharjan', 'asura_007', asuraPass, 'asura@example.com']);

    const user2 = await db.query(`
      INSERT INTO users (name, username, password, email, user_type, created_at)
      VALUES ($1, $2, $3, $4, 'user', CURRENT_TIMESTAMP)
      RETURNING *;
    `, ['Ram Shrestha', 'user02', ramPass, 'ram@example.com']);

    const user1Id = user1.rows[0].id;
    const user2Id = user2.rows[0].id;

    // Seed bank accounts
    await db.query(`
      INSERT INTO bank_accounts (user_id, account_no, account_holder_name, bank_name, balance)
      VALUES
        ($1, '1234567890', 'Asura Maharjan', 'Nepal Bank', 50000),
        ($2, '1434567890', 'Asura Maharjan', 'Nabil Bank', 15000),
        ($3, '0987654321', 'Ram Shrestha', 'Siddhartha Bank', 20000);
    `, [user1Id, user1Id, user2Id]);

    // Seed transaction categories
    await db.query(`
      INSERT INTO transaction_categories (name, user_id)
      VALUES
        ('Groceries', $1),
        ('Transport', $1),
        ('Salary', $2),
        ('Investments', $2);
    `, [user1Id, user2Id]);

    // Seed stocks
    await db.query(`
      INSERT INTO stocks (user_id, symbol, stock_name, quantity)
      VALUES
        ($1, 'NABIL', 'Nabil Bank', 100),
        ($2, 'NLIC', 'Nepal Life Insurance', 50);
    `, [user1Id, user2Id]);

    // Seed brokerage accounts
    await db.query(`
      INSERT INTO brokerage_accounts (user_id, brokerage_no, brokerage_account_no, brokerage_account_holder_name)
      VALUES
        ($1, '01', 'BRK001A', 'Asura'),
        ($2, '02', 'BRK002B', 'Ram');
    `, [user1Id, user2Id]);

    // Optionally, seed some transactions
    await db.query(`
      INSERT INTO transactions (
        user_id, bank_account_id, transaction_amount, transaction_type, category_id, transaction_date, description, transaction_time
      )
      VALUES
        ($1, 1, 5000, 'expense', 1, '2025-06-15', 'Grocery shopping', '10:30:00'),
        ($2, 3, 25000, 'income', 3,'2025-06-10', 'Salary credit', '09:00:00');
    `, [user1Id, user2Id]);

    // Seed stock transactions
    await db.query(`
      INSERT INTO stock_transactions (
        user_id, bank_account_id, brokerage_account_id, stock_id, transaction_type, quantity, price, total_amount, transaction_date, transaction_time
      )
      VALUES
        ($1, 1, 1, 1, 'buy', 10, 500, 5000, '2025-06-01', '11:00:00'),
        ($2, 3, 2, 2, 'buy', 5, 800, 4000,'2025-06-02', '15:00:00');
    `, [user1Id, user2Id]);

    await db.query('COMMIT');
    console.log("Seeding completed.");
    process.exit(0);
  } catch (err) {
    await db.query('ROLLBACK');
    console.error("Seeding failed:", err);
    process.exit(1);
  }
};

runSeed();
