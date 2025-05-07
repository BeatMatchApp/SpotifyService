import axios from 'axios';
import { Request, Response } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import { generateSpotifyHeaders } from '../consts/auth';
import { envVariables } from '../config/config';

const CLIENT_ID = envVariables.clientId;
const CLIENT_SECRET = envVariables.clientSecret;

export const getArtists = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString(
      'base64'
    );

    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      'grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${credentials}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const access_token = response.data.access_token;

    const artist: string = encodeURIComponent(req.body.query);

    const response2 = await axios.get(
      `${SPOTIFY_API_URL}/search?q=${artist}&type=artist&limit=10`,
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const data = await response2.data;

    const artists = data.artists.items
      .map((artist: any) => artist.name)
      .filter((name: string) =>
        name.toLowerCase().includes(artist.toLowerCase())
      );

    res.json(artists);
  } catch (error) {
    res.status(500).json({
      error: `Error searching artist: ${error.response?.data || error}`,
    });
  }
};
