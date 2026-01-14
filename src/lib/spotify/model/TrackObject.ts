import { ArtistObject } from "./ArtistObject";

export type TrackObject = {
  album?: ;
  artists?: ArtistObject[];
  available_markets?: string[];
  disc_number?: number;
  duration_ms?: number;
  explicit?: boolean;
  external_ids?: ;
  external_urls?: ;
  href?: string;
  id?: string;
  is_playable?: boolean;
  linked_from?: ;
  restrictions?: ;
  name?: string;
  popularity?: number;
  preview_url?: string;
  track_number?: number;
  type?: "track";
  uri?: string;
  is_local?: boolean;
};