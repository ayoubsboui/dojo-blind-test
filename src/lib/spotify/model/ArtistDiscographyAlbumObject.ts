import { SimplifiedAlbumObject } from "./SimplifiedAlbumObject";

export type ArtistDiscographyAlbumObject = SimplifiedAlbumObject & {
  album_group: string;
};