import { TrackSpotifyDetails} from './Track';

export interface Playlist {
  id: string;
  name: string;
  tracks: TrackSpotifyDetails[];
  url: string;
  imageUrl: string;
}
