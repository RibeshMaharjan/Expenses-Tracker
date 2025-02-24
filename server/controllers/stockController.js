import * as db from "../config/db.js";

export const getStock = async (req, res) => {
  try {
    const { id } = req.user;

    const getStockResult = await db.query(
      `SELECT * FROM stocks WHERE user_id = $1`,
      [id]
    );

    if(getStockResult.rowCount === 0) {
      return res.sendStatus(204);
    }

    return res.status(200).json({
        data: getStockResult.rows,
      }
    )
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your bank accounts",
    });
  }
}

export const addStock = async (req, res) => {
  try {
    const { id } = req.user;
    const {
      symbol,
      stock_name,
      quantity,
      price,
      brokerage_account_id,
      transaction_date,
      bank_account_id
    } = req.body;

    if(
      !symbol || 
      !stock_name || 
      !quantity || 
      !brokerage_account_id || 
      !transaction_date ||
      !bank_account_id
    ) {
      res.status(422).json({
        message: "Missing required fields!",
      })
    }

    if(isNaN(quantity)) {
      return res.status(422).json({
        message: "Invalid Quantity.",
      });
    }

    if(quantity < 10) {
      return res.status(422).json({
        message: "Quantity cannot be less than 10."
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

    const brokerageAccountsExists = await db.query(
      `SELECT EXISTS (SELECT * FROM brokerage_accounts WHERE id = $1 AND user_id = $2);`,
      [brokerage_account_id, id]
    )

    if(!brokerageAccountsExists.rows[0].exists) {
      return res.status(404).json({
        message: "Brokerage account not found.",
      })
    }

    if(isNaN(new Date(transaction_date))) {
      return res.status(422).json({
        message: "Invalid Date.",
      });
    }

    await db.query("BEGIN");

    try {

      const addStockResult = await db.query(
        `INSERT INTO stocks (user_id, symbol, stock_name, quantity) 
        VALUES ($1, $2, $3, $4) RETURNING id;`,
        [id, symbol, stock_name, quantity]
      );

      const stock_id = addStockResult.rows[0].id;
      console.log(stock_id);

      await db.query(
        `INSERT INTO stock_transactions (user_id, brokerage_account_id, stock_id, transaction_type, price, quantity, transaction_date, bank_account_id) 
        VALUES ($1, $2, $3, 'buy', $4, $5, $6);`,
        [id, brokerage_account_id, stock_id, price, quantity, transaction_date, bank_account_id]
      );

      await db.query("COMMIT");

      return res.status(201).json({
        message: "Stock added successfully.",
      });

    } catch (error) {
      db.query("ROLLBACK");
      console.log(error);;
      return res.status(500).json({
        message: "Failed to add stock. Try again.",
      });      
    }

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your bank accounts",
    });
  }
}

/* 
export const deleteStock = async (req, res) => {
  try {
    // const { id } = req.user;
    const stock_id = req.params.id;      
    const id = 6;

    const stockExist = await db.query(
      `SELECT EXISTS (SELECT * FROM stocks WHERE user_id = $1 AND id = $2);`,
      [id, stock_id]
    );

    if(!stockExist.rows[0].exists) {
      return res.status(404).json({
        message: "Stock not found.",
      })
    }

    const deleteStockResult = await db.query(
      `DELETE FROM stocks
        WHERE id = $1;`,
      [stock_id]
    );

    if(deleteStockResult.rowCount === 0) {
      return res.status(500).json({
        message: "An error occurred while deleting the stock.",
      })
    }

    return res.sendStatus(204);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while deleting the bank account.",
    })
  }
} */