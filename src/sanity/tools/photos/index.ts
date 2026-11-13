import type { Tool } from "sanity";
import { ImagesIcon } from "@sanity/icons/Images";

import { PhotosTool } from "./PhotosTool";

/** The "Photos" tab in Studio's top bar, at /studio/photos. */
export const photosTool = (): Tool => ({
  name: "photos",
  title: "Photos",
  icon: ImagesIcon,
  component: PhotosTool,
});
