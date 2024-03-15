import { Request, Response } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { User } from '../entity/User';
const authController = new AuthController();

jest.mock('../models/user', () => ({
  User: {
    create: jest.fn(),
  },
}));


describe('registerUser', () => {
  it('should register a new user', async () => {
    const req = {
      body: {
        name: 'Test User',
        email: 'user@gmail.com',
        password: 'password',
        role: 'user',
      },
    } as Request;

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response;

    // Mocking User.create to return a mock object with a save method
    const userSaveMock = jest.fn().mockResolvedValueOnce({ id: 1 });
    jest.mock('../models/user', () => ({
      User: {
        create: jest.fn().mockReturnValueOnce({ save: userSaveMock }),
      },
    }));

    await authController.createUser(req, res);

    // Expect the response status to be 201
    expect(res.status).toHaveBeenCalledWith(201);

    // Expect the response JSON to contain the expected data
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      message: expect.any(String),
      data: expect.objectContaining({ id: 1 }),
    });
  });
});
