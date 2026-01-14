import { CopyrightObject } from "./CopyrightObject";
import { ImageObject } from "./ImageObject";

export type ShowBase = {
  available_markets: string[];
  copyrights: CopyrightObject[];
  description: string;
  html_description: string;
  explicit: boolean;
  external_urls: ;
  href: string;
  id: string;
  images: ImageObject[];
  is_externally_hosted: boolean;
  languages: string[];
  media_type: string;
  name: string;
  publisher: string;
  type: string;
  uri: string;
  total_episodes: number;
};