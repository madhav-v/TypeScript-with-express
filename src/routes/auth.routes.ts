import express from 'express';
import { AuthController } from '../controllers/auth.controller';
import { UserController } from '../controllers/user.controller';

const router = express.Router();
const authCtrl = new AuthController();
const userCtrl = new UserController();

/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: User authentication endpoints
 */

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       '201':
 *         description: User successfully registered
 *       '400':
 *         description: User already exists
 */
router.post('/register', authCtrl.createUser);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Log in to the application
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Successfully logged in
 *       '400':
 *         description: Invalid email or password
 */
router.post('/login', authCtrl.loginUser);

/**
 * @swagger
 * tags:
 *   name: User
 *   description: User management endpoints
 */

/**
 * @swagger
 * /book/{eventId}:
 *   post:
 *     summary: Book an event
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       '200':
 *         description: Event successfully booked
 *       '400':
 *         description: Event not found or fully booked
 */
router.post('/book/:eventId', userCtrl.bookEvent);

/**
 * @swagger
 * /{eventId}:
 *   get:
 *     summary: Get registered users for an event
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Returns registered users for the specified event
 *       '404':
 *         description: Event not found
 */
router.get('/:eventId', userCtrl.getRegisteredUsers);

export default router;
