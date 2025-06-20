'use strict';
/** @type {import('sequelize-cli').Migration} */
export default {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      CREATE TYPE user_type AS ENUM ('admin', 'user');
    `);
    
    await queryInterface.createTable('users', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(30), allowNull: false },
      username: { type: Sequelize.STRING(255), unique: true, allowNull: false },
      password: { type: Sequelize.STRING(255), allowNull: false },
      email: { type: Sequelize.STRING(60), allowNull: false },
      user_type: {
        type: Sequelize.ENUM('admin', 'user'),
        allowNull: false,
        defaultValue: 'user'
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE },
      refresh_token: {
        type: Sequelize.ARRAY(Sequelize.TEXT),
        allowNull: true
      }
    });
    
    await queryInterface.createTable('transaction_categories', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: { type: Sequelize.STRING(30), allowNull: false },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      }
    });
    
    await queryInterface.createTable('bank_accounts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      account_no: { type: Sequelize.STRING(30), allowNull: false },
      account_holder_name: { type: Sequelize.STRING(30), allowNull: false },
      bank_name: { type: Sequelize.STRING(50), allowNull: false },
      balance: { type: Sequelize.DECIMAL(10, 2), allowNull: false, defaultValue: 0.00 }
    });
    
    await queryInterface.createTable('brokerage_accounts', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      brokerage_no: { type: Sequelize.STRING(5), allowNull: false },
      brokerage_account_no: { type: Sequelize.STRING(30), allowNull: false },
      brokerage_account_holder_name: { type: Sequelize.STRING(30), allowNull: false }
    });
    
    await queryInterface.createTable('transactions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      bank_account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'bank_accounts', key: 'id' },
        onDelete: 'CASCADE'
      },
      transaction_amount: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      transaction_type: {
        type: Sequelize.ENUM('income', 'expense'),
        allowNull: false
      },
      category_id: {
        type: Sequelize.INTEGER,
        references: { model: 'transaction_categories', key: 'id' },
        onDelete: 'SET NULL'
      },
      transaction_date: { type: Sequelize.DATEONLY, allowNull: false },
      description: { type: Sequelize.TEXT },
      transaction_time: { type: Sequelize.DATE }
    });
    
    await queryInterface.createTable('stocks', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      symbol: { type: Sequelize.STRING(10), allowNull: false },
      stock_name: { type: Sequelize.STRING(50), allowNull: false },
      quantity: { type: Sequelize.INTEGER, allowNull: false }
    });
    
    await queryInterface.createTable('stock_transactions', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE'
      },
      bank_account_id: {
        type: Sequelize.INTEGER,
        references: { model: 'bank_accounts', key: 'id' },
        onDelete: 'SET NULL'
      },
      brokerage_account_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'brokerage_accounts', key: 'id' },
        onDelete: 'CASCADE'
      },
      stock_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'stocks', key: 'id' },
        onDelete: 'CASCADE'
      },
      transaction_type: {
        type: Sequelize.ENUM('buy', 'sell'),
        allowNull: false
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      transaction_date: { type: Sequelize.DATE, allowNull: false },
      transaction_time: { type: Sequelize.DATE }
    });
  },
  
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('stock_transactions');
    await queryInterface.dropTable('stocks');
    await queryInterface.dropTable('transactions');
    await queryInterface.dropTable('brokerage_accounts');
    await queryInterface.dropTable('bank_accounts');
    await queryInterface.dropTable('transaction_categories');
    await queryInterface.dropTable('users');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS user_type CASCADE');
  }
};