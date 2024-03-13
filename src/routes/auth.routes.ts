import express from 'express';
import { AuthController } from '../controllers/auth.controller';
const router = express.Router();
const authCtrl = new AuthController();

router.post('/register', authCtrl.createUser);
router.post('/login', authCtrl.loginUser);

export default router