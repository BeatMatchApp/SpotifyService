import { Request, Response } from 'express';
import querystring from 'querystring';
import {
  SPOTIFY_AUTH_URL,
  SPOTIFY_TOKEN_URL,
  USER_GRANT_PERMISSIONS,
} from '../consts/spotify';
import axios from 'axios';
import { envVariables } from '../config/config';
import { getTokenUrlRequestHeaders } from '../consts/auth';

const CLIENT_ID = envVariables.clientId;
const CLIENT_SECRET = envVariables.clientSecret;
const REDIRECT_URI = envVariables.redirectURI;

export const login = (_req: Request, res: Response) => {
  console.log('login spotify before redirect. redirect to:', SPOTIFY_AUTH_URL);

  try {
    const authQuery = querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      redirect_uri: REDIRECT_URI,
      scope: USER_GRANT_PERMISSIONS.join(' '),
    });

    console.log('auth query to spotify: ', authQuery);

    res.redirect(`${SPOTIFY_AUTH_URL}?${authQuery}`);
  } catch (err) {
    console.log('error', err);
  }
};

export const getAuthTokens = async (req: Request, res: Response) => {
  const code = req.body.code;

  if (!code) {
    return res.status(400).json({ error: 'Missing code' });
  }

  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      querystring.stringify({
        grant_type: 'authorization_code',
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: getTokenUrlRequestHeaders() }
    );

    const { access_token, refresh_token } = response.data;
    console.log('access_token', access_token);

    res
      .status(200)
      .json({ accessToken: access_token, refreshToken: refresh_token });

    return;
  } catch (error) {
    res.status(400).json({ error: "Failed to get spotify's access token" });
  }
};

export async function refreshToken(req: Request, res: Response) {
  const refreshToken = req.body.refreshToken;

  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      {
        headers: getTokenUrlRequestHeaders(),
      }
    );

    const { access_token } = response.data;

    res.status(200).json({ accessToken: access_token });
  } catch (error) {
    res.status(401).json({ error: "Failed to refresh spotify's access token" });
  }
}
