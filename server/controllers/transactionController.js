import * as db from "../config/db.js";

export const getTranscation = async (req, res) => {
  try {
    const { id } = req.user;

    const getTransactionResult = await db.query(
      `SELECT * FROM transactions WHERE user_id = $1`,
      [id]
    );

    if(getTransactionResult.rowCount === 0) {
      return res.sendStatus(204);
    }

    return res.status(200).json({
        data: getTransactionResult.rows,
    })
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your home accounts",
    });
  }
}

export const getAllTransaction = async (req, res) => {
  try {
    const { id } = req.user;

    /*const getTranscationResult = await db.query(
      `SELECT *,name FROM transactions JOIN transaction_categories WHERE transactions.user_id =  $1`,
      [id]
    );*/
    const getTranscationResult = await db.query(
      `SELECT transactions.id as id, 
                   transactions.user_id as user_id, 
                   transaction_categories.id as category_id,
                   bank_account_id, 
                   transaction_amount, 
                   transaction_type, 
                   transaction_date, 
                   description, 
                   transaction_time,
                   name as category 
            FROM transactions JOIN transaction_categories ON transactions.category_id = transaction_categories.id 
            WHERE transactions.user_id = $1`,
      [id]
    );

    if(getTranscationResult.rowCount === 0) {
      return res.sendStatus(204);
    }

    return res.status(200).json({
        data: getTranscationResult.rows,
      }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your home accounts",
    });
  }
}

export const createTranscation = async (req, res) => {
  try {
    const { id } = req.user;

    const { 
      bank_account_id,
      transaction_amount,
      transaction_type,
      category_id,
      transaction_date,
      description,
      transaction_time,
    } = req.body;

    console.log(transaction_time);

    if(
        !bank_account_id || 
        !transaction_amount || 
        !category_id || 
        !transaction_date ||
        !description ||
        !transaction_time
      ) {
      return res.status(422).json({
        message: "Missing required fields!"
      })
    }

    if(transaction_type !== "income" && transaction_type !== "expense") {
      return res.status(422).json({
        message: "Invalid transaction type.",
      });
    }
    
    const categoryIdExist = await db.query(
      `SELECT EXISTS (SELECT * FROM transaction_categories WHERE user_id = $1 AND id = $2)`,
      [id, category_id]
    )

    if(!categoryIdExist.rows[0].exists) {
      return res.status(422).json({
        message: "Invalid category.",
      });
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

    if(isNaN(new Date(transaction_date))) {
      return res.status(422).json({
        message: "Invalid Date.",
      });
    }

    // BEGIN Transaction
    await db.query("BEGIN");

    try {

      if(transaction_type === "expense") {
        const bankBalance =  await db.query(
          `SELECT balance FROM bank_accounts WHERE id = $1`,
          [bank_account_id]
        );
    
        if(bankBalance.rows[0].balance < transaction_amount) {
          return res.status(400).json({
            message: "Transaction Failed. Insufficient account ballance",
          });
        }

        await db.query(
          `UPDATE bank_accounts SET 
                                balance = balance - $1
                                WHERE id = $2`,
          [transaction_amount, bank_account_id]);
      } else {
        await db.query(
          `UPDATE bank_accounts SET 
                                balance = balance + $1
                                WHERE id = $2`,
          [transaction_amount, bank_account_id]
        );
      }

      // Insert new transaction
      await db.query(
        `INSERT INTO transactions(user_id, 
                                  bank_account_id, 
                                  transaction_amount, 
                                  transaction_type, 
                                  category_id, 
                                  transaction_date, 
                                  description,
                                  transaction_time) 
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          id,
          bank_account_id,
          transaction_amount,
          transaction_type,
          category_id,
          transaction_date,
          description,
          transaction_time
        ]
      )

      // COMMIT Transaction
      await db.query("COMMIT");

      return res.status(201).json({
        message: "Transaction completed successfully.",
      });
      
    } catch (error) {
      await db.query("ROLLBACK");
      console.log(error);
      
      return res.status(500).json({
        message: "Transaction Failed. Try again.",
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem processing your transaction.",
    });    
  }
}

export const getTransactionCategory = async (req, res) => {
  try {
    const { id } = req.user;

    const transactionCategoryResult = await db.query(
      `SELECT * FROM transaction_categories WHERE user_id = $1`,
      [id]
    );

    if(transactionCategoryResult.rowCount === 0) {
      return res.sendStatus(204);
    }

    return res.status(200).json({
      data: transactionCategoryResult.rows,
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem processing your transaction.",
    });
  }
}


/* export const updateTranscation = async (req, res) => {
  try {
    const { id } = req.user;

    const {
      transaction_id,
      transaction_amount,
      transaction_type,
      category_id,
      transaction_date,
      description
    } = req.body;

    if(
        !transaction_amount || 
        !description || 
        !category_id || 
        !transaction_date ||
        !description
      ) {
      return res.status(422).json({
        message: "Missing required fields!"
      })
    }

    if(transaction_type !== "income" && transaction_type !== "expense") {
      return res.status(422).json({
        message: "Invalid transaction type.",
      });
    }
    
    const categoryIdExist = await db.query(
      `SELECT EXISTS (SELECT * FROM transaction_categories WHERE user_id = $1 AND id = $2)`,
      [id, category_id]
    )

    if(!categoryIdExist.rows[0].exists) {
      return res.status(422).json({
        message: "Invalid category.",
      });
    }
    
    if(isNaN(transaction_amount)) {
      return res.status(422).json({
        message: "Invalid Amount.",
      });
    }

    if(isNaN(new Date(transaction_date))) {
      return res.status(422).json({
        message: "Invalid Date.",
      });
    }

    // BEGIN Transaction
    await db.query("BEGIN");

    try {

      if(transaction_type === "expense") {
        await db.query(
          `UPDATE bank_accounts SET 
                                balance = balance - $1,
                                updated_at = CURRENT_TIMESTAMP 
                                WHERE id = $2`,
          [transaction_amount, bank_account_id]);
      } else {
        await db.query(
          `UPDATE bank_accounts SET 
                                balance = balance + $1,
                                updated_at = CURRENT_TIMESTAMP 
                                WHERE id = $2`,
                                updated_at = CURRENT_TIMESTAMP
          [transaction_amount, bank_account_id]
        );
      }

                                updated_at = CURRENT_TIMESTAMP
      // Insert new transaction
      await db.query(
        `UPDATE transactions SET
          transaction_amount = $1,
          transaction_type = $2,
          category_id = $3,
          transaction_date = $4,
          description = $5
          WHERE user_id = $7`,
        [
          transaction_amount, 
          transaction_type, 
          category_id, 
          transaction_date, 
          description,
          transaction_id
        ]
      )

      // COMMIT Transaction
      await db.query("COMMIT");

      return res.status(201).json({
        message: "Transaction updated successfully.",
      });
      
    } catch (error) {
      await db.query("ROLLBACK");
      console.log(error);
      
      return res.status(500).json({
        message: "Transaction update Failed. Try again.",
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem updating your transaction.",
    });    
  }
} */

/* export const deleteTranscation = async (req, res) => {
  
} */