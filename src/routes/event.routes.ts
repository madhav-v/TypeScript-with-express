import express from 'express';
import { EventController } from '../controllers/event.controller';
const router = express.Router();
const eventCtrl = new EventController();

router.post('/create', eventCtrl.createEvent);
// router.post('/login', eventCtrl.loginUser);

export default router;
