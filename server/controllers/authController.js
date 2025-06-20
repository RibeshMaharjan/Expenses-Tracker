import * as db from "../config/db.js";
import {
  comparePassword,
  createRefreshToken,
  createToken,
  hashPassword,
  validateRefreshToken,
  validateToken
} from "../utils/index.js";
import JWT from "jsonwebtoken";

export const signupUser = async (req, res) => {
  try {
    const { fullname, username, password, confirmPassword, email } = req.body;

    if(!(fullname || username || password || !confirmPassword || email))  {
      return res.status(422).json({
        message: "Provide Required Fields!",
      });
    }

    const userExist = await db.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if(password !== confirmPassword) {
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
      [fullname, username, hashPwd, email],
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
        message: "User not found",
      });
    }

    const isMatch = await comparePassword(password, user?.password);

    if(!isMatch) {
      return res.status(401).json({
        message: "Invalid password",
      });
    }

    user.password = undefined;
    req.user = user;

    const token = createToken(user);
    const refreshTokenResult = createRefreshToken(user);
    const refreshToken = `{${refreshTokenResult}}`;
    await db.query(
      `UPDATE users
      SET refresh_token=refresh_token || $1
      WHERE email = $2`,
      [refreshToken, email]
    );

    return res.status(200)
              .cookie('authToken', `Bearer ${token}`)
              .cookie('refreshToken', `${refreshTokenResult}`)
              .json({
                message: "Login successfully",
                user,
              });

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: error.message,
    });
  }
}

export const refreshToken = async (req, res) => {
  const { id } = req.body;
  const refreshToken = req.cookies?.refreshToken || req.headers['authorization'];

  if(refreshToken === null) res.status(401).json({
    status: "Unauthorized",
    message: "Access Denied",
  })

  const tokenresult = await db.query(
    `SELECT refresh_token from users WHERE id = $1`,
    [id]
  );
  
  const refreshTokens = tokenresult.rows.length !== 0 ? tokenresult.rows[0].refresh_token : [];
  if(!refreshTokens.includes(refreshToken)) res.status(403);

  try {
    const payload = validateRefreshToken(refreshToken);
    if(!payload) {
      res.status(401).json({
        status: "Unauthorized",
        message: "Access Denied",
      })
    }
    const accessToken =  createToken(payload);
    return res.status(200)
      .cookie('authToken', `Bearer ${accessToken}`)
      .json({
        message: "success",
        user: payload,
      });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: error.message,
    });
  }
}

export const Logout = async (req, res) => {
  const { id } = req.body;
  const refreshToken = req.cookies?.refreshToken || req.headers['authorization'];

  console.log(id);
  const tokenresult = await db.query(
    `SELECT refresh_token from users WHERE id = $1`,
    [id]
  );

  const refreshTokens = tokenresult.rows.length !== 0 ? tokenresult.rows[0].refresh_token : [];
  const updatedRefreshTokens = refreshTokens.filter(token => token !== refreshToken);

  try {
    const tokenresult = await db.query(
      `UPDATE users
      SET refresh_token=$1
      WHERE id = $2`,
      [updatedRefreshTokens, id]
    );

    return res.status(200)
      .clearCookie("authToken")
      .clearCookie("refreshToken")
      .json({
        message: "Logged out successfully",
      });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      message: error.message,
    });
  }
}