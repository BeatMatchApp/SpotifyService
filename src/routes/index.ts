import { Router } from 'express';
import loginRoute from './login';
import userRoute from './/userDetails';
import playlistRoute from './playlist';
import generalRoute from './general';
import { authMiddleware } from '../middlewares/authMiddleware';

const baseRouter = Router();

baseRouter.use('/', loginRoute);
baseRouter.use('/users', authMiddleware, userRoute);
baseRouter.use('/playlists', authMiddleware, playlistRoute);
baseRouter.use('/general', authMiddleware, generalRoute);

export default baseRouter;
