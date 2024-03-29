import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { EventCreateType } from '../types/event.types';
import { Event } from '../entity/Event';
import logger from '../config/logger';

export class EventController {
  createEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, description, price, seats, startDate } =
        req.body as EventCreateType;

      const eventSeats = seats !== undefined ? seats : 0;
      if (eventSeats < 0) {
        return res.status(400).json({
          message: 'Seats cannot be negative',
        });
      }

      let thumbnail = '';
      if (req.file) {
        thumbnail = req.file.path;
      }
      const event = new Event();
      event.title = title;
      event.description = description;
      event.thumbnail = thumbnail;
      event.seats = eventSeats;
      event.price = price;
      event.startDate = startDate;
      const eventRepository = getRepository(Event);

      let result = await eventRepository.save(event);
      console.log('Event saved successfully');
      res.status(201).json({
        event: result,
        message: 'Event created successfully',
      });
      logger.info('Event saved successfully', event);
    } catch (error) {
      logger.error('Error saving event', error);
      next(error);
    }
  };

  getAllEvents = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventRepository = getRepository(Event);
      const events = await eventRepository.find();
      res.json(events);
      logger.info('Events fetched successfully');
    } catch (error: any) {
      logger.error(`Failed to retrieve all events`, error);
      next(error);
    }
  };

  getEventById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id);
      const eventRepository = getRepository(Event);
      const event = await eventRepository.findOne({ where: { id } });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      res.json(event);
      logger.info('Event fetched successfully');
    } catch (error: any) {
      logger.error(`Failed to retrieve event`, error);
      next(error);
    }
  };
}
