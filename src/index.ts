import 'reflect-metadata';
import express from 'express';
import bodyParser from 'body-parser';
import { createConnection, Connection } from 'typeorm';
import identifyRouter from './routes/identify';
import { Contact } from './entity/contact';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(bodyParser.json());

const initializeApp = async () => {
  try {
    const connection: Connection = await createConnection({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      synchronize: true,
      logging: false,
      entities: [Contact],
      migrations: [],
      subscribers: [],
    });

    console.log('Database connection established');

    // Mount API routes
    app.use('/api', identifyRouter(connection));

    // Start server
    const PORT = process.env.PORT || 8080;
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Database connection error:', error);
  }
};

initializeApp();

export default app;
