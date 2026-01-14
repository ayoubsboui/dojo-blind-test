import { DeviceObject } from "./DeviceObject";
import { ContextObject } from "./ContextObject";
import { DisallowsObject } from "./DisallowsObject";

export type CurrentlyPlayingContextObject = {
  device?: DeviceObject;
  repeat_state?: string;
  shuffle_state?: boolean;
  context?: ContextObject;
  timestamp?: number;
  progress_ms?: number;
  is_playing?: boolean;
  item?: unknown;
  currently_playing_type?: string;
  actions?: DisallowsObject;
};