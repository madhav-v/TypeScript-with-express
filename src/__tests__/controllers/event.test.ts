import { Request, Response, NextFunction } from 'express';
import { EventController } from '../../controllers/event.controller';
import { Event } from '../../entity/Event';
import { mock } from 'jest-mock-extended';
import * as typeorm from 'typeorm';

jest.mock('typeorm', () => ({
  ...jest.requireActual('typeorm'), 
  getRepository: jest.fn(),
}));

describe('EventController', () => {
  let eventController: EventController;
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: Partial<NextFunction>;

  beforeEach(() => {
    eventController = new EventController();
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear all mocks
  });

  describe('createEvent', () => {
    it('should create a new event', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        price: 10,
        seats: 100,
        startDate: new Date(),
      };

      const event = new Event();
      event.id = 1;
      event.title = eventData.title;
      event.description = eventData.description;
      event.price = eventData.price;
      event.seats = eventData.seats;
      event.startDate = eventData.startDate;

      const eventRepositoryMock = mock<typeorm.Repository<Event>>();
      eventRepositoryMock.save.mockResolvedValue(event);

      (typeorm.getRepository as jest.Mock).mockReturnValue(eventRepositoryMock);

      req.body = eventData;

      await eventController.createEvent(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        event,
        message: 'Event created successfully',
      });
    });

    it('should handle negative seats', async () => {
      const eventData = {
        title: 'Test Event',
        description: 'Test Description',
        price: 10,
        seats: -10,
        startDate: new Date(),
      };

      req.body = eventData;

      await eventController.createEvent(
        req as Request,
        res as Response,
        next as NextFunction,
      );

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: 'Seats cannot be negative',
      });
    });
  });

});
