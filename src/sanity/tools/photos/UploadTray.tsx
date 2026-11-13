import { useState } from "react";
import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { CheckmarkIcon } from "@sanity/icons/Checkmark";
import { ChevronDownIcon } from "@sanity/icons/ChevronDown";
import { ChevronUpIcon } from "@sanity/icons/ChevronUp";
import { CloseIcon } from "@sanity/icons/Close";

import { ProgressBar } from "./PhotoGrid";
import { isUploadActive, type Upload } from "./types";

type Props = {
  uploads: Upload[];
  albumTitle: (albumId: string) => string;
  /** Albums that just received photos but are hidden from the site. */
  hiddenAlbumIds: string[];
  onShowAlbum: (albumId: string) => void;
  onRetry: (id: string) => void;
  onClear: () => void;
};

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? "" : "s"}`;

/** Bottom-right tray that follows the whole batch while the admin keeps working. */
export function UploadTray({ uploads, albumTitle, hiddenAlbumIds, onShowAlbum, onRetry, onClear }: Props) {
  // The grid already shows each photo's progress, so the per-file list starts folded away.
  const [open, setOpen] = useState(false);

  const active = uploads.filter(isUploadActive).length;
  const failed = uploads.filter((u) => u.status === "failed").length;
  const added = uploads.filter((u) => u.status === "done").length;
  const skipped = uploads.filter((u) => u.status === "duplicate").length;
  const total = uploads.length;
  const percent = total
    ? Math.round(
        uploads.reduce((sum, u) => sum + (u.status === "failed" || u.status === "waiting" ? 0 : u.percent), 0) /
          total
      )
    : 0;

  const title = active
    ? `Adding ${plural(total, "photo")} · ${added} done`
    : failed
      ? `${added} added · ${failed} didn’t upload`
      : `${plural(added, "photo")} added`;
  const detail = active
    ? "Keep working. Just leave this tab open until they finish."
    : failed
      ? "Try again, or remove the ones that failed."
      : skipped
        ? `${plural(skipped, "photo")} skipped because ${skipped === 1 ? "it was" : "they were"} already in the album.`
        : "Big photos are shrunk for the web. Your originals stay on your phone or computer.";

  return (
    <Card radius={3} shadow={3} border style={{ width: 380, maxWidth: "100%" }} aria-label="Upload progress">
      <Flex align="center" gap={2} padding={3} paddingRight={2}>
        <Stack gap={2} flex={1} aria-live="polite">
          <Text weight="semibold">{title}</Text>
          <Text size={1} muted>
            {detail}
          </Text>
        </Stack>
        <Button
          mode="bleed"
          icon={open ? ChevronDownIcon : ChevronUpIcon}
          aria-label={open ? "Hide the upload list" : "Show the upload list"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
        />
        {active === 0 ? (
          <Button mode="bleed" icon={CloseIcon} aria-label="Close the upload list" onClick={onClear} />
        ) : null}
      </Flex>
      <ProgressBar percent={active ? percent : 100} tone={active ? undefined : failed ? "critical" : "positive"} />

      {hiddenAlbumIds.length > 0 && active === 0 ? (
        <Card padding={3} tone="caution" borderBottom>
          <Stack gap={3}>
            {hiddenAlbumIds.map((id) => (
              <Flex key={id} align="center" gap={3}>
                <Text size={1} style={{ flex: 1 }}>
                  “{albumTitle(id)}” is hidden from the website.
                </Text>
                <Button fontSize={1} padding={2} tone="positive" text="Show it" onClick={() => onShowAlbum(id)} />
              </Flex>
            ))}
          </Stack>
        </Card>
      ) : null}

      {open ? (
        <Box style={{ maxHeight: 260, overflowY: "auto" }}>
          <Stack as="ul" gap={1} padding={2} style={{ listStyle: "none", margin: 0 }}>
            {uploads.map((upload) => (
              <Flex as="li" key={upload.id} align="center" gap={3} padding={1}>
                <Card radius={1} border overflow="hidden" style={{ width: 36, height: 36, flex: "0 0 36px" }}>
                  {upload.previewUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element -- local preview of a file being uploaded
                    <img
                      src={upload.previewUrl}
                      alt=""
                      onError={(event) => (event.currentTarget.style.visibility = "hidden")}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  ) : null}
                </Card>
                <Stack gap={2} flex={1} style={{ minWidth: 0 }}>
                  <Text size={1} textOverflow="ellipsis">
                    {upload.name}
                  </Text>
                  <Text
                    size={0}
                    weight="medium"
                    style={{
                      color:
                        upload.status === "failed"
                          ? "var(--card-badge-critical-fg-color, #c4321f)"
                          : upload.status === "done"
                            ? "var(--card-badge-positive-fg-color, #2a8a4d)"
                            : undefined,
                    }}
                    muted={upload.status !== "failed" && upload.status !== "done"}
                  >
                    {statusText(upload, albumTitle)}
                  </Text>
                </Stack>
                {upload.status === "failed" ? (
                  <Button fontSize={1} padding={2} mode="ghost" text="Try again" onClick={() => onRetry(upload.id)} />
                ) : upload.status === "done" ? (
                  <Text size={1} style={{ color: "var(--card-badge-positive-fg-color, #2a8a4d)" }}>
                    <CheckmarkIcon />
                  </Text>
                ) : null}
              </Flex>
            ))}
          </Stack>
        </Box>
      ) : null}
    </Card>
  );
}

function statusText(upload: Upload, albumTitle: (id: string) => string) {
  switch (upload.status) {
    case "waiting":
      return "Waiting";
    case "preparing":
      return "Getting ready";
    case "uploading":
      return `Uploading · ${upload.percent}%`;
    case "saving":
      return "Saving to the album";
    case "done":
      return `Added to ${albumTitle(upload.albumId)}`;
    case "duplicate":
      return "Already in this album · skipped";
    case "failed":
      return `Didn’t upload · ${upload.error ?? "something went wrong"}`;
  }
}
