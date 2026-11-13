import { useCallback, useMemo, useRef, useState, type DragEvent } from "react";
import {
  Box,
  Button,
  Card,
  Dialog,
  Flex,
  Select,
  Spinner,
  Stack,
  Text,
  useMediaIndex,
} from "@sanity/ui";
import { Menu, MenuButton, MenuItem } from "@sanity/ui/menu";
import { useToast } from "@sanity/ui/toast";
import { AddIcon } from "@sanity/icons/Add";
import { ChevronDownIcon } from "@sanity/icons/ChevronDown";
import { UploadIcon } from "@sanity/icons/Upload";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { useClient } from "sanity";

import {
  API_VERSION,
  coverImage,
  coverKey,
  createAlbum,
  includesCover,
  isShown,
  movePhoto,
  movePhotosToAlbum,
  removePhotos,
  restoreCover,
  restorePhotos,
  setAlbumField,
  setCover,
  setPhotoField,
  setPhotoOrder,
} from "./api";
import { AlbumHeader } from "./AlbumHeader";
import { AlbumList } from "./AlbumList";
import { SelectionBar, UndoBar } from "./Bars";
import { DropZone } from "./DropZone";
import { PhotoDetails } from "./PhotoDetails";
import { PhotoGrid } from "./PhotoGrid";
import { UploadTray } from "./UploadTray";
import { useAlbums } from "./useAlbums";
import { useUploads } from "./useUploads";
import { isUploadActive, type Album, type AlbumPhoto, type CoverImage } from "./types";

const UNDO_MS = 15_000;
const hasFiles = (event: DragEvent) => Array.from(event.dataTransfer?.types ?? []).includes("Files");
const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

type UndoOffer = { message: string; run: () => Promise<unknown> };

/**
 * The "Photos" tab in Studio: albums on the left, the open album on the
 * right. Built for one job, getting an event's photos onto the Gallery page
 * with as little effort as possible, on a computer or a phone.
 */
