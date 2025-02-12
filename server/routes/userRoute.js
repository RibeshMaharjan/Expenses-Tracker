import express from "express";
import { changePassword, getUser, updateUser } from "../controllers/userController.js";
import { authenticationToken } from "../middleware/authmiddleware.js";

const router = express.Router();

router.get("/", authenticationToken, getUser);
router.put("/", authenticationToken, updateUser);
router.put("/changepassword", authenticationToken, changePassword);


export default router;
