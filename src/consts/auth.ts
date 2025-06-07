import { Request, Response } from 'express';
import { HOUR, MONTH } from './general';


export interface UserCredentials {
  id: string;
  accessToken: string;
  refreshToken: string;
}


export const generateSpotifyHeaders = (req: Request) => {
  const tokens = getTokens(req);
  if (tokens.accessToken) {
    return {
      Authorization: `Bearer ${tokens.accessToken}`,
    };
  }
  return {};
};

export const getTokens = (req: Request) => {
  try {
    const userCredentialsHeader = req.headers['x-user-credentials'];

    if (userCredentialsHeader) {
      const userCredentials: UserCredentials = typeof userCredentialsHeader === 'string'
          ? JSON.parse(userCredentialsHeader)
          : userCredentialsHeader;

      return {
        accessToken: userCredentials.accessToken,
        refreshToken: userCredentials.refreshToken,
      };
    }

    const accessToken = req.cookies.spotify_access_token;
    const refreshToken = req.cookies.spotify_refresh_token;

    return {
      accessToken,
      refreshToken,
    };
  } catch (error) {
    console.error('Error parsing user credentials:', error);
    return {
      accessToken: undefined,
      refreshToken: undefined,
    };
  }
};

export const getTokenUrlRequestHeaders = () => {
  return {
    'Content-Type': 'application/x-www-form-urlencoded',
  };
};
