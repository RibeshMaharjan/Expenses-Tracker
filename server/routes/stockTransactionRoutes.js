import express from "express";
import { createStockTransaction, getStockTransaction } from "../controllers/stockTransactionController.js";

const router = express.Router();

router.get('/', getStockTransaction);
router.post('/create', createStockTransaction);

export default router;