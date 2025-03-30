import * as db from "../config/db.js";

export const getAllBrokerageAccount = async (req, res) => {
  try {
    const { id } = req.user;

    const allBrokerageAccount = await db.query(
      `SELECT * FROM brokerage_accounts WHERE user_id = $1;`,
      [id]
    )

    if(allBrokerageAccount.rows.length === 0) {
      return res.status(200).json({
        data: [], // Return empty array as no data was found
      })
    }

    return res.status(200).json({
      data: allBrokerageAccount.rows, // Return array of home accounts
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your home accounts",
    })
  }
}

export const getBrokerageAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const brokerageAccountId = req.params.id;

    const brokerageAccount = await db.query(
      `SELECT * FROM brokerage_accounts WHERE id = $1;`,
      [brokerageAccountId]
    );

    if(brokerageAccount.rows.length === 0) {
      return res.status(200).json({
        data: [], // Return empty array as no data was found
      })
    }

    return res.status(200).json({
      message: "Brokerage account retrieved successfully",
      data: brokerageAccount.rows[0],
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "There was a problem retrieving your home account",
    })
  }
}

export const createBrokerageAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const { brokerage_no, brokerage_account_no, brokerage_account_holder_name } = req.body;

    if(!brokerage_no || !brokerage_account_no || !brokerage_account_holder_name) {
      return res.status(422).json({
        message: "Missing required fields!",
      })
    }

    const brokerageAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM brokerage_accounts WHERE user_id = $1 AND brokerage_account_no = $2);`,
      [id, brokerage_account_no]
    );

    if(brokerageAccountExist.rows[0].exists) {
      return res.status(422).json({
        message: "Brokerage account already exists.",
      })
    }

    const result = await db.query(
      `INSERT INTO brokerage_accounts (user_id, brokerage_no, brokerage_account_no, brokerage_account_holder_name) 
            VALUES ($1, $2, $3, $4) RETURNING *;`,
      [id, brokerage_no, brokerage_account_no, brokerage_account_holder_name]
    );

    const brokerage_account_id = result.rows[0].id;

    return res.status(201).json({
      message: "Brokerage account created successfully.",
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while creating the home account.",
    })
  }
}

export const deleteBrokerageAccount = async (req, res) => {
  try {
    const { id } = req.user;
    const brokerage_account_id = req.params.id;

    const brokerageAccountExist = await db.query(
      `SELECT EXISTS (SELECT * FROM brokerage_accounts WHERE user_id = $1 AND id = $2);`,
      [id, brokerage_account_id]
    );

    if(!brokerageAccountExist.rows[0].exists) {
      return res.status(404).json({
        message: "Brokerage account not found.",
      })
    }

    await db.query(
      `DELETE FROM stock_transactions
        WHERE brokerage_account_id = $1;`,
      [brokerage_account_id]
    )

    const deleteAccountResult = await db.query(
      `DELETE FROM brokerage_accounts
        WHERE id = $1;`,
      [brokerage_account_id]
    );

    if(deleteAccountResult.rowCount === 0) {
      return res.status(500).json({
        message: "An error occurred while deleting the home account.",
      })
    }

    return res.sendStatus(204);

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "An error occurred while deleting the home account.",
    })
  }
}

