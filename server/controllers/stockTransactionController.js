import * as db from "../config/db.js";

export const getStockTranscation = async (req, res) => {
  try {
    const { id } = req.user;

    const getStockTranscationResult = await db.query(
      // `SELECT * FROM stock_transactions WHERE user_id =  $1`,
      `SELECT symbol, st.quantity as quantity, price, transaction_type, brokerage_account_no, bank_name, transaction_date FROM stock_transactions st JOIN brokerage_accounts ba on ba.id = st.brokerage_account_id join stocks s on s.id = st.stock_id JOIN bank_accounts b on b.id = st.bank_account_id WHERE st.user_id = $1;`,
      [id]
    );

    if(getStockTranscationResult.rowCount === 0) {
      return res.sendStatus(204);
    }

    return res.status(200).json({
        data: getStockTranscationResult.rows,
      }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your home accounts",
    });
  }
}

export const createStockTranscation = async (req, res) => {
  try {
    // const { id } = req.user;

    const id = 6;

    const { 
      brokerage_account_id,
      symbol,
      stock_name,
      transaction_type,
      quantity,
      price,
      transaction_date,
      bank_account_id
    } = req.body;

    if(
        !brokerage_account_id || 
        !symbol ||
        !stock_name || 
        !transaction_type || 
        !quantity ||
        !price ||
        !transaction_date ||
        !bank_account_id
      ) {
      return res.status(422).json({
        message: "Missing required fields!"
      })
    }

    const brokerageAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM brokerage_accounts WHERE user_id = $1 AND id = $2);`,
      [id, brokerage_account_id]
    );

    if(!brokerageAccountExist.rows[0].exists) {
      return res.status(422).json({
        message: "Brokerage account account not found",
      })
    }

    if(transaction_type !== "buy" && transaction_type !== "sell") {
      return res.status(422).json({
        message: "Invalid transaction type.",
      });
    }

    if(isNaN(quantity)) {
      return res.status(422).json({
        message: "Invalid Quantity.",
      });
    }

    if(quantity <= 10) {
      return res.status(422).json({
        message: "Amount cannot be less than 10."
      })
    }

    if(isNaN(price)) {
      return res.status(422).json({
        message: "Invalid Price.",
      });
    }

    if(price <= 0) {
      return res.status(422).json({
        message: "Price cannot be 0."
      })
    }
    
    if(isNaN(new Date(transaction_date))) {
      return res.status(422).json({
        message: "Invalid Date.",
      });
    }

    const bankAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM bank_accounts WHERE id = $1 AND user_id = $2)`,
      [bank_account_id, id]
    );

    if(!bankAccountExist.rows[0].exists) {
      return res.status(404).json({
        message: "Bank account not found",
      })
    }

    // BEGIN Transaction
    await db.query("BEGIN");

    try {

      const bankBalance =  await db.query(
        `SELECT balance FROM bank_accounts WHERE id = $1`,
        [bank_account_id]
      );
  
      if(bankBalance.rows[0].balance < price) {
        return res.status(400).json({
          message: "Transaction Failed. Insufficient account balance",
        });
      }

      const stockExist = await db.query(
        `SELECT * FROM stocks WHERE user_id = $1 AND symbol = $2;`,
        [id, symbol]
      );
  
      if(stockExist.rows.length === 0) {
        await db.query(
          `INSERT INTO stocks (user_id, symbol, stock_name, quantity) 
          VALUES ($1, $2, $3, $4) RETURNING id;`,
          [id, symbol, stock_name, quantity]
        );
      }

      const stock_id = stockExist.rows[0].id;

      await db.query(
        `INSERT INTO stock_transactions(user_id, 
                                        brokerage_account_id, 
                                        stock_id, 
                                        quantity, 
                                        price, 
                                        transaction_type, 
                                        transaction_date) 
          VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          id, 
          brokerage_account_id, 
          stock_id, 
          quantity, 
          price, 
          transaction_type, 
          transaction_date
        ]);

      // COMMIT Transaction
      await db.query("COMMIT");

      return res.status(201).json({
        message: "Stock transaction completed successfully.",
      });
      
    } catch (error) {
      await db.query("ROLLBACK");
      console.log(error);
      
      return res.status(500).json({
        message: "Stock transaction Failed. Try again.",
      });
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem processing your transaction.",
    });    
  }
}
