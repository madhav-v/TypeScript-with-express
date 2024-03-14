import path from 'path';
import dotenv from 'dotenv';
import { cleanEnv, port, str } from 'envalid';

const envFilePath = path.resolve(path.dirname(__dirname), '../.env');
dotenv.config({ path: envFilePath });

export default cleanEnv(process.env, {
  PORT: port(),
  JWT_SECRET: str(),
  SMTP_MAIL: str(),
  SMTP_PASSWORD: str(),
});
