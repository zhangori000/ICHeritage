import { Box, Button, Card, Flex, Label, Stack, Text } from "@sanity/ui";
import { CloseIcon } from "@sanity/icons/Close";
import { StarIcon } from "@sanity/icons/Star";
import { TrashIcon } from "@sanity/icons/Trash";

import { SavingTextArea, SavingTextInput } from "./fields";
import type { AlbumPhoto } from "./types";

type Props = {
  photo: AlbumPhoto;
  index: number;
  total: number;
  isCover: boolean;
  thumb: (photo: AlbumPhoto, size: number) => string;
  onField: (field: "caption" | "alt", value: string) => void;
  onCover: () => void;
  onRemove: () => void;
  onPrevious: () => void;
  onNext: () => void;
  onClose: () => void;
  /** False inside a dialog, which has its own close button. */
  closable?: boolean;
};

/** Caption, screen-reader text and cover for one photo, with Next to caption a whole album in one sitting. */
export function PhotoDetails({
  photo,
  index,
  total,
  isCover,
  thumb,
  onField,
  onCover,
  onRemove,
  onPrevious,
  onNext,
  onClose,
  closable = true,
}: Props) {
  return (
    <Stack gap={4} padding={4}>
      <Flex align="center" justify="space-between">
        <Label size={1} muted>
          Photo {index + 1} of {total}
        </Label>
        {closable ? (
          <Button mode="bleed" icon={CloseIcon} aria-label="Close photo details" onClick={onClose} />
        ) : null}
      </Flex>

      <Card radius={2} border overflow="hidden" tone="transparent" style={{ aspectRatio: "4 / 3" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- Studio preview from the Sanity CDN */}
        <img
          src={thumb(photo, 800)}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </Card>

      <Stack gap={2}>
        <Text as="label" htmlFor="photos-caption" size={1} weight="medium">
          Caption
        </Text>
        <Text size={1} muted>
          Shown under the photo when a visitor opens it.
        </Text>
        <SavingTextArea
          key={`caption-${photo._key}`}
          id="photos-caption"
          rows={3}
          placeholder="e.g. Lion dancers open the parade on Main Street"
          value={photo.caption ?? ""}
          onSave={(value) => onField("caption", value)}
        />
      </Stack>

      <Stack gap={2}>
        <Text as="label" htmlFor="photos-alt" size={1} weight="medium">
          Describe the photo for people using screen readers
        </Text>
        <SavingTextInput
          key={`alt-${photo._key}`}
          id="photos-alt"
          placeholder="e.g. Two lion dancers in red and gold costumes"
          value={photo.alt ?? ""}
          onSave={(value) => onField("alt", value)}
        />
      </Stack>

      <Flex gap={2} wrap="wrap">
        <Button
          icon={StarIcon}
          mode="ghost"
          text={isCover ? "This is the cover" : "Make this the cover"}
          disabled={isCover}
          onClick={onCover}
        />
        <Button icon={TrashIcon} mode="bleed" tone="critical" text="Remove photo" onClick={onRemove} />
      </Flex>

      <Flex gap={2} justify="space-between" paddingTop={3} style={{ borderTop: "1px solid var(--card-border-color)" }}>
        <Button mode="ghost" text="Previous" disabled={index === 0} onClick={onPrevious} />
        <Button tone="primary" text="Next photo" disabled={index >= total - 1} onClick={onNext} />
      </Flex>
      <Box>
        <Text size={1} muted>
          Captions save as you type.
        </Text>
      </Box>
    </Stack>
  );
}
