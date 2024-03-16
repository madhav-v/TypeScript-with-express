import { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  swaggerDefinition: {
    openapi: '3.0.0',
    info: {
      title: 'Event App',
      version: '1.0.0',
      description: 'Event App documentation',
    },
    basePath: '/',
  },
  apis: ['./src/routes/*.ts'],
};

export default swaggerOptions;
