import type { SanityClient } from "sanity";

import type { Album, AlbumPhoto, CoverImage } from "./types";

/**
 * Reads and writes for the Photos tool.
 *
 * The tool edits the PUBLISHED album documents directly, so every change is
 * live on the site as soon as it saves (the revalidation webhook fires on
 * published mutations). There is no Publish step for the admin to forget.
 * If the regular editor holds a draft of the same album, the tool says so,
 * because publishing that draft later would overwrite these changes.
 */

export const API_VERSION = "2025-09-15";

export const ALBUMS_QUERY = `*[
  _type == "galleryAlbum" &&
  !(_id in path("drafts.**")) &&
  !(_id in path("versions.**"))
] | order(coalesce(date, _createdAt) desc){
  _id, _rev, _createdAt, title, date, description, shareUrl, hideFromWebsite,
  highlightImage, photos,
  "hasDraft": count(*[_id == "drafts." + ^._id]) > 0
}`;

export const LISTEN_QUERY = `*[_type == "galleryAlbum"]`;

const photoPath = (key: string) => `photos[_key=="${key}"]`;

export function randomKey() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function isShown(album: Pick<Album, "hideFromWebsite">) {
  return album.hideFromWebsite !== true;
}

/**
 * The image the Gallery page shows as the album's banner: the cover image if
 * one is set (it may be a photo outside the album), otherwise the first photo.
 * Mirrors the logic in src/app/(frontend)/gallery/page.tsx.
 */
export function coverImage(album: Album): CoverImage | AlbumPhoto | null {
  if (album.highlightImage?.asset) return album.highlightImage;
  return album.photos?.[0] ?? null;
}

/** Key of the album photo that is the cover, or null when the cover is a separate image. */
export function coverKey(album: Album): string | null {
  const photos = album.photos ?? [];
  const ref = album.highlightImage?.asset?._ref;
  if (!ref) return photos[0]?._key ?? null;
  return photos.find((photo) => photo.asset?._ref === ref)?._key ?? null;
}

/** True when any of these photos is the album's cover image. */
export function includesCover(album: Album, photos: AlbumPhoto[]) {
  const ref = album.highlightImage?.asset?._ref;
  return !!ref && photos.some((photo) => photo.asset?._ref === ref);
}

export function createAlbum(client: SanityClient) {
  return client.create({
    _type: "galleryAlbum",
    title: "Untitled album",
    hideFromWebsite: true,
    photos: [],
  });
}

type AlbumField = "title" | "date" | "description" | "shareUrl" | "hideFromWebsite";

export function setAlbumField(
  client: SanityClient,
  albumId: string,
  field: AlbumField,
  value: string | boolean | undefined
) {
  const patch = client.patch(albumId);
  const empty = value === undefined || value === "";
  return (empty ? patch.unset([field]) : patch.set({ [field]: value })).commit();
}

/** Add a photo before `beforeKey`, or at the end. Resolves to the updated album. */
export function insertPhoto(
  client: SanityClient,
  albumId: string,
  photo: AlbumPhoto,
  beforeKey: string | null
) {
  const patch = client.patch(albumId).setIfMissing({ photos: [] });
  return (
    beforeKey ? patch.insert("before", photoPath(beforeKey), [photo]) : patch.append("photos", [photo])
  ).commit<{ photos?: AlbumPhoto[] }>({ autoGenerateArrayKeys: false });
}

export function setPhotoField(
  client: SanityClient,
  albumId: string,
  key: string,
  field: "caption" | "alt",
  value: string
) {
  const patch = client.patch(albumId);
  const path = `${photoPath(key)}.${field}`;
  return (value ? patch.set({ [path]: value }) : patch.unset([path])).commit();
}

/** Remove photos; `clearCover` also drops the cover when it was one of them, so the site never shows a deleted photo. */
export function removePhotos(
  client: SanityClient,
  albumId: string,
  keys: string[],
  clearCover = false
) {
  const paths = keys.map(photoPath);
  return client
    .patch(albumId)
    .unset(clearCover ? [...paths, "highlightImage"] : paths)
    .commit();
}

/**
 * Move one photo before another (or to the end when `beforeKey` is null).
 * Unset + insert in one patch, so photos uploaded meanwhile are never lost.
 */
export function movePhoto(
  client: SanityClient,
  albumId: string,
  photo: AlbumPhoto,
  beforeKey: string | null
) {
  const patch = client.patch(albumId).unset([photoPath(photo._key)]);
  return (
    beforeKey
      ? patch.insert("before", photoPath(beforeKey), [photo])
      : patch.insert("after", "photos[-1]", [photo])
  ).commit({ autoGenerateArrayKeys: false });
}

/** Replace the whole order, but only if nobody changed the album since we read it. */
export function setPhotoOrder(client: SanityClient, album: Album, photos: AlbumPhoto[]) {
  return client
    .patch(album._id)
    .ifRevisionId(album._rev)
    .set({ photos })
    .commit({ autoGenerateArrayKeys: false });
}

export function setCover(client: SanityClient, albumId: string, photo: AlbumPhoto | null) {
  if (!photo?.asset) return client.patch(albumId).unset(["highlightImage"]).commit();
  const cover: CoverImage = { _type: "image", asset: photo.asset };
  if (photo.hotspot) cover.hotspot = photo.hotspot;
  if (photo.crop) cover.crop = photo.crop;
  if (photo.alt) cover.alt = photo.alt;
  return client.patch(albumId).set({ highlightImage: cover }).commit();
}

export function restoreCover(client: SanityClient, albumId: string, cover: CoverImage | undefined) {
  const patch = client.patch(albumId);
  return (cover ? patch.set({ highlightImage: cover }) : patch.unset(["highlightImage"])).commit();
}

/** Move photos to another album. New keys keep them unique in the target. */
export function movePhotosToAlbum(
  client: SanityClient,
  fromId: string,
  toId: string,
  photos: AlbumPhoto[],
  clearCover = false
) {
  const moved = photos.map((photo) => ({ ...photo, _key: randomKey() }));
  const paths = photos.map((photo) => photoPath(photo._key));
  return client
    .transaction()
    .patch(fromId, (p) => p.unset(clearCover ? [...paths, "highlightImage"] : paths))
    .patch(toId, (p) =>
      p.setIfMissing({ photos: [] }).append("photos", moved)
    )
    .commit({ autoGenerateArrayKeys: false })
    .then(() => moved);
}

/**
 * Undo for removals and moves: put the earlier photos back in their earlier
 * order, keeping anything that was uploaded since at the end.
 */
export async function restorePhotos(client: SanityClient, albumId: string, earlier: AlbumPhoto[]) {
  const current = await client.fetch<Pick<Album, "_id" | "_rev" | "photos"> | null>(
    `*[_id == $id][0]{_id, _rev, photos}`,
    { id: albumId }
  );
  if (!current) return;
  const earlierKeys = new Set(earlier.map((photo) => photo._key));
  const added = (current.photos ?? []).filter((photo) => !earlierKeys.has(photo._key));
  return client
    .patch(albumId)
    .ifRevisionId(current._rev)
    .set({ photos: [...earlier, ...added] })
    .commit({ autoGenerateArrayKeys: false });
}
