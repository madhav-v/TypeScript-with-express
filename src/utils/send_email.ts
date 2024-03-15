import nodemailer from 'nodemailer';
import mjml from 'mjml';
import handlebars from 'handlebars';
import fs from 'fs';
import env from '../utils/validateEnv';
import logger from '../config/logger';

const mjmlTemplate = fs.readFileSync('src/mails/email.mjml', 'utf8');

const { html } = mjml(mjmlTemplate);

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

export const sendMail = async (
  to: string,
  subject: string,
  eventTitle: string,
  eventDescription: string,
) => {
  const template = handlebars.compile(html);
  await transporter.sendMail({
    from: 'madhavdhungana36@gmail.com',
    to: to,
    subject: subject,
    html: template({ subject, eventTitle, eventDescription }),
  });
  logger.info(`Email sent to ${to} with subject: ${subject}`);
};
