import express from "express";
import {
  createTranscation,
  getTranscation,
} from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', getTranscation);
router.post('/', createTranscation);
/* router.put('/', updateTranscation);
router.delete('/', deleteTranscation); */

export default router;