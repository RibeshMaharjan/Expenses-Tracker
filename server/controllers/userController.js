import * as db from "../config/db.js";
import { comparePassword, createToken, hashPassword } from "../utils/index.js";

export const signupUser = async (req, res) => {
  try {
    const { name, username, password, email } = req.body;

    if(!(name || username || password || email))  {
      req.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const userExist = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if(userExist.rowCount) {
      console.log("User Already Exist");
      return res.status(400).json({
        status: "failed",
        message: "User Already Exist",
      });  
    }

    const hashPwd = await hashPassword(password);

    // console.log()hashPwd;
    

    const user = await db.query(
      "INSERT INTO users (name, username, password, email, created_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
      [name, username, hashPwd, email],
    );

    user.rows[0].password = undefined;

    return res.status(201).json({
      status: 'success',
      message: 'User account created successfully',
      user: user.rows[0],
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
}

export const signinUser = async(req, res) => {
  try {
    const { email, password } = req.body;

    if(!(password || email))  {
      req.status(404).json({
        status: "failed",
        message: "Provide Required Fields!",
      });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];

    console.log(user);
    

    if(!user) {
      res.status(404).json({
        status: "failed",
        message: "Invalid email",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if(!isMatch) {
      res.status(404).json({
        status: "failed",
        message: "Invalid password",
      });
    }

    user.password = undefined;

    const token = createToken(user);
    res.status(200).json({
      status: "success",
      message: "Login successfully",
      user,
      token,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({
      status: "failed",
      message: error.message,
    });
  }
}