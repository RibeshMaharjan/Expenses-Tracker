# Expenses Tracker

**Expense Tracker** project is a personal finance management application designed to help users track their `income`, `expenses`, and `stock portfolio`.

### Features

Users can:

* **Record Transactions**: Log income and expense transactions, categorizing them and specifying the date and description. They can associate these transactions with different bank accounts.

* **Manage Multiple Accounts**: Track multiple bank accounts (checking, savings, etc.) and brokerage accounts. The application will maintain separate balances for each account.

* **View Transactions:** View a history of all transactions, filtered by account, date range, or category. Users can also see a combined view of transactions across all accounts of a certain type (e.g., all bank transactions, all brokerage transactions).

* **Manage Stock Portfolio**: Track their stock portfolio by recording buy and sell transactions. The application will calculate the current quantity of each stock owned and can provide an aggregated view of the entire portfolio.
View Stock Transactions: Review the history of stock purchases and sales for each brokerage account.

* **Get Stock Prices**: Fetch current stock prices from an external API.
User Authentication: Secure user accounts with registration and login functionality.

Essentially, it's a comprehensive tool to get a clear picture of a user's financial situation, including both banking activities and stock market investments.

### Getting Started

This section provides instructions on how to set up and run the Expenses Tracker application both with and without Docker.

#### Prerequisites

- Node.js (v20 or later)
- npm (v10 or later)
- Python (v3.8 or later)
- PostgreSQL (v14 or later)
- Docker and Docker Compose (for Docker installation)

#### Running Without Docker

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd Expenses-Tracker
   ```

2. **Set up the database**
   - Create a PostgreSQL database named `expenses_tracker`
   - Update the database connection details in `server/.env` file

3. **Set up and run the server**
   ```
   cd server
   npm install
   npm run migrate   # Run database migrations
   npm run seeds     # Seed the database with initial data
   npm run dev       # Start the server in development mode
   ```
   The server will run on port 8000 by default.

4. **Set up and run the client**
   ```
   cd client
   npm install
   npm run dev
   ```
   The client will run on port 5173 by default.

5. **Set up and run the microservice (optional)**
   ```
   pip install -r requirements.txt
   python app.py
   ```
   The microservice will run on port 5000 by default.

#### Running With Docker

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd Expenses-Tracker
   ```

2. **Build and run the containers**
   ```
   docker compose -f compose.yaml up -d
   ```
   This will:
   - Start a PostgreSQL database on port 5431
   - Build and start the server on port 8001
   - Build and start the microservice on port 5000

3. **Access the application**
   - Frontend: http://localhost:8001
   - API: http://localhost:8001/api
   - Microservice: http://localhost:5000

#### Environment Variables

- Server environment variables are stored in `server/.env`
- Client environment variables are stored in `client/.env`
- Sample environment files are provided as `.env.sample` in both directories
