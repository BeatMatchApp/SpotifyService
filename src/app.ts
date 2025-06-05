import cors from 'cors';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import BaseRouter from './routes/index';
import { callback } from './controllers/auth';
import { envVariables } from './config/config';

const createServer = async (): Promise<Express> => {
  try {
    const app = express();

    app.use(cors({ origin: envVariables.beatMatchURL, credentials: true }));
    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.use('/callback', callback);
    app.use('/spotifyAPI', BaseRouter);

    return app;
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`);
  }
};

export default createServer;
