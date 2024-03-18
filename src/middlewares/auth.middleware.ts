import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import environment from '../utils/validateEnv';
import { NextFunction, Request, Response } from 'express';
import ErrorHandler from '../utils/errorhandler';

export interface CustomRequest extends Request{
    user?: any
}


//check Auth
export const checkAuth = asyncHandler(
  async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      const token = req.header('Authorization');
      if (!token) {
        throw new ErrorHandler('Access Denied', 401);
      }
      const decoded = jwt.verify(token, environment.JWT_SECRET);
      req.user = decoded;
      next();
    } catch (error: any) {
      throw new ErrorHandler(error, 404);
    }
  },
);

// check Role
export const checkRole =
  (role: string) => (req: CustomRequest, res: Response, next: NextFunction) => {
    if (role === req.user?.role) {
      next();
    } else {
      res.status(400).json({
        success: false,
        message: 'You are not authorized to access this route',
      });
    }
  };
