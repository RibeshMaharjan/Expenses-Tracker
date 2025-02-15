import express from "express";
import {
  createBankAccount,
  deleteBankAccount,
  getAllBankAccount,
  getBankAccount,
} from "../controllers/bankAccountContoller.js";

const router = express.Router();

router.get('/', getAllBankAccount);
router.get('/:id', getBankAccount);
router.post('/createaccount', createBankAccount);
router.delete('/:id', deleteBankAccount);

export default router;