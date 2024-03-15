import { getRepository, Between } from 'typeorm';
import { Event } from '../entity/Event';
import cron from 'node-cron';
import { startOfDay } from 'date-fns';
import nodemailer from 'nodemailer';
import mjml from 'mjml';
import handlebars from 'handlebars';
import fs from 'fs';
import env from '../utils/validateEnv';
import logger from '../config/logger';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: env.SMTP_MAIL,
    pass: env.SMTP_PASSWORD,
  },
});
const sendMail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  try {
    await transporter.sendMail({
      from: 'madhavdhungana36@gmail.com',
      to: to,
      subject: subject,
      html: html,
    });
    logger.info('Sent mail successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
const sendTodayMails = async (events: Event[]): Promise<void> => {
  try {
    const mjmlTemplate = fs.readFileSync('src/mails/todays-event.mjml', 'utf8');
    const template = handlebars.compile(mjmlTemplate);

    const html = template({ todayEvents: events }); // Pass 'todayEvents' to the template
    await sendMail('madhavdhungana36@gmail.com', "Today's Events", html);
    logger.info('Sent mail successfully');
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

export const runCronJob = (): void => {
  cron.schedule('0 8 * * *', async () => {
    try {
      const eventRepository = getRepository(Event);
      const today = new Date();
      today.setUTCHours(0, 0, 0, 0);

      const todayEvents = await eventRepository.find({
        where: {
          startDate: Between(
            today,
            new Date(today.getTime() + 24 * 60 * 60 * 1000),
          ),
        },
      });
      await sendTodayMails(todayEvents);
      logger.info('Sent mail successfully crunjob');
    } catch (error: any) {
      console.log('Error on cronjob', error);
    }
  });
};
