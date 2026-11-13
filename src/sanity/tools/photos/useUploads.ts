import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { SanityClient } from "sanity";

import { insertPhoto, randomKey } from "./api";
import { prepareImage } from "./prepareImage";
import { isUploadActive, type Album, type AlbumPhoto, type Upload } from "./types";

/** Three at a time: fast on good Wi-Fi, gentle on a phone connection, far below Sanity's rate limit. */
const CONCURRENCY = 3;

type Subscription = { unsubscribe: () => void };

export function isPhotoFile(file: File) {
  return file.type.startsWith("image/") || /\.(heic|heif)$/i.test(file.name);
}

/**
 * The upload queue. Each file is prepared (date taken, resize), uploaded as a
 * Sanity image asset with live progress, then appended to its album. A file
 * that is already in the album is skipped (Sanity gives identical files the
 * same asset id). Failed files stay in the queue for "Try again".
 *
 * `updateAlbum` lets a saved photo appear in the grid straight away, before
 * the albums are fetched again.
 */
export function useUploads(
  client: SanityClient,
  albums: Album[] | null,
  updateAlbum: (albumId: string, change: (album: Album) => Album) => void
) {
  const [uploads, setUploads] = useState<Upload[]>([]);
  const queue = useRef<Upload[]>([]);
  const running = useRef(0);
  const subscriptions = useRef(new Map<string, Subscription>());
  const albumsRef = useRef(albums);
  const updateRef = useRef(updateAlbum);
  const addedAssets = useRef(new Map<string, Set<string>>());

  useEffect(() => {
    albumsRef.current = albums;
    updateRef.current = updateAlbum;
  }, [albums, updateAlbum]);

  const runner = useMemo(() => {
    const patch = (id: string, change: Partial<Upload>) => {
      queue.current = queue.current.map((u) => (u.id === id ? { ...u, ...change } : u));
      setUploads(queue.current);
    };

    const knownAssets = (albumId: string) => {
      let set = addedAssets.current.get(albumId);
      if (!set) {
        set = new Set();
        addedAssets.current.set(albumId, set);
      }
      return set;
    };

    const run = async (upload: Upload) => {
      let claimedAsset: string | null = null;
      try {
        const prepared = await prepareImage(upload.file);
        patch(upload.id, { status: "uploading" });

        const asset = await new Promise<{ _id: string }>((resolve, reject) => {
          const subscription = client.observable.assets
            .upload("image", prepared.body, { filename: prepared.filename })
            .subscribe({
              next: (event) => {
                if (event.type === "progress" && event.stage === "upload") {
                  patch(upload.id, { percent: Math.min(99, Math.round(event.percent)) });
                }
                if (event.type === "response") resolve(event.body.document);
              },
              error: reject,
            });
          subscriptions.current.set(upload.id, subscription);
        });
        subscriptions.current.delete(upload.id);

        const known = knownAssets(upload.albumId);
        const album = albumsRef.current?.find((a) => a._id === upload.albumId);
        const alreadyThere =
          known.has(asset._id) || album?.photos?.some((p) => p.asset?._ref === asset._id);
        if (alreadyThere) {
          patch(upload.id, { status: "duplicate", percent: 100, assetId: asset._id });
          return;
        }
        known.add(asset._id);
        claimedAsset = asset._id;

        patch(upload.id, { status: "saving", percent: 100 });
        const photo = {
          _type: "image" as const,
          _key: randomKey(),
          asset: { _type: "reference" as const, _ref: asset._id },
          takenAt: prepared.takenAt,
        };
        // Uploads finish in any order; keep the order the files were picked in
        // by going in front of the next file of this batch that is already saved.
        const order = queue.current.findIndex((u) => u.id === upload.id);
        const nextSaved = queue.current
          .slice(order + 1)
          .find((u) => u.albumId === upload.albumId && u.status === "done" && u.photoKey);
        let saved = await insertPhoto(client, upload.albumId, photo, nextSaved?.photoKey ?? null).catch(
          () => null
        );
        // If that photo was removed meanwhile, the insert matched nothing: add at the end.
        if (!saved?.photos?.some((p) => p._key === photo._key)) {
          saved = await insertPhoto(client, upload.albumId, photo, null);
        }
        const savedPhotos = saved.photos ?? [];
        updateRef.current(upload.albumId, (album) => ({ ...album, photos: mergeSaved(album.photos, savedPhotos, photo) }));
        patch(upload.id, { status: "done", assetId: asset._id, photoKey: photo._key });
      } catch (err) {
        if (claimedAsset) knownAssets(upload.albumId).delete(claimedAsset);
        subscriptions.current.delete(upload.id);
        // A dismissed upload is gone from the queue; nothing to report.
        if (queue.current.some((u) => u.id === upload.id)) {
          patch(upload.id, { status: "failed", error: describeError(err) });
        }
      }
    };

    const pump = () => {
      while (running.current < CONCURRENCY) {
        const next = queue.current.find((u) => u.status === "waiting");
        if (!next) return;
        running.current += 1;
        patch(next.id, { status: "preparing", percent: 0, error: undefined });
        run(next).finally(() => {
          running.current -= 1;
          pump();
        });
      }
    };

    return { patch, pump };
  }, [client]);

  /** Queue files for an album. Returns how many were skipped because they are not photos. */
  const addFiles = useCallback(
    (files: FileList | File[], albumId: string) => {
      const list = Array.from(files);
      const photos = list.filter(isPhotoFile);
      const added: Upload[] = photos.map((file) => ({
        id: randomKey(),
        albumId,
        file,
        name: file.name,
        previewUrl: URL.createObjectURL(file),
        status: "waiting",
        percent: 0,
      }));
      queue.current = [...queue.current, ...added];
      setUploads(queue.current);
      runner.pump();
      return list.length - photos.length;
    },
    [runner]
  );

  const retry = useCallback(
    (id: string) => {
      runner.patch(id, { status: "waiting", percent: 0, error: undefined });
      runner.pump();
    },
    [runner]
  );

  const forget = useCallback((keep: (u: Upload) => boolean) => {
    for (const upload of queue.current) {
      if (keep(upload)) continue;
      subscriptions.current.get(upload.id)?.unsubscribe();
      subscriptions.current.delete(upload.id);
      if (upload.previewUrl) URL.revokeObjectURL(upload.previewUrl);
    }
    queue.current = queue.current.filter(keep);
    setUploads(queue.current);
  }, []);

  const dismiss = useCallback((id: string) => forget((u) => u.id !== id), [forget]);
  const clearFinished = useCallback(
    () => forget((u) => isUploadActive(u) || u.status === "failed"),
    [forget]
  );

  // Warn before closing the tab while photos are still on their way.
  const busy = uploads.some(isUploadActive);
  useEffect(() => {
    if (!busy) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [busy]);

  // Stop uploads and free previews when the tool closes.
  useEffect(() => {
    const subs = subscriptions.current;
    return () => {
      subs.forEach((s) => s.unsubscribe());
      queue.current.forEach((u) => u.previewUrl && URL.revokeObjectURL(u.previewUrl));
    };
  }, []);

  return { uploads, addFiles, retry, dismiss, clearFinished };
}

/**
 * Put a just-saved photo into the local album where the server put it,
 * keeping any local changes (captions being typed, removals) to the rest.
 */
function mergeSaved(local: AlbumPhoto[] | undefined, server: AlbumPhoto[], photo: AlbumPhoto) {
  const photos = local ?? [];
  if (photos.some((p) => p._key === photo._key)) return photos;
  const index = server.findIndex((p) => p._key === photo._key);
  const nextKey = server.slice(index + 1).find((p) => photos.some((q) => q._key === p._key))?._key;
  const at = nextKey ? photos.findIndex((p) => p._key === nextKey) : -1;
  return at >= 0 ? [...photos.slice(0, at), photo, ...photos.slice(at)] : [...photos, photo];
}

function describeError(err: unknown): string {
  const error = err as { statusCode?: number; message?: string } | undefined;
  const message = error?.message ?? "";
  if (error?.statusCode === 413) return "Too big to upload (over 100 MB)";
  if (/network|failed to fetch|timeout|timed out|aborted/i.test(message)) return "The connection dropped";
  if (error?.statusCode === 400 && /image/i.test(message)) return "This file isn't a photo we can read";
  if (/not found/i.test(message)) return "The album was deleted";
  return message || "Something went wrong";
}
