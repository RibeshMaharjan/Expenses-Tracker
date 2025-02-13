import * as db from "../config/db.js";

export const getAllBankAccount = async (req, res) => {
  try {
    const { id } = req.user;

    const allBankAccount = await db.query(
      `SELECT * FROM bank_accounts WHERE user_id = $1;`,
      [id]
    )
  
    if(allBankAccount.rows.length === 0) {
      return res.status(200).json({
        status: "No Accounts",
        message: "No bank accounts found for this user",
        bankAccounts: [], // Return empty array as no data was found
      })
    }
    
    return res.status(200).json({
      status: "Success",
      message: "Bank accounts retrieved successfully",
      bankAccounts: allBankAccount.rows, // Return array of bank accounts
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "There was a problem retrieving your bank accounts",
    })
    
  }
}

export const getBankAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const bankAccountId = req.params.id;

    const bankAccount = await db.query(
      `SELECT * FROM bank_accounts WHERE id = $1;`,
      [bankAccountId]
    );

    if(bankAccount.rows.length === 0) {
      return res.status(200).json({
        status: "No Account",
        message: "No bank account found",
        bankAccount: bankAccount.rows[0],
      })
    }

    return res.status(200).json({
      status: "Success",
      message: "Bank account retrieved successfully",
      bankAccount: bankAccount.rows[0],
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "There was a problem retrieving your bank account",
    })
  }
}

export const createBankAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { account_no, account_holder_name, bank_name, balance } = req.body;

    if(!account_no || !account_holder_name || !bank_name || !balance) {
      return res.status(400).json({
        status: "Bad Request",
        message: "Missing required fields: account_no, account_holder_name, bank_name, balance",
      })
    }

    const bankAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM bank_accounts WHERE user_id = $1 AND account_no = $2);`,
      [id, account_no]
    );

    if(!bankAccountExist.rows[0].exists) {
      return res.status(404).json({
        status: "Not Fount",
        message: "Bank account not found.",
      })
    }

    const result = await db.query(
      `UPDATE bank_accounts SET 
        account_no = $1,
        account_holder_name = $2,
        bank_name = $3,
        balance = $4,
      VALUES ($1, $2, $3, $4, $5) RETURNING *;`,
      [id, account_no, account_holder_name, bank_name, balance]
    );
    
    const bank_account_id = result.rows[0].id;
    const description = `${account_holder_name} (Initial Deposit)`;

    const transactionResult = await db.query(
      `INSERT INTO transactions (bank_account_id, transaction_amount, transaction_type, transaction_date, category_id, description, user_id) 
      VALUES ($1, $2, $3, CURRENT_DATE, 1, $4, $5) RETURNING *;`,
      [bank_account_id, balance, 'income', description, id]
    )

    if(transactionResult.rows.length === 0) {
      return res.status(500).json({
        status: "Internal Server Error",
        message: "Failed to create initial deposit transaction",
      })
    }

    return res.status(201).json({
      status: "Success",
      message: "Bank account created successfully.",
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred while creating the bank account.",
    })
  }
}

export const deleteBankAccount = async (req, res) => {
  try {
    // const { id } = req.user;
    const bank_account_id = req.params.id;      
    const id = 6;

    const bankAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM bank_accounts WHERE user_id = $1 AND id = $2);`,
      [id, bank_account_id]
    );

    if(!bankAccountExist.rows[0].exists) {
      return res.status(404).json({
        status: "Not Fount",
        message: "Bank account not found.",
      })
    }

    await db.query(
      `DELETE FROM transactions
        WHERE bank_account_id = $1;`,
      [bank_account_id]
    )

    const deleteAccountResult = await db.query(
      `DELETE FROM bank_accounts
        WHERE id = $1;`,
      [bank_account_id]
    );

    if(deleteAccountResult.rowCount === 0) {
      return res.status(500).json({
        status: "Internal Server Error",
        message: "An error occurred while deleting the bank account.",
      })
    }

    return res.sendStatus(204);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "Internal Server Error",
      message: "An error occurred while deleting the bank account.",
    })
  }
}

