import { ImageObject } from "./ImageObject";

export type AlbumBase = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: ;
  type: string;
  uri: string;
};