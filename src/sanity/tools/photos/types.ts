/** A photo as stored in a gallery album's `photos` array. */
export type AlbumPhoto = {
  _key: string;
  _type: "image";
  asset?: { _type: "reference"; _ref: string };
  hotspot?: Record<string, unknown>;
  crop?: Record<string, unknown>;
  alt?: string;
  caption?: string;
  takenAt?: string;
};

export type CoverImage = {
  _type?: "image";
  asset?: { _type?: "reference"; _ref: string };
  hotspot?: Record<string, unknown>;
  crop?: Record<string, unknown>;
  alt?: string;
};

/** A published gallery album, as the Photos tool reads it. */
export type Album = {
  _id: string;
  _rev: string;
  _createdAt: string;
  title?: string;
  date?: string;
  description?: string;
  shareUrl?: string;
  /** Unset or false means the album is on the Gallery page. */
  hideFromWebsite?: boolean;
  highlightImage?: CoverImage;
  photos?: AlbumPhoto[];
  /** True when the regular editor holds unpublished changes for this album. */
  hasDraft: boolean;
};

export type UploadStatus =
  | "waiting"
  | "preparing"
  | "uploading"
  | "saving"
  | "done"
  | "duplicate"
  | "failed";

/** One file in the upload queue. */
export type Upload = {
  id: string;
  albumId: string;
  file: File;
  name: string;
  /** Local preview (object URL); null when the browser cannot show the file, e.g. HEIC in Chrome. */
  previewUrl: string | null;
  status: UploadStatus;
  percent: number;
  error?: string;
  /** Set once Sanity has stored the file. */
  assetId?: string;
  /** Key of the photo in the album, once it is saved there. */
  photoKey?: string;
};

export const isUploadActive = (upload: Upload) =>
  upload.status === "waiting" ||
  upload.status === "preparing" ||
  upload.status === "uploading" ||
  upload.status === "saving";
