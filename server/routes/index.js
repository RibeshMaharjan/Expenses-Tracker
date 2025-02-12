import express from "express";
import { authenticationToken } from "../middleware/authmiddleware.js";
import authRoutes from "./authRoutes.js";
import userRoutes from "./userRoute.js";

const router = express.Router();

router.use('/auth', authenticationToken, authRoutes);
router.use('/users', userRoutes);
router.get('/test', authenticationToken, (req, res) => {
  res.send("<h1>Test Success</h1>")
})

export default router;