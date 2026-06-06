import express from 'express';
import { loginUser, registerUser, verifyEmail } from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);

router.get("/verify", verifyEmail)
router.post("/login", loginUser)

export default router;