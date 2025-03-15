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
        data: [], // Return empty array as no data was found
      })
    }

    return res.status(200).json({
      data: allBankAccount.rows, // Return array of bank accounts
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
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
        data: [], // Return empty array as no data was found
      })
    }

    return res.status(200).json({
      message: "Bank account retrieved successfully",
      data: bankAccount.rows[0],
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your bank account",
    })
  }
}

export const createBankAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { account_no, account_holder_name, bank_name, balance } = req.body;

    if(!account_no || !account_holder_name || !bank_name || !balance) {
      return res.status(422).json({
        message: "Missing required fields!",
      })
    }

    const bankAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM bank_accounts WHERE user_id = $1 AND account_no = $2);`,
      [id, account_no]
    );

    if(bankAccountExist.rows[0].exists) {
      return res.status(422).json({
        message: "Bank account already exists.",
      })
    }

    const result = await db.query(
      `INSERT INTO bank_accounts (user_id, account_no, account_holder_name, bank_name, balance) 
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
        message: "Failed to create initial deposit transaction",
      })
    }

    return res.status(201).json({
      message: "Bank account created successfully.",
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while creating the bank account.",
    })
  }
}

export const addMoneyToBank = async (req, res) => {
  try {
    const {
      bank_account_id,
      depost_amount
    } = req.body;

    if(!bank_account_id || !depost_amount) {
      return res.status(422).json({
        message: "Missing required fields!",
      })
    }

    if(isNaN(transaction_amount)) {
      return res.status(422).json({
        message: "Invalid Amount.",
      });
    }

    if(transaction_amount <= 0) {
      return res.status(422).json({
        message: "Amount cannot be 0."
      })
    }
    
    await db.query(
      `UPDATE bank_accounts SET 
        balance = balance + $1
        WHERE id = $2`,
      [depost_amount, bank_account_id]
    );

    return res.status(200).json({
      message: "Amount deposted successfully.",
    })
  } catch (error) {
    return res.status(500).json({
      message: "There was a problem depositing amount in your bank account."
    })
  }
}

export const transferMoneyToAccount = async (req, res) => {
  try {
    const {
      receiver_bank_account_id,
      sender_bank_account_id,
      receiver_id,
      sender_id,
      receiver_name,
      transfer_amount
    } = req.body;

    if(
      !receiver_bank_account_id || 
      !sender_bank_account_id || 
      !receiver_id || 
      !sender_id ||
      !receiver_name ||
      !transfer_amount
    ) {
      return res.status(422).json({
        message: "Missing required fields!",
      })
    }

    const receiverBankAccountExist = await db.query(
      `SELECT * FROM bank_accounts WHERE id = $1;`,
      [receiver_bank_account_id]
    );

    const senderBankAccountExist = await db.query(
      `SELECT * FROM bank_accounts WHERE id = $1;`,
      [receiver_bank_account_id]
    );

    if(receiverBankAccountExist.rows.length === 0) {
      return res.sendStatus(204);
    }

    const receiver = receiverBankAccountExist.rows[0];
    const sender = senderBankAccountExist.rows[0];

    if(receiver.account_holder_name !== receiver_name) {
      return res.status(422).json({
        message: "Incorrect Account holder name.",
      })
    }

    if(sender.balance < transfer_amount) {
      return res.status(400).json({
        message: "Transaction Failed. Insufficient account balance.",
      })
    }

    await db.query("BEGIN");

    try {
      await db.query(
        `UPDATE bank_accounts SET 
          balance = balance + $1
          WHERE id = $2`,
        [transfer_amount, receiver_bank_account_id]
      );

      await db.query(
        `UPDATE bank_accounts SET 
          balance = balance - $1
          WHERE id = $2`,
        [transfer_amount, sender_bank_account_id]
      );

      const sender_description = `Transfer money to ${receiver_name}`;
      const receiver_description = `Received money from ${req.user.name} (Transfer Money)`;

      await db.query(
        `INSERT INTO transactions (bank_account_id, transaction_amount, transaction_type, transaction_date, category_id, description, user_id) 
        VALUES ($1, $2, $3, CURRENT_DATE, 1, $4, $5) RETURNING *;`,
        [receiver_bank_account_id, transfer_amount, 'income', sender_description, receiver_id]
      );

      await db.query(
        `INSERT INTO transactions (bank_account_id, transaction_amount, transaction_type, transaction_date, category_id, description, user_id) 
        VALUES ($1, $2, $3, CURRENT_DATE, 1, $4, $5) RETURNING *;`,
        [sender_bank_account_id, transfer_amount, 'expense', receiver_description, sender_id]
      );

      db.query("COMMIT");

      return res.status(200).json({
        message: "Amount Transfered successfully.",
      });

    } catch (error) {
      await db.query("ROLLBACK");
      console.log(error);
      
      return res.status(500).json({
        message: "Transfer Failed. Try again.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "There was a problem depositing amount in your bank account."
    })
  }
}

export const deleteBankAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const bank_account_id = req.params.id;      

    const bankAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM bank_accounts WHERE user_id = $1 AND id = $2);`,
      [id, bank_account_id]
    );

    if(!bankAccountExist.rows[0].exists) {
      return res.status(404).json({
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
        message: "An error occurred while deleting the bank account.",
      })
    }

    return res.sendStatus(204);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while deleting the bank account.",
    })
  }
}

