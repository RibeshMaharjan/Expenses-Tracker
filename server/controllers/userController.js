import * as db from "../config/db.js";
import { comparePassword, hashPassword } from "../utils/index.js";

export const getUser = async (req, res) => {
  try {
    const { id } = req.user;

    const userExist = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    const user = userExist.rows[0];
    
    if(!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    user.password = undefined;

    return res.status(200).json({
      status: "success",
      user,
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

export const changePassword = async(req, res) => {
  try {
    const { id } = req.user;
    const { currentPassword, newPassword, confirmPassword  } = req.body;

    const userExist = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if(!(currentPassword || newPassword || confirmPassword)) {
      return res.status(422).json({
        message: "Provide Required Fields!",
      })
    }

    if(!userExist.rowCount) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    if(newPassword !== confirmPassword) {
      return res.status(422).json({
        message: "New Passwords does not match",
      })
    }

    const isMatch = await comparePassword(currentPassword, userExist.rows[0].password)

    if(!isMatch) {
      return res.status(422).json({
        message: "Incorrect current password.",
      })
    }

    const hashedPassword = await hashPassword(newPassword);

    await db.query(
      `UPDATE users SET
        password = $1
        WHERE id = $2`,
      [hashedPassword, id]
    )

    return res.status(200).json({
      message: "Password changed successfully",
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}

export const updateUser = async(req, res) => {
  try {

    const { id } = req.user;
    const { name, username, email } = req.body;

    const userExist = await db.query(
      `SELECT * FROM users WHERE id = $1`,
      [id]
    );

    if(!userExist.rowCount) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    if(!(name || username || email)) {
      return res.status(422).json({
        message: "Provide Required Fields!",
      })
    }

    const updatedUser = await db.query(
      `UPDATE users SET
        name = $1,
        username = $2,
        email = $3,
        updated_at = CURRENT_TIMESTAMP
        WHERE id = $4
        RETURNING *`,
      [name, username, email, id]
    )

    updatedUser.rows[0].password = undefined;

    return res.status(200).json({
      message: "User information updated successfully",
      user: updatedUser.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error.message,
    });
  }
}