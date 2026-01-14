import { ImageObject } from "./ImageObject";

export type ArtistObject = {
  external_urls?: ;
  followers?: ;
  genres?: string[];
  href?: string;
  id?: string;
  images?: ImageObject[];
  name?: string;
  popularity?: number;
  type?: "artist";
  uri?: string;
};