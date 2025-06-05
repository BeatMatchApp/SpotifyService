import axios from 'axios';
import { Request, Response } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import {
  SpotifyArtist,
  SpotifySearchResponse,
  SpotifyTrack,
} from '../models/interfaces/SpotifySearch';
import { TrackDetails } from '../models/interfaces/Track';
import { generateSpotifyHeaders } from '../consts/auth';

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
    const trackUri: string | null = await getTrackUri(req, {
      songName,
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

const getTrackUri = async (
  req: Request,
  trackDetails: TrackDetails
): Promise<string | null> => {
  const { songName, artist } = trackDetails;

  try {
    const response = await axios.get<SpotifySearchResponse>(
      `${SPOTIFY_API_URL}/search?q=${encodeURIComponent(
        `track:${songName} artist:${artist}`
      )}&type=track&limit=5`,
      { headers: generateSpotifyHeaders(req) }
    );

    const posibbleSongsResponse: SpotifySearchResponse = response.data;

    const chosenTrackUri: SpotifyTrack[] =
      posibbleSongsResponse.tracks.items.filter(
        (item: SpotifyTrack) =>
          item.name.toLowerCase() === songName.toLowerCase() &&
          item.artists
            .map((artist: SpotifyArtist) => artist.name.toLowerCase())
            .includes(artist.toLowerCase())
      );

    return chosenTrackUri?.[0]?.uri;
  } catch (error) {
    throw new Error(`Error searching song: ${error.response?.data || error}`);
  }
};
