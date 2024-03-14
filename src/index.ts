import express from 'express';
import env from './utils/validateEnv';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Event } from './entity/Event';
import routes from './routes/index';
import { createConnection } from 'typeorm';
import { runCronJob } from './utils/cron-job';

const app = express();
app.use(express.json());
app.use('/api/v1', routes);

createConnection({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'madhav2058',
  database: 'event',
  entities: [User, Event],
  synchronize: true,
  // logging: true,
})
  .then(() => {
    console.log('Database connected');
    runCronJob();
    app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('Error connecting database', err);
  });
