import { TrackDetails } from './Track';

export interface Playlist {
  id: string;
  name: string;
  tracks: TrackDetails[];
  url: string;
  imageUrl: string;
}
