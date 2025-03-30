import express from "express";
import {
  createTranscation, getAllTransaction, getTransactionCategory,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getAllTransaction);
// router.get('/', getTranscation);
router.post('/', createTranscation);
router.get('/category', getTransactionCategory);
/* router.put('/', updateTranscation);
router.delete('/', deleteTranscation); */

export default router;