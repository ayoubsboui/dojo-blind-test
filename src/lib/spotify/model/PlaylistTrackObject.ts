import { PlaylistUserObject } from "./PlaylistUserObject";

export type PlaylistTrackObject = {
  added_at?: string;
  added_by?: PlaylistUserObject;
  is_local?: boolean;
  track?: unknown;
};