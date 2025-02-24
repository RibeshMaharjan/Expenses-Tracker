import express from "express";
import { authenticationToken } from "../middleware/authmiddleware.js";
import authRoutes from "./authRoutes.js";
import bankAccountRoutes from "./bankAccountRoutes.js";
import stockRoutes from "./stockRoutes.js";
import stockTransactionRoutes from "./stockTransactionRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import userRoutes from "./userRoute.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', authenticationToken, userRoutes);
router.use('/bankaccount', authenticationToken, bankAccountRoutes);
router.use('/transaction', authenticationToken, transactionRoutes);
router.use('/stock', authenticationToken, stockRoutes);
router.use('/stocktransaction', authenticationToken, stockTransactionRoutes);
router.get('/test', authenticationToken, (req, res) => {
  res.send("<h1>Test Success</h1>")
})

export default router;