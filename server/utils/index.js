import bcrypt from "bcrypt";
import "dotenv/config";
import JWT from "jsonwebtoken";

export const hashPassword = async (userValue) => {
  const salt = await bcrypt.genSalt(10);

  const hashedPassword = await bcrypt.hash(userValue, salt);

  return hashedPassword;
};

export const comparePassword = async (userPassword, password) => {
  try {
    const isMatch = await bcrypt.compare(userPassword, password);

    return isMatch;
  } catch (error) {
    console.log(error);
  }
}

export const createToken = ({ name, username, email, user_type }) => {
  const payload = {
    name,
    username,
    email,
    user_type,
  }

  const accessToken = JWT.sign(
    payload,
    process.env.TOKEN,
    {
      expiresIn: "1d"
    },
  );
  return accessToken;
};


export const validateToken = (token) => {
  return JWT.verify(token, process.env.TOKEN);
}