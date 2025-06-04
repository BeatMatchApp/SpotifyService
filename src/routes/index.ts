import { Router } from 'express';
import authRoute from './auth';
import userRoute from './/userDetails';
import playlistRoute from './playlist';
import generalRoute from './general';

const baseRouter = Router();

baseRouter.use('/', authRoute);
baseRouter.use('/users', userRoute);
baseRouter.use('/playlists', playlistRoute);
baseRouter.use('/general', generalRoute);

export default baseRouter;
