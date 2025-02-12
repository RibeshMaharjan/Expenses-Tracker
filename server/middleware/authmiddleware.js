import { validateToken } from "../utils/index.js";

export const authenticationToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if(token === null) res.status(401).json({
    status: "Unauthorized",
    message: "Access Denied",
  })

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