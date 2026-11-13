import { useState, type CSSProperties, type DragEvent } from "react";
import { Badge, Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { CheckmarkIcon } from "@sanity/icons/Checkmark";
import { CloseIcon } from "@sanity/icons/Close";
import { ImageIcon } from "@sanity/icons/Image";
import { StarIcon } from "@sanity/icons/Star";
import { TrashIcon } from "@sanity/icons/Trash";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";

import type { AlbumPhoto, Upload } from "./types";

type Props = {
  photos: AlbumPhoto[];
  pending: Upload[];
  coverKey: string | null;
  selectMode: boolean;
  selected: Set<string>;
  thumb: (photo: AlbumPhoto, size: number) => string;
  onOpen: (key: string) => void;
  onToggle: (key: string) => void;
  onMakeCover: (photo: AlbumPhoto) => void;
  onRemove: (key: string) => void;
  /** Drop `dragKey` onto `targetKey`. */
  onReorder: (dragKey: string, targetKey: string) => void;
  onRetry: (uploadId: string) => void;
  onDismiss: (uploadId: string) => void;
};

const GRID: CSSProperties = {
  listStyle: "none",
  margin: 0,
  padding: 0,
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
  gap: "16px 12px",
};

const SQUARE: CSSProperties = { position: "relative", aspectRatio: "1 / 1", overflow: "hidden" };
const FILL: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
const IMAGE: CSSProperties = { ...FILL, objectFit: "cover", display: "block" };
const HIT: CSSProperties = { ...FILL, padding: 0, border: 0, background: "transparent", cursor: "pointer" };
const SCRIM = "rgba(16, 16, 16, 0.78)";

export function PhotoGrid(props: Props) {
  const { photos, pending, selectMode, onReorder } = props;
  const [dragKey, setDragKey] = useState<string | null>(null);
  const [overKey, setOverKey] = useState<string | null>(null);

  const endDrag = () => {
    setDragKey(null);
    setOverKey(null);
  };

  return (
    <ul aria-label="Photos in this album" style={GRID}>
      {photos.map((photo, index) => (
        <PhotoTile
          key={photo._key}
          {...props}
          photo={photo}
          index={index}
          total={photos.length}
          dragging={dragKey === photo._key}
          dropTarget={!!dragKey && overKey === photo._key && dragKey !== photo._key}
          dragHandlers={
            selectMode
              ? undefined
              : {
                  draggable: true,
                  onDragStart: (event: DragEvent) => {
                    event.dataTransfer.effectAllowed = "move";
                    event.dataTransfer.setData("text/plain", photo._key);
                    setDragKey(photo._key);
                  },
                  onDragOver: (event: DragEvent) => {
                    if (!dragKey) return;
                    event.preventDefault();
                    event.stopPropagation();
                    if (overKey !== photo._key) setOverKey(photo._key);
                  },
                  onDrop: (event: DragEvent) => {
                    if (!dragKey) return;
                    event.preventDefault();
                    event.stopPropagation();
                    if (dragKey !== photo._key) onReorder(dragKey, photo._key);
                    endDrag();
                  },
                  onDragEnd: endDrag,
                }
          }
        />
      ))}
      {pending.map((upload) => (
        <PendingTile
          key={upload.id}
          upload={upload}
          onRetry={props.onRetry}
          onDismiss={props.onDismiss}
        />
      ))}
    </ul>
  );
}

type TileProps = Props & {
  photo: AlbumPhoto;
  index: number;
  total: number;
  dragging: boolean;
  dropTarget: boolean;
  dragHandlers?: {
    draggable: boolean;
    onDragStart: (event: DragEvent) => void;
    onDragOver: (event: DragEvent) => void;
    onDrop: (event: DragEvent) => void;
    onDragEnd: () => void;
  };
};

function PhotoTile({
  photo,
  index,
  total,
  coverKey,
  selectMode,
  selected,
  thumb,
  onOpen,
  onToggle,
  onMakeCover,
  onRemove,
  dragging,
  dropTarget,
  dragHandlers,
}: TileProps) {
  const [showActions, setShowActions] = useState(false);
  const isCover = coverKey === photo._key;
  const isSelected = selected.has(photo._key);
  const label = photo.alt || photo.caption || `Photo ${index + 1} of ${total}`;

  const outline = isSelected
    ? "3px solid var(--card-focus-ring-color, #2276fc)"
    : dropTarget
      ? "2px dashed var(--card-focus-ring-color, #2276fc)"
      : undefined;

  return (
    <Stack
      as="li"
      gap={2}
      {...dragHandlers}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onFocus={() => setShowActions(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setShowActions(false);
      }}
      style={{ opacity: dragging ? 0.4 : 1, cursor: dragHandlers ? "grab" : undefined }}
    >
      <Card
        radius={2}
        tone="transparent"
        style={{ ...SQUARE, outline, outlineOffset: 3 }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- Studio thumbnail from the Sanity CDN */}
        <img src={thumb(photo, 400)} alt={label} draggable={false} style={IMAGE} />
        <button
          type="button"
          style={HIT}
          aria-label={selectMode ? `Select photo ${index + 1}` : `Caption and details for photo ${index + 1}`}
          aria-pressed={selectMode ? isSelected : undefined}
          onClick={() => (selectMode ? onToggle(photo._key) : onOpen(photo._key))}
        />

        {isCover ? (
          <Box style={{ position: "absolute", left: 8, top: 8, pointerEvents: "none" }}>
            <Badge tone="primary">Cover</Badge>
          </Box>
        ) : null}

        {selectMode ? (
          <Flex
            aria-hidden
            align="center"
            justify="center"
            style={{
              position: "absolute",
              right: 8,
              top: 8,
              width: 28,
              height: 28,
              borderRadius: 14,
              border: "2px solid #fff",
              boxSizing: "border-box",
              background: isSelected ? "var(--card-focus-ring-color, #2276fc)" : "rgba(0,0,0,.35)",
              color: "#fff",
              pointerEvents: "none",
            }}
          >
            {isSelected ? <CheckmarkIcon style={{ fontSize: 22 }} /> : null}
          </Flex>
        ) : null}

        {!selectMode && showActions ? (
          <Flex gap={1} style={{ position: "absolute", right: 6, top: 6 }}>
            <Button
              icon={StarIcon}
              mode="bleed"
              padding={2}
              disabled={isCover}
              title={isCover ? "This is the cover" : "Make this the cover"}
              aria-label={isCover ? "This is the cover" : "Make this the cover"}
              onClick={() => onMakeCover(photo)}
              style={{ background: SCRIM, color: "#fff" }}
            />
            <Button
              icon={TrashIcon}
              mode="bleed"
              padding={2}
              title="Remove this photo"
              aria-label="Remove this photo"
              onClick={() => onRemove(photo._key)}
              style={{ background: SCRIM, color: "#fff" }}
            />
          </Flex>
        ) : null}

        {!selectMode && showActions ? (
          <Box
            aria-hidden
            style={{
              position: "absolute",
              left: 6,
              bottom: 6,
              padding: "4px 8px",
              background: SCRIM,
              color: "#fff",
              fontSize: 12,
              pointerEvents: "none",
            }}
          >
            Drag to move · click to caption
          </Box>
        ) : null}
      </Card>
      <Text size={1} muted textOverflow="ellipsis">
        {photo.caption || " "}
      </Text>
    </Stack>
  );
}

function PendingTile({
  upload,
  onRetry,
  onDismiss,
}: {
  upload: Upload;
  onRetry: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const [previewFailed, setPreviewFailed] = useState(false);
  const failed = upload.status === "failed";
  const duplicate = upload.status === "duplicate";
  const status =
    upload.status === "waiting"
      ? "Waiting"
      : upload.status === "preparing"
        ? "Getting ready"
        : upload.status === "saving"
          ? "Saving"
          : `Uploading · ${upload.percent}%`;

  return (
    <Stack as="li" gap={2}>
      <Card radius={2} tone="transparent" border style={SQUARE}>
        {upload.previewUrl && !previewFailed ? (
          // eslint-disable-next-line @next/next/no-img-element -- local preview of a file being uploaded
          <img
            src={upload.previewUrl}
            alt=""
            onError={() => setPreviewFailed(true)}
            style={{ ...IMAGE, opacity: 0.5 }}
          />
        ) : (
          <Flex align="center" justify="center" style={FILL}>
            <Text size={3} muted>
              <ImageIcon />
            </Text>
          </Flex>
        )}

        {failed || duplicate ? (
          <Card
            tone={failed ? "critical" : "default"}
            padding={2}
            style={{ ...FILL, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.96 }}
          >
            <Stack gap={3} style={{ textAlign: "center" }}>
              {failed ? (
                <>
                  <Text size={1} weight="semibold">
                    <WarningOutlineIcon /> Didn’t upload
                  </Text>
                  <Text size={0} muted>
                    {upload.error}
                  </Text>
                  <Flex gap={1} justify="center">
                    <Button fontSize={1} padding={2} text="Try again" onClick={() => onRetry(upload.id)} />
                    <Button
                      fontSize={1}
                      padding={2}
                      mode="bleed"
                      text="Remove"
                      onClick={() => onDismiss(upload.id)}
                    />
                  </Flex>
                </>
              ) : (
                <>
                  <Text size={1} weight="semibold">
                    Already in this album
                  </Text>
                  <Flex justify="center">
                    <Button
                      fontSize={1}
                      padding={2}
                      mode="bleed"
                      icon={CloseIcon}
                      text="OK"
                      onClick={() => onDismiss(upload.id)}
                    />
                  </Flex>
                </>
              )}
            </Stack>
          </Card>
        ) : (
          <Card
            padding={2}
            style={{ position: "absolute", left: 0, right: 0, bottom: 0, opacity: 0.95 }}
          >
            <Stack gap={2}>
              <Text size={0} weight="medium">
                {status}
              </Text>
              <ProgressBar percent={upload.status === "waiting" ? 0 : upload.percent} />
            </Stack>
          </Card>
        )}
      </Card>
      <Text size={1} muted textOverflow="ellipsis">
        {upload.name}
      </Text>
    </Stack>
  );
}

export function ProgressBar({ percent, tone }: { percent: number; tone?: "positive" | "critical" }) {
  const color =
    tone === "positive"
      ? "var(--card-badge-positive-dot-color, #3ab667)"
      : tone === "critical"
        ? "var(--card-badge-critical-dot-color, #f03e2f)"
        : "var(--card-fg-color, #101112)";
  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={percent}
      style={{ height: 4, background: "var(--card-border-color, #ddd)", overflow: "hidden" }}
    >
      <div style={{ height: 4, width: `${percent}%`, background: color, transition: "width .3s" }} />
    </div>
  );
}
