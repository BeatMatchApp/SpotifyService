import cors from 'cors';
import express, { Express } from 'express';
import cookieParser from 'cookie-parser';
import BaseRouter from './routes/index';
import { envVariables } from './config/config';

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

    app.use((req, _res, next) => {
      console.log('Incoming request:', req.method, req.originalUrl);
      next();
    });
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
