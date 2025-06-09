import { Playlist } from '../models/interfaces/Playlist';

export const simplifyPlaylist = (spotifyPlaylist): Playlist => {
  return {
    id: spotifyPlaylist.id,
    name: spotifyPlaylist.name,
    tracks: spotifyPlaylist.tracks?.items?.map((item) => {
      const track = item.track;
      return {
        name: track.name,
        artist: track.artists[0]?.name || 'Unknown Artist',
      };
    }) || [],
    imageUrl: spotifyPlaylist.images?.[0]?.url || '',
    url: spotifyPlaylist.external_urls?.spotify || '',
  };
};

export const simplifyPlaylists = (spotifyPlaylists: any[]): Partial<Playlist>[] => {
  return spotifyPlaylists.map((playlist) => ({
    id: playlist.id,
    name: playlist.name,
    tracks: [],
    imageUrl: playlist.images?.[0]?.url || '',
    url: playlist.external_urls?.spotify || '',
  }));
};
