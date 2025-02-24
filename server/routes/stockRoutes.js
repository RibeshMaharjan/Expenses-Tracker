import express from "express";
import { addStock, getStock } from "../controllers/stockController.js";

const router = express.Router();

router.get('/', getStock);
router.post('/', addStock);
// router.delete('/:id', deleteStock);

export default router;