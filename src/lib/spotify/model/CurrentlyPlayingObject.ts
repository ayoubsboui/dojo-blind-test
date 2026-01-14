import { ContextObject } from "./ContextObject";
import { DisallowsObject } from "./DisallowsObject";

export type CurrentlyPlayingObject = {
  context?: ContextObject;
  timestamp?: number;
  progress_ms?: number;
  is_playing?: boolean;
  item?: unknown;
  currently_playing_type?: string;
  actions?: DisallowsObject;
};