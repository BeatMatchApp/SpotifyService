import axios from 'axios';
import { Request, Response } from 'express';
import { SPOTIFY_API_URL } from '../consts/spotify';
import { generateSpotifyHeaders } from '../consts/auth';
import { Playlist } from '../models/interfaces/Playlist';
import { getTrackUri } from '../functions/tracks';
import { TrackDetails, TrackSpotifyDetails } from '../models/interfaces/Track';

export const createPlaylist = async (req: Request, res: Response) => {
  const spotifyUserId = req.spotifyUserId;
  const { playlistName, songs } = req.body;

  try {
    const createResponse = await axios.post(
      `${SPOTIFY_API_URL}/users/${spotifyUserId}/playlists`,
      { name: playlistName, public: false },
      { headers: generateSpotifyHeaders(req) }
    );

    const playlistId = createResponse.data.id;

    if (Array.isArray(songs) && songs.length) {
      const trackUris: string[] = songs.map(
        (song: TrackSpotifyDetails) => song.trackUri
      );

      await axios.post(
        `${SPOTIFY_API_URL}/playlists/${playlistId}/tracks`,
        { uris: trackUris },
        { headers: generateSpotifyHeaders(req) }
      );
    }

    res.json(createResponse.data);
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
    const trackUriPromises = songs.map(async (song: TrackDetails) => {
      return await getTrackUri(req, song);
    });

    const trackUris = (await Promise.all(trackUriPromises)).filter(
      (uri): uri is string => uri !== null
    );

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

    res.json({
      success: true,
      message: `${successCount} songs added successfully${
        failedCount > 0 ? `, ${failedCount} songs not found` : ''
      }`,
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
    const validationResults: TrackSpotifyDetails[] = await Promise.all(
      songsList.map(
        async (song: TrackDetails): Promise<TrackSpotifyDetails | null> => {
          const trackUri: string | null = await getTrackUri(req, song);

          return trackUri ? { ...song, trackUri } : null;
        }
      )
    );

    const validSongs: TrackSpotifyDetails[] = validationResults.filter(
      (song: TrackSpotifyDetails) => song !== null
    );

    res.json({ data: validSongs });
  } catch (error) {
    console.error('Error validating playlist:', error);
    res.status(500).json({ error: 'Failed to validate playlist' });
  }
};

export const getPlaylist = async (req: Request, res: Response) => {
  const { playlistId } = req.params;

  if (!playlistId) {
    return res.status(400).json({ error: 'Missing playlist ID' });
  }

  try {
    const response = await axios.get(
      `${SPOTIFY_API_URL}/playlists/${playlistId}`,
      { headers: generateSpotifyHeaders(req) }
    );

    // Transform the Spotify response into our simplified Playlist format
    const spotifyPlaylist = response.data;
    const simplifiedPlaylist: Playlist = {
      id: spotifyPlaylist.id,
      name: spotifyPlaylist.name,
      tracks: spotifyPlaylist.tracks.items.map((item) => {
        const track = item.track;
        return {
          songName: track.name,
          artist: track.artists[0]?.name || 'Unknown Artist',
        };
      }),
    };

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

    const simplifiedPlaylists = response.data.items.map((playlist) => ({
      id: playlist.id,
      name: playlist.name,
      tracks: [],
    }));

    res.json(simplifiedPlaylists);
  } catch (error) {
    console.error('Error getting playlists:', error);
    res
      .status(error.response?.status || 400)
      .json({ error: `Failed to get playlists for user ${spotifyUserId}` });
  }
};
