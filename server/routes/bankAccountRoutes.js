import express from "express";
import {
  addMoneyToBank,
  createBankAccount,
  deleteBankAccount,
  getAllBankAccount,
  getBankAccount,
  transferMoneyToAccount,
} from "../controllers/bankAccountContoller.js";

const router = express.Router();

router.get('/', getAllBankAccount);
router.get('/:id', getBankAccount);
router.post('/createaccount', createBankAccount);
router.post('/deposit', addMoneyToBank);
router.post('/transfer', transferMoneyToAccount);
router.delete('/:id', deleteBankAccount);

export default router;