import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import BaseRouter from './routes/index';
import { envVariables } from './config/config';

const cors = require('cors');

const createServer = async (): Promise<Express> => {
  try {
    const app = express();

    const allowedOrigins = [
      envVariables.beatMatchServerURL,
      envVariables.beatMatchClientURL,
    ];

    app.use(
      cors({
        origin: (origin, callback) => {
          if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
        credentials: true,
      })
    );

    app.use(express.json());
    app.use(cookieParser());
    app.use(express.urlencoded({ extended: true }));

    app.use('/spotifyAPI', BaseRouter);

    return app;
  } catch (error) {
    throw new Error(`Error initializing app: ${error.message}`);
  }
};

export default createServer;
