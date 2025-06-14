import axios from 'axios';
import { Request, Response } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import { generateSpotifyHeaders } from '../consts/auth';
import { getTrackUri } from '../functions/tracks';
import { TrackDetails, TrackSpotifyDetails } from '../models/interfaces/Track';
import { simplifyPlaylist, simplifyPlaylists } from '../utils/playlist';

export const createPlaylist = async (req: Request, res: Response) => {
  const spotifyUserId = req.spotifyUserId;
  const { playlistName, songs } = req.body;

  try {
    const createResponse = await axios.post(
      `${SPOTIFY_API_URL}/users/${spotifyUserId}/playlists`,
      { name: playlistName },
      { headers: generateSpotifyHeaders(req) }
    );

    const playlistsResponse = createResponse.data;

    if (Array.isArray(songs) && songs.length) {
      const trackUris: string[] = songs.map(
        (song: TrackSpotifyDetails) => song.trackUri
      );

      await axios.post(
        `${SPOTIFY_API_URL}/playlists/${playlistsResponse.id}/tracks`,
        { uris: trackUris },
        { headers: generateSpotifyHeaders(req) }
      );
    }

    const simplifiedPlaylist = simplifyPlaylist(playlistsResponse);

    res.json(simplifiedPlaylist);
  } catch (error) {
    console.error('Error creating playlist:', error);
    res
      .status(400)
      .json({ error: `Failed to create playlist for user ${spotifyUserId}` });
  }
};

export const addSongs = async (req: Request, res: Response) => {
  const { playlistId, songs } = req.body;

  if (!playlistId || !Array.isArray(songs) || songs.length === 0) {
    return res.status(400).json({ error: 'Missing or invalid parameters.' });
  }

  try {
    const trackUris = songs.map((song: TrackSpotifyDetails) => song.trackUri)
      .filter((uri) => uri !== null && uri !== undefined);

    if (trackUris.length === 0) {
      return res.json({
        success: false,
        message: 'No valid songs found',
        data: null,
      });
    }

    const response = await axios.post(
      `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
      { uris: trackUris },
      { headers: generateSpotifyHeaders(req) }
    );

    const successCount = trackUris.length;
    const failedCount = songs.length - successCount;

    const message = `${successCount} songs added successfully${failedCount > 0 ? `, ${failedCount} songs not found` : ''}`

    res.json({
      success: true,
      message,
      data: response.data,
    });
  } catch (error) {
    console.error('Error adding songs:', error.response?.data || error);
    res.status(400).json({ error: `Failed to add songs to playlist` });
  }
};

export const validatePlaylist = async (req: Request, res: Response) => {
  const { songsList } = req.body;

  if (!Array.isArray(songsList)) {
    return res.status(400).json({ error: 'Missing or invalid songs list' });
  }

  try {
    const validationResults: (TrackSpotifyDetails | null)[] = await Promise.all(
      songsList.map(
        async (song: TrackDetails): Promise<TrackSpotifyDetails | null> => {
          const trackUri: string | null = await getTrackUri(req, song);

          return trackUri ? { ...song, trackUri } : null;
        }
      )
    );

    const validSongs: TrackSpotifyDetails[] = validationResults.filter(
      (song: TrackSpotifyDetails | null) => song !== null
    );

    res.json({ data: validSongs });
  } catch (error) {
    console.error('Error validating playlist:', error);
    res.status(500).json({ error: 'Failed to validate playlist' });
  }
};

export const getPlaylist = async (req: Request, res: Response) => {
  const { playlistId } = req.params;
  const spotifyUserId = req.spotifyUserId;

  if (!playlistId) {
    return res.status(400).json({ error: 'Missing playlist ID' });
  }
  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/playlists/${playlistId}`,
      { headers: generateSpotifyHeaders(req) }
    );

    if(response.data.owner.id !== spotifyUserId)
      return res.status(403).json({ error: 'You do not have access to this playlist' });

    const simplifiedPlaylist = simplifyPlaylist(response.data);

    res.json(simplifiedPlaylist);
  } catch (error) {
    console.error('Error getting playlist:', error);
    res
      .status(error.response?.status || 400)
      .json({ error: `Failed to get playlist ${playlistId}` });
  }
};

export const getPlaylists = async (req: Request, res: Response) => {
  const spotifyUserId = req.spotifyUserId;

  if (!spotifyUserId) {
    return res.status(400).json({ error: 'User ID not found' });
  }

  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/users/${spotifyUserId}/playlists`,
      { headers: generateSpotifyHeaders(req) }
    );
    const simplifiedPlaylists = simplifyPlaylists(response.data.items);
    res.json(simplifiedPlaylists);
  } catch (error) {
    console.error('Error getting playlists:', error);
    res
      .status(error.response?.status || 400)
      .json({ error: `Failed to get playlists for user ${spotifyUserId}` });
  }
};

export const updatePlaylist = async (req: Request, res: Response) => {
  const { playlistId, songs } = req.body;

  if (!playlistId || !Array.isArray(songs)) {
    return res.status(400).json({ error: 'Missing or invalid parameters.' });
  }

  try {
    const trackUris = songs.map((song: TrackSpotifyDetails) => song.trackUri)
      .filter((uri) => uri !== null && uri !== undefined);

    if (trackUris.length === 0) {
      return res.json({
        success: false,
        message: 'No valid songs found',
        data: null,
      });
    }

    const response = await axios.put(
      `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
      { uris: trackUris },
      { headers: generateSpotifyHeaders(req) }
    );

    res.json({
        ...response.data,
        tracks: songs,
    });
  } catch (error) {
    console.error('Error updating playlist:', error.response?.data || error);
    res.status(error.response?.status || 400).json({ error: 'Failed to update playlist' });
  }
};
