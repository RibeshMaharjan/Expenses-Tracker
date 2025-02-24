import express from "express";
import { createStockTranscation, getStockTranscation } from "../controllers/stockTransactionController.js";

const router = express.Router();

router.get('/', getStockTranscation);
router.post('/create', createStockTranscation);

export default router;