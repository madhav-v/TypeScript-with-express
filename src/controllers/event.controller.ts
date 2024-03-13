import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { EventCreateType } from '../types/event.types';
import { Event } from '../entity/Event';

export class EventController {
  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = req.body as EventCreateType;
      const eventRepository = getRepository(Event);
      const event = eventRepository.create({
        title: data.title,
        description: data.description,
        thumbnail: data.thumbnail,
        seats: data.seats,
        price: data.price,
      });
      let result = await eventRepository.save(event);
      res.status(201).json({
        event: result,
        message: 'Event Created Successfully',
      });
    } catch (error) {
      next(error);
    }
  };
}
