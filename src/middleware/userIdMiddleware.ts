import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { generateSpotifyHeaders } from '../consts/auth';
import {SPOTIFY_API_URL} from "../consts/spotify";

export const userIdMiddleware = async (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    if (!req.headers['x-user-credentials']) {
      return next();
    }
    const headers = generateSpotifyHeaders(req);
    
    if (!headers.Authorization) {
      console.error('No authorization token found in headers');
      return next();
    }
    const response = await axios.get(`${SPOTIFY_API_URL}/me`, { headers });
    
    if (response.data && response.data.id) {
      req.spotifyUserId = response.data.id;
    }

    next();
  } catch (error) {
    console.error('Error in userIdMiddleware:', error);
    next();
  }
};