export function PhotosTool() {
  const studioClient = useClient({ apiVersion: API_VERSION });
  // "raw" so the query can see whether an album also has a draft.
  const client = useMemo(() => studioClient.withConfig({ perspective: "raw" }), [studioClient]);
  const { albums, error, refresh, update } = useAlbums(client);
  const { uploads, addFiles, retry, dismiss, clearFinished } = useUploads(client, albums, update);
  const toast = useToast();
  const media = useMediaIndex();
  const showRail = media >= 3;
  const showSidePanel = media >= 4;

  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [detailKey, setDetailKey] = useState<string | null>(null);
  const [undo, setUndo] = useState<UndoOffer | null>(null);
  const [fileDrag, setFileDrag] = useState(false);
  const [creating, setCreating] = useState(false);
  const undoTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const album = albums?.find((a) => a._id === activeId) ?? albums?.[0] ?? null;
  const photos = useMemo(() => album?.photos ?? [], [album]);

  const imageBuilder = useMemo(() => createImageUrlBuilder(client), [client]);
  const thumb = useCallback(
    (image: AlbumPhoto | CoverImage, size: number) =>
      imageBuilder
        .image(image as SanityImageSource)
        .width(size)
        .height(size)
        .fit("crop")
        .auto("format")
        .url(),
    [imageBuilder]
  );

  const fail = useCallback(
    (what: string) => (err: Error) => {
      toast.push({ status: "error", title: `Couldn’t ${what}`, description: err?.message });
      refresh();
    },
    [toast, refresh]
  );

  /**
   * Offer Undo the moment something changes. Undo waits for the save to
   * finish before reverting it; if the save fails, the offer goes away.
   */
  const withUndo = <T,>(
    message: string,
    saving: Promise<T>,
    revert: (result: T) => Promise<unknown>,
    what: string
  ) => {
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndo({ message, run: () => saving.then(revert) });
    undoTimer.current = setTimeout(() => setUndo(null), UNDO_MS);
    saving.catch((err: Error) => {
      setUndo(null);
      fail(what)(err);
    });
  };

  const runUndo = () => {
    if (!undo) return;
    if (undoTimer.current) clearTimeout(undoTimer.current);
    setUndo(null);
    undo.run().then(refresh, fail("undo that"));
  };

  const resetView = () => {
    setSelectMode(false);
    setSelected(new Set());
    setDetailKey(null);
  };

  const openAlbum = (albumId: string) => {
    setActiveId(albumId);
    resetView();
  };

  const newAlbum = () => {
    setCreating(true);
    createAlbum(client)
      .then(async (doc) => {
        await refresh();
        openAlbum(doc._id);
      })
      .catch(fail("create the album"))
      .finally(() => setCreating(false));
  };

  const onFiles = (files: FileList) => {
    if (!album) return;
    const skipped = addFiles(files, album._id);
    if (skipped) {
      toast.push({
        status: "warning",
        title: `${plural(skipped, "file")} skipped`,
        description: "Only photos can be added to an album.",
      });
    }
  };

  // ---- Album fields -------------------------------------------------------

  const editAlbum = (target: Album, change: Partial<Album>, save: Promise<unknown>, what: string) => {
    update(target._id, (a) => ({ ...a, ...change }));
    save.catch(fail(what));
  };

  const showAlbum = (albumId: string, shown: boolean) => {
    const target = albums?.find((a) => a._id === albumId);
    if (!target) return;
    editAlbum(
      target,
      { hideFromWebsite: shown ? undefined : true },
      // Showing clears the flag rather than storing false, so the document stays tidy.
      setAlbumField(client, albumId, "hideFromWebsite", shown ? undefined : true),
      "change whether the album is shown"
    );
  };

  // ---- Photo actions --------------------------------------------------------

  const removeKeys = (keys: string[]) => {
    if (!album || keys.length === 0) return;
    const before = album.photos ?? [];
    const beforeCover = album.highlightImage;
    const removing = before.filter((p) => keys.includes(p._key));
    const clearCover = includesCover(album, removing);
    update(album._id, (a) => ({
      ...a,
      photos: (a.photos ?? []).filter((p) => !keys.includes(p._key)),
      highlightImage: clearCover ? undefined : a.highlightImage,
    }));
    setSelected(new Set());
    if (detailKey && keys.includes(detailKey)) setDetailKey(null);
    const albumId = album._id;
    withUndo(
      keys.length === 1 ? "Photo removed" : `${keys.length} photos removed`,
      removePhotos(client, albumId, keys, clearCover),
      async () => {
        await restorePhotos(client, albumId, before);
        if (clearCover) await restoreCover(client, albumId, beforeCover);
      },
      "remove the photo"
    );
  };

  const makeCover = (photo: AlbumPhoto) => {
    if (!album) return;
    const before = album.highlightImage;
    const albumId = album._id;
    update(albumId, (a) => ({ ...a, highlightImage: { _type: "image", asset: photo.asset } }));
    withUndo(
      "Cover photo changed",
      setCover(client, albumId, photo),
      () => restoreCover(client, albumId, before),
      "change the cover"
    );
  };

  /** Move a photo so it lands where `targetKey` is (after it when moving forward). */
  const reorder = (dragKey: string, targetKey: string) => {
    if (!album) return;
    const from = photos.findIndex((p) => p._key === dragKey);
    const to = photos.findIndex((p) => p._key === targetKey);
    if (from < 0 || to < 0 || from === to) return;
    const next = [...photos];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    const beforeKey = next[to + 1]?._key ?? null;
    update(album._id, (a) => ({ ...a, photos: next }));
    movePhoto(client, album._id, moved, beforeKey).catch(fail("move the photo"));
  };

  const nudge = (direction: -1 | 1) => {
    const [key] = Array.from(selected);
    const index = photos.findIndex((p) => p._key === key);
    const target = photos[index + direction];
    if (index < 0 || !target) return;
    reorder(key, target._key);
  };

  const sortByDate = (newestFirst: boolean) => {
    if (!album) return;
    const before = album.photos ?? [];
    const time = (p: AlbumPhoto) => (p.takenAt ? Date.parse(p.takenAt) : NaN);
    // Photos without a known date keep their order, after the dated ones.
    const sorted = before
      .map((photo, index) => ({ photo, index, t: time(photo) }))
      .sort((a, b) => {
        const aKnown = !Number.isNaN(a.t);
        const bKnown = !Number.isNaN(b.t);
        if (aKnown !== bKnown) return aKnown ? -1 : 1;
        if (!aKnown) return a.index - b.index;
        return newestFirst ? b.t - a.t : a.t - b.t;
      })
      .map((entry) => entry.photo);
    const albumId = album._id;
    update(albumId, (a) => ({ ...a, photos: sorted }));
    withUndo(
      "Sorted by date taken",
      setPhotoOrder(client, album, sorted),
      () => restorePhotos(client, albumId, before),
      "sort the album (it changed meanwhile, so try again)"
    );
  };

  const moveSelectedTo = (targetId: string) => {
    if (!album) return;
    const target = albums?.find((a) => a._id === targetId);
    const moving = photos.filter((p) => selected.has(p._key));
    if (!target || moving.length === 0) return;
    const before = album.photos ?? [];
    const beforeCover = album.highlightImage;
    const clearCover = includesCover(album, moving);
    const albumId = album._id;
    update(albumId, (a) => ({
      ...a,
      photos: (a.photos ?? []).filter((p) => !selected.has(p._key)),
      highlightImage: clearCover ? undefined : a.highlightImage,
    }));
    setSelected(new Set());
    withUndo(
      `${plural(moving.length, "photo")} moved to ${target.title || "Untitled album"}`,
      movePhotosToAlbum(client, albumId, targetId, moving, clearCover),
      async (moved) => {
        await removePhotos(client, targetId, moved.map((p) => p._key));
        await restorePhotos(client, albumId, before);
        if (clearCover) await restoreCover(client, albumId, beforeCover);
      },
      "move the photos"
    );
  };

  const savePhotoField = (key: string, field: "caption" | "alt", value: string) => {
    if (!album) return;
    update(album._id, (a) => ({
      ...a,
      photos: (a.photos ?? []).map((p) => (p._key === key ? { ...p, [field]: value || undefined } : p)),
    }));
    setPhotoField(client, album._id, key, field, value).catch(fail("save the caption"));
  };

  // ---- Derived view state ---------------------------------------------------

  // Saved uploads are already in `photos` (added locally the moment they save).
  const pending = album ? uploads.filter((u) => u.albumId === album._id && u.status !== "done") : [];
  const activeHere = pending.filter(isUploadActive).length;
  const cover = album ? coverKey(album) : null;
  const separateCover = album && album.highlightImage?.asset && !cover ? coverImage(album) : null;
  const detailIndex = photos.findIndex((p) => p._key === detailKey);
  const detailPhoto = detailIndex >= 0 ? photos[detailIndex] : null;
  const hiddenAlbumIds = Array.from(
    new Set(uploads.filter((u) => u.status === "done").map((u) => u.albumId))
  ).filter((id) => {
    const a = albums?.find((x) => x._id === id);
    return a && !isShown(a);
  });
  const albumTitle = (id: string) => albums?.find((a) => a._id === id)?.title || "Untitled album";

  if (!albums) {
    return (
      <Flex align="center" justify="center" height="fill" padding={5}>
        {error ? (
          <Stack gap={4}>
            <Text>Couldn’t load the albums: {error}</Text>
            <Button text="Try again" onClick={refresh} />
          </Stack>
        ) : (
          <Spinner muted />
        )}
      </Flex>
    );
  }

  const details = detailPhoto ? (
    <PhotoDetails
      photo={detailPhoto}
      index={detailIndex}
      total={photos.length}
      isCover={cover === detailPhoto._key}
      thumb={thumb}
      onField={(field, value) => savePhotoField(detailPhoto._key, field, value)}
      onCover={() => makeCover(detailPhoto)}
      onRemove={() => removeKeys([detailPhoto._key])}
      onPrevious={() => setDetailKey(photos[detailIndex - 1]?._key ?? null)}
      onNext={() => setDetailKey(photos[detailIndex + 1]?._key ?? null)}
      onClose={() => setDetailKey(null)}
      closable={showSidePanel}
    />
  ) : null;

  return (
    <Flex height="fill" style={{ minHeight: 0 }}>
      {showRail ? (
        <Card borderRight overflow="auto" style={{ width: 300, flex: "0 0 300px" }}>
          <AlbumList
            albums={albums}
            activeId={album?._id ?? null}
            creating={creating}
            thumb={thumb}
            onSelect={openAlbum}
            onCreate={newAlbum}
          />
        </Card>
      ) : null}

      <Flex
        direction="column"
        flex={1}
        style={{ position: "relative", minWidth: 0 }}
        onDragOver={(event) => {
          if (!album || !hasFiles(event)) return;
          event.preventDefault();
          if (!fileDrag) setFileDrag(true);
        }}
        onDragLeave={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node)) setFileDrag(false);
        }}
        onDrop={(event) => {
          if (!hasFiles(event)) return;
          event.preventDefault();
          setFileDrag(false);
          onFiles(event.dataTransfer.files);
        }}
      >
        <Box flex={1} overflow="auto">
          <Box paddingX={[3, 4, 5]} paddingTop={[4, 5]} style={{ maxWidth: 1240, margin: "0 auto", paddingBottom: 220 }}>
            <Stack gap={5}>
              {!showRail ? (
                <Flex gap={2} align="flex-end">
                  <Stack gap={2} flex={1}>
                    <Text as="label" htmlFor="photos-album-picker" size={1} weight="medium">
                      Album
                    </Text>
                    <Select
                      id="photos-album-picker"
                      value={album?._id ?? ""}
                      onChange={(event) => openAlbum(event.currentTarget.value)}
                    >
                      {albums.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.title || "Untitled album"}
                        </option>
                      ))}
                    </Select>
                  </Stack>
                  <Button icon={AddIcon} mode="ghost" text="New" onClick={newAlbum} loading={creating} />
                </Flex>
              ) : null}

              {album ? (
                <>
                  <AlbumHeader
                    album={album}
                    onField={(field, value) =>
                      editAlbum(
                        album,
                        { [field]: value || undefined },
                        setAlbumField(client, album._id, field, value),
                        "save the album"
                      )
                    }
                    onToggleShown={() => showAlbum(album._id, !isShown(album))}
                    onRemoveLink={() => {
                      const before = album.shareUrl;
                      const albumId = album._id;
                      update(albumId, (a) => ({ ...a, shareUrl: undefined }));
                      withUndo(
                        "iCloud link removed",
                        setAlbumField(client, albumId, "shareUrl", undefined),
                        () => setAlbumField(client, albumId, "shareUrl", before),
                        "remove the link"
                      );
                    }}
                  />

                  {separateCover ? (
                    <Card padding={3} radius={2} border>
                      <Flex gap={3} align="center">
                        {/* eslint-disable-next-line @next/next/no-img-element -- Studio thumbnail from the Sanity CDN */}
                        <img src={thumb(separateCover, 96)} alt="" width={48} height={48} style={{ objectFit: "cover" }} />
                        <Text size={1}>
                          This album uses a separate cover image. Star a photo below to use it as the cover
                          instead.
                        </Text>
                      </Flex>
                    </Card>
                  ) : null}

                  <DropZone compact={photos.length > 0 || pending.length > 0} onFiles={onFiles} />

                  {photos.length > 0 || pending.length > 0 ? (
                    <Stack gap={4}>
                      <Flex
                        align="center"
                        justify="space-between"
                        gap={3}
                        wrap="wrap"
                        paddingBottom={3}
                        style={{ borderBottom: "1px solid var(--card-border-color)" }}
                      >
                        <Text>
                          <strong>{plural(photos.length, "photo")}</strong>{" "}
                          <span style={{ opacity: 0.7 }}>
                            {selectMode
                              ? "· click photos to select them"
                              : activeHere
                                ? `· ${activeHere} more on the way`
                                : showRail
                                  ? "· click a photo to caption it, drag to reorder"
                                  : "· tap a photo to caption it, use Select to reorder"}
                          </span>
                        </Text>
                        <Flex gap={2}>
                          <MenuButton
                            id="photos-arrange"
                            button={<Button mode="ghost" text="Arrange" iconRight={ChevronDownIcon} disabled={photos.length < 2} />}
                            menu={
                              <Menu>
                                <MenuItem text="Sort by date taken, oldest first" onClick={() => sortByDate(false)} />
                                <MenuItem text="Sort by date taken, newest first" onClick={() => sortByDate(true)} />
                              </Menu>
                            }
                            popover={{ portal: true, placement: "bottom-end" }}
                          />
                          {selectMode ? (
                            <Button
                              mode="bleed"
                              text="Select all"
                              onClick={() => setSelected(new Set(photos.map((p) => p._key)))}
                            />
                          ) : null}
                          <Button
                            mode={selectMode ? "default" : "ghost"}
                            text={selectMode ? "Cancel" : "Select"}
                            aria-pressed={selectMode}
                            disabled={photos.length === 0}
                            onClick={() => {
                              setSelectMode(!selectMode);
                              setSelected(new Set());
                              setDetailKey(null);
                            }}
                          />
                        </Flex>
                      </Flex>

                      <PhotoGrid
                        photos={photos}
                        pending={pending}
                        coverKey={cover}
                        selectMode={selectMode}
                        selected={selected}
                        thumb={thumb}
                        onOpen={setDetailKey}
                        onToggle={(key) =>
                          setSelected((current) => {
                            const next = new Set(current);
                            if (next.has(key)) next.delete(key);
                            else next.add(key);
                            return next;
                          })
                        }
                        onMakeCover={makeCover}
                        onRemove={(key) => removeKeys([key])}
                        onReorder={reorder}
                        onRetry={retry}
                        onDismiss={dismiss}
                      />
                    </Stack>
                  ) : null}
                </>
              ) : (
                <Card padding={6} radius={2} border>
                  <Stack gap={4}>
                    <Text align="center" size={3} weight="semibold">
                      No albums yet
                    </Text>
                    <Text align="center" muted>
                      Make an album for an event, then add its photos.
                    </Text>
                    <Flex justify="center">
                      <Button icon={AddIcon} tone="primary" text="New album" onClick={newAlbum} loading={creating} />
                    </Flex>
                  </Stack>
                </Card>
              )}
            </Stack>
          </Box>
        </Box>

        <Flex
          align="flex-end"
          justify="space-between"
          gap={3}
          wrap="wrap"
          style={{ position: "absolute", left: 16, right: 16, bottom: 16, pointerEvents: "none", zIndex: 2 }}
        >
          <Stack gap={2} style={{ pointerEvents: "auto" }}>
            {selectMode && album ? (
              <SelectionBar
                count={selected.size}
                otherAlbums={albums
                  .filter((a) => a._id !== album._id)
                  .map((a) => ({ id: a._id, title: a.title || "Untitled album" }))}
                onCover={() => {
                  const photo = photos.find((p) => selected.has(p._key));
                  if (photo) makeCover(photo);
                }}
                onEarlier={() => nudge(-1)}
                onLater={() => nudge(1)}
                onMoveTo={moveSelectedTo}
                onRemove={() => removeKeys(Array.from(selected))}
                onDone={resetView}
              />
            ) : null}
            {undo ? (
              <UndoBar
                message={undo.message}
                onUndo={runUndo}
                onDismiss={() => setUndo(null)}
              />
            ) : null}
          </Stack>
          {uploads.length > 0 ? (
            <Box style={{ pointerEvents: "auto", marginLeft: "auto" }}>
              <UploadTray
                uploads={uploads}
                albumTitle={albumTitle}
                hiddenAlbumIds={hiddenAlbumIds}
                onShowAlbum={(id) => showAlbum(id, true)}
                onRetry={retry}
                onClear={clearFinished}
              />
            </Box>
          ) : null}
        </Flex>

        {fileDrag && album ? (
          <Card
            tone="primary"
            radius={3}
            style={{
              position: "absolute",
              inset: 8,
              zIndex: 3,
              border: "2px dashed var(--card-focus-ring-color, #2276fc)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
              opacity: 0.96,
            }}
          >
            <Stack gap={4}>
              <Text align="center" size={4}>
                <UploadIcon />
              </Text>
              <Text align="center" size={3} weight="semibold">
                Drop to add to {album.title || "this album"}
              </Text>
              <Text align="center" muted>
                They upload in the background while you keep working.
              </Text>
            </Stack>
          </Card>
        ) : null}
      </Flex>

      {details && showSidePanel ? (
        <Card borderLeft overflow="auto" style={{ width: 380, flex: "0 0 380px" }}>
          {details}
        </Card>
      ) : null}
      {details && !showSidePanel ? (
        <Dialog id="photos-details" header="Photo details" width={1} onClose={() => setDetailKey(null)}>
          {details}
        </Dialog>
      ) : null}
    </Flex>
  );
}
