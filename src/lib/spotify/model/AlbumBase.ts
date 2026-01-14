import { ExternalUrlObject } from "./ExternalUrlObject";
import { ImageObject } from "./ImageObject";
import { AlbumRestrictionObject } from "./AlbumRestrictionObject";

export type AlbumBase = {
  album_type: string;
  total_tracks: number;
  available_markets: string[];
  external_urls: ExternalUrlObject;
  href: string;
  id: string;
  images: ImageObject[];
  name: string;
  release_date: string;
  release_date_precision: string;
  restrictions?: AlbumRestrictionObject;
  type: "album";
  uri: string;
};