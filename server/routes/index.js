import express from "express";
import { authenticationToken } from "../middleware/authmiddleware.js";
import authRoutes from "./authRoutes.js";
import bankAccountRoutes from "./bankAccountRoutes.js";
import stockRoutes from "./stockRoutes.js";
import stockTransactionRoutes from "./stockTransactionRoutes.js";
import transactionRoutes from "./transactionRoutes.js";
import userRoutes from "./userRoute.js";
import brokerageRoutes from "./brokerageRoutes.js";

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/users', authenticationToken, userRoutes);
router.use('/bankaccount', authenticationToken, bankAccountRoutes);
router.use('/transaction', authenticationToken, transactionRoutes);
router.use('/stock', authenticationToken, stockRoutes);
router.use('/stocktransaction', authenticationToken, stockTransactionRoutes);
router.use('/brokerage', authenticationToken, brokerageRoutes);
router.get('/test', (req, res) => {
  res.status(200).json({
    message: "Test Success",
})
});

export default router;