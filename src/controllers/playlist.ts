import axios from 'axios';
import { Request, Response } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import { generateSpotifyHeaders } from '../consts/auth';
import { getTrackUri } from '../functions/tracks';
import { TrackDetails } from '../models/interfaces/Track';

export const createPlaylist = async (req: Request, res: Response) => {
  const { userId, playlistName } = req.body;

  try {
    const response = await axios.post(
      `${SPOTIFY_API_URL}/users/${userId}/playlists`,
      { name: playlistName, public: false },
      { headers: generateSpotifyHeaders(req) }
    );

    res.json(response.data);
  } catch (error) {
    res
      .status(400)
      .json({ error: `Failed to create playlist for user ${userId}` });
  }
};

export const addSong = async (req: Request, res: Response) => {
  const { playlistId, songName, artist } = req.body;

  if (!playlistId || !songName || !artist) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  try {
    const trackUri: string = await getTrackUri(req, {
      name: songName,
      artist,
    });

    if (trackUri) {
      const response = await axios.post(
        `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
        { uris: [trackUri], public: false },
        { headers: generateSpotifyHeaders(req) }
      );

      res.json({ success: true, message: 'Song added!', data: response.data });
    } else {
      res.json({ success: false, message: "Song wasn't found", data: null });
    }
  } catch (error) {
    console.error('Error adding song:', error.response?.data || error);
    res.status(400).json({ error: `Failed to add song to playlist` });
  }
};

export const validatePlaylist = async (req: Request, res: Response) => {
  const { songsList, accessToken } = req.body;

  if (!Array.isArray(songsList)) {
    return res.status(400).json({ error: 'Missing or invalid songs list' });
  }

  try {
    const validationResults = await Promise.all(
      songsList.map(async (song: TrackDetails) => {
        const trackUri: string | null = await getTrackUri(
          req,
          song,
          accessToken
        );

        return trackUri ? song : null;
      })
    );

    const validSongs = validationResults.filter(
      (song: TrackDetails) => song !== null
    );

    res.json({ data: validSongs });
  } catch (error) {
    console.error('Error validating playlist:', error);
    res.status(500).json({ error: 'Failed to validate playlist' });
  }
};
