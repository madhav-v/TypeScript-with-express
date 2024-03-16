import express from 'express';
import { EventController } from '../controllers/event.controller';
import upload from '../middlewares/file.upload';

const router = express.Router();
const eventCtrl = new EventController();

/**
 * @swagger
 * tags:
 *   name: Event
 *   description: Event management endpoints
 */

/**
 * @swagger
 * /create:
 *   post:
 *     summary: Create a new event
 *     tags: [Event]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               seats:
 *                 type: number
 *               startDate:
 *                 type: string
 *               thumbnail:
 *                 type: string
 *                 format: binary
 *     responses:
 *       '201':
 *         description: Event created successfully
 *       '400':
 *         description: Invalid request
 */
router.post('/create', upload.single('thumbnail'), eventCtrl.createEvent);

/**
 * @swagger
 * /:
 *   get:
 *     summary: Get all events
 *     tags: [Event]
 *     responses:
 *       '200':
 *         description: Returns all events
 */
router.get('/', eventCtrl.getAllEvents);

/**
 * @swagger
 * /{id}:
 *   get:
 *     summary: Get an event by ID
 *     tags: [Event]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       '200':
 *         description: Returns the event
 *       '404':
 *         description: Event not found
 */
router.get('/:id', eventCtrl.getEventById);

export default router;
