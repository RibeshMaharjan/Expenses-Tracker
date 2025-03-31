import express from "express";
import {signinUser, signupUser, refreshToken, Logout} from "../controllers/authController.js";

const router = express.Router();

router.post('/signup', signupUser);
router.post('/signin', signinUser);
router.post('/token', refreshToken);
router.post('/logout', Logout);

export default router;