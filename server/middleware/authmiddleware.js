import { validateToken } from "../utils/index.js";

export const authenticationToken = (req, res, next) => {

  const authHeader = req.cookies?.authToken || req.headers['authorization'];

  if(authHeader === null) res.status(401).json({
    status: "Unauthorized",
    message: "Access Denied",
  })
  
  const token = authHeader?.split(' ').pop();

  try {
    const payload = validateToken(token);
    req.user = payload;
  } catch (error) {
    return res.status(401).json({
      status: "Unauthorized",
      message: "Access Denied",
    })
  }

  next();
}