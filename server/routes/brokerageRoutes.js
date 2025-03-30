import express from "express";
import {
  createBrokerageAccount,
  getAllBrokerageAccount,
  getBrokerageAccount
} from "../controllers/brokerageController.js";

const router = express.Router();

router.get('/', getAllBrokerageAccount);
router.get('/:id', getBrokerageAccount);
router.post('/createaccount', createBrokerageAccount);

export default router;