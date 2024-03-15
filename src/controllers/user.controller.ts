import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';
import { Event } from '../entity/Event';
import { User } from '../entity/User';
import { sendMail } from '../utils/send_email';
import logger from '../config/logger';

export class UserController {
  bookEvent = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const eventRepository = getRepository(Event);
      const event = await eventRepository.findOne({ where: { id: eventId } });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      if (event.seats <= 0) {
        return res.status(400).json({ message: 'Event is fully booked' });
      }
      event.seats -= 1;

      const { email, name } = req.body;
      const user = new User();
      user.email = email;
      user.name = name;

      event.registeredUsers.push(user);

      await eventRepository.save(event);
      await sendMail(
        email,
        'Event Booking Confirmation',
        event.title,
        event.description,
      );
      logger.info('Event booked successfully', event.title, event.description);

      res.status(200).json({ message: 'Event booked successfully' });
    } catch (error: any) {
      next(error);
    }
  };

  getRegisteredUsers = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const eventId = parseInt(req.params.eventId);
      const eventRepository = getRepository(Event);
      const event = await eventRepository.findOne({
        where: { id: eventId },
        relations: ['registeredUsers'],
      });
      if (!event) {
        return res.status(404).json({ message: 'Event not found' });
      }
      logger.debug(`Returning registered users for event ${event.id}`);
      res.status(200).json(event.registeredUsers);
    } catch (error: any) {
      next(error);
    }
  };
}
