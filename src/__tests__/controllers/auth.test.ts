import { Request, Response, NextFunction } from 'express';
import { AuthController } from '../../controllers/auth.controller';
import { User } from '../../entity/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Repository } from 'typeorm';
import { mock } from 'jest-mock-extended';

describe('AuthController', () => {
  let authController: AuthController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;
  let userRepositoryMock: jest.Mocked<Repository<User>>;

  beforeAll(() => {
    userRepositoryMock = mock<Repository<User>>();
  });

  beforeEach(() => {
    authController = new AuthController();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = {};
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const data = {
        email: 'test@example.com',
        name: 'Test User',
        password: 'password',
        role: 'user',
      };
      const user = new User();
      user.id = 1;
      user.email = data.email;
      user.name = data.name;
      user.password = 'hashedPassword';
      user.role = data.role;

      userRepositoryMock.findOne.mockResolvedValue(null);
      userRepositoryMock.create.mockReturnValue(user);
      userRepositoryMock.save.mockResolvedValue(user);
      (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword' as never);

      req.body = data;
      await authController.createUser(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        user,
        message: 'User Created Successfully',
      });
    });
  });

  describe('loginUser', () => {
    it('should login a user', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = new User();
      user.id = 1;
      user.email = email;
      user.password = 'hashedPassword';

      userRepositoryMock.findOne.mockResolvedValue(user);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true as never);
      (jwt.sign as jest.Mock).mockReturnValue('token');

      req.body = { email, password };
      await authController.loginUser(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(res.json).toHaveBeenCalledWith({
        user,
        token: 'token',
        message: 'Login Successful',
      });
    });
  });
});
