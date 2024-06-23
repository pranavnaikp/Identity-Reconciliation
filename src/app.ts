import 'reflect-metadata';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import { createConnection, Connection } from 'typeorm';
import identifyRouter from './routes/identify';
import { Contact } from './entity/contact';

const app = express();
app.use(bodyParser.json());

const initializeApp = async () => {
  try {
    const connection: Connection = await createConnection({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: '123456',
      database: 'identity_reconciliation',
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
