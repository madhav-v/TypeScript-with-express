import { Request, Response, NextFunction } from 'express';
import { UserRegisterType } from '../types/user.types';
import { getRepository } from 'typeorm';
import { User } from '../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from '../utils/validateEnv';
import logger from '../config/logger';

export class AuthController {
  createUser = async (req: Request, res: Response) => {
    try {
      const data = req.body as UserRegisterType;

      const userRepository = getRepository(User);
      const existingUser = await userRepository.findOne({
        where: { email: data.email },
      });
      if (existingUser) {
        return res.status(400).json({ message: 'User already exists' });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = userRepository.create({
        email: data.email,
        name: data.name,
        password: hashedPassword,
        role: data.role || 'user',
      });
      let result = await userRepository.save(user);

      res.status(201).json({
        user: result,
        message: 'User Created Successfully',
      });

      logger.info('User created successfully', res.status(201).json);
    } catch (error) {
      logger.error('Error in registration', error);
      console.log(error);
    }
  };

  loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const userRepository = getRepository(User);
      const user = await userRepository.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({ message: 'User doesnot exists' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      let accessToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
        expiresIn: 86400,
      });

      let refreshToken = jwt.sign({ userId: user.id }, env.JWT_SECRET, {
        expiresIn: '5d',
      });

      res.json({
        user: user,
        accessToken: accessToken,
        refreshToken: refreshToken,
        message: 'Login Successful',
      });

      logger.info('Login Successful', user);
    } catch (error) {
      logger.error('Error in login', error);
    }
  };

  refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const refreshToken = req.body.refreshToken;
      if (!refreshToken) {
        return res.status(403).json({ message: 'Refresh token is required' });
      }
      jwt.verify(refreshToken, env.JWT_SECRET, (err: any, decoded: any) => {
        if (err) {
          return res.status(401).json({ message: 'Invalid refresh token' });
        }

        // If refresh token is valid, generate a new access token
        const accessToken = jwt.sign(
          { userId: decoded.userId },
          env.JWT_SECRET,
          {
            expiresIn: 86400,
          },
        );

        res.json({
          accessToken: accessToken,
          message: 'Token Refreshed',
        });
      });
    } catch (error: any) {
      logger.error('Error in refreshing token', error);
    }
  };
}
