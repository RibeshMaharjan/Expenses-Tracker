import * as db from "../config/db.js";
import { comparePassword, createToken, hashPassword } from "../utils/index.js";

export const signupUser = async (req, res) => {
  try {
    const { name, username, password, rePassword, email } = req.body;

    if(!(name || username || password || !rePassword || email))  {
      return res.status(422).json({
        message: "Provide Required Fields!",
      });
    }

    const userExist = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if(password === rePassword) {
      return res.status(422).json({
        message: "Passwords does not match",
      })
    }

    if(userExist.rowCount) {
      console.log("User Already Exist");
      return res.status(409).json({
        message: "User Already Exist",
      });  
    }

    const hashPwd = await hashPassword(password);

    const user = await db.query(
      "INSERT INTO users (name, username, password, email, created_at) VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP) RETURNING *",
      [name, username, hashPwd, email],
    );

    user.rows[0].password = undefined;

    return res.status(201).json({
      message: 'User account created successfully',
      user: user.rows[0],
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const signinUser = async(req, res) => {
  try {
    const { email, password } = req.body;

    if(!(password || email))  {
      return res.status(404).json({
        message: "Provide Required Fields!",
      });
    }

    const result = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    const user = result.rows[0];    

    if(!user) {
      return res.status(401).json({
        message: "Invalid email",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if(!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    user.password = undefined;

    const token = createToken(user);
    return res.status(200).json({
      message: "Login successfully",
      user,
      token,
    });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}