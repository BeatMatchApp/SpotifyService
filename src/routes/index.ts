import { Router } from 'express';
import loginRoute from './login';
import userRoute from './/userDetails';
import playlistRoute from './playlist';
import generalRoute from './general';

const baseRouter = Router();

baseRouter.use('/', loginRoute);
baseRouter.use('/users', userRoute);
baseRouter.use('/playlists', playlistRoute);
baseRouter.use('/general', generalRoute);

export default baseRouter;
