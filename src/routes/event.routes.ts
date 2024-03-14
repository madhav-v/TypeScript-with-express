import express from 'express';
import { EventController } from '../controllers/event.controller';
import upload from '../middlewares/file.upload';
const router = express.Router();
const eventCtrl = new EventController();

router.post('/create', upload.single('thumbnail'), eventCtrl.createEvent);
router.get('/', eventCtrl.getAllEvents);
router.get('/:id', eventCtrl.getEventById);

export default router;
