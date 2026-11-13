import { useRef } from "react";
import { Box, Button, Card, Flex, Stack, Text } from "@sanity/ui";
import { UploadIcon } from "@sanity/icons/Upload";

type Props = {
  /** An album with photos gets a slim bar; an empty one gets a big target. */
  compact: boolean;
  onFiles: (files: FileList) => void;
};

/*
 * `image/*` alone. Listing `image/heic` as well makes Safari convert picked
 * files to whichever type it sees first (WebKit bug 303803); with plain
 * `image/*`, iPhone Safari usually hands over JPEGs. HEIC files that do
 * arrive (dragged from the Mac Photos app) are still accepted.
 */
const ACCEPT = "image/*";

export function DropZone({ compact, onFiles }: Props) {
  const input = useRef<HTMLInputElement>(null);

  const picker = (
    <>
      <input
        ref={input}
        type="file"
        multiple
        accept={ACCEPT}
        hidden
        onChange={(event) => {
          if (event.currentTarget.files?.length) onFiles(event.currentTarget.files);
          event.currentTarget.value = "";
        }}
      />
      <Button
        icon={UploadIcon}
        text="Choose photos"
        tone="primary"
        padding={3}
        onClick={() => input.current?.click()}
      />
    </>
  );

  const frame = {
    border: "2px dashed var(--card-border-color, #ccc)",
  };

  if (compact) {
    return (
      <Card padding={3} radius={2} tone="transparent" style={frame}>
        <Flex align="center" gap={3} wrap="wrap">
          <Text size={2} muted>
            <UploadIcon />
          </Text>
          <Stack gap={2} flex={1} style={{ minWidth: 220 }}>
            <Text weight="medium">Drop more photos anywhere on this page, or choose them.</Text>
            <Text size={1} muted>
              JPG, PNG or iPhone photos · as many as you like · big files shrink automatically
            </Text>
          </Stack>
          {picker}
        </Flex>
      </Card>
    );
  }

  return (
    <Card paddingX={4} paddingY={6} radius={2} tone="transparent" style={frame}>
      <Stack gap={4}>
        <Flex justify="center">
          <Text size={4} muted>
            <UploadIcon />
          </Text>
        </Flex>
        <Text align="center" size={3} weight="semibold">
          Drag the event’s photos here
        </Text>
        <Text align="center" muted>
          or
        </Text>
        <Flex justify="center">
          <Box>{picker}</Box>
        </Flex>
        <Text align="center" size={1} muted>
          Pick as many as you like at once. JPG, PNG and iPhone photos all work, and big files are shrunk
          for the web automatically.
        </Text>
      </Stack>
    </Card>
  );
}
