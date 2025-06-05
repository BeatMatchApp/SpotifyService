import dotenv from 'dotenv';

dotenv.config();

export const envVariables = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '5000'),
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectURI: process.env.SPOTIFY_REDIRECT_URI,
  beatMatchURL: process.env.BEATMATCH_SERVER_URL,
  secureCookie: process.env.SECURE_COOKIE || false,
};
