import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';
const router = express.Router();
const authCtrl = new AuthController();
const userCtrl = new UserController();

router.post('/register', authCtrl.createUser);
router.post('/login', authCtrl.loginUser);
router.post('/book/:eventId', userCtrl.bookEvent);
router.get('/:eventId',userCtrl.getRegisteredUsers)

export default router;
