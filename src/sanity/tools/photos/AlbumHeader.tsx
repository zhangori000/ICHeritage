import { Box, Button, Card, Flex, Grid, Label, Stack, Switch, Text } from "@sanity/ui";
import { CheckmarkIcon } from "@sanity/icons/Checkmark";
import { EditIcon } from "@sanity/icons/Edit";
import { LaunchIcon } from "@sanity/icons/Launch";
import { LinkIcon } from "@sanity/icons/Link";
import { WarningOutlineIcon } from "@sanity/icons/WarningOutline";
import { useIntentLink } from "sanity/router";

import { isShown } from "./api";
import { SavingTextInput } from "./fields";
import type { Album } from "./types";

type Props = {
  album: Album;
  onField: (field: "title" | "date" | "description", value: string) => void;
  onToggleShown: () => void;
  onRemoveLink: () => void;
};

export function AlbumHeader({ album, onField, onToggleShown, onRemoveLink }: Props) {
  const shown = isShown(album);
  const editLink = useIntentLink({
    intent: "edit",
    params: { id: album._id, type: "galleryAlbum" },
  });

  return (
    <Stack gap={4}>
      <Flex align="center" gap={3} wrap="wrap">
        <Label size={1} muted>
          Album
        </Label>
        <Flex align="center" gap={1}>
          <Text size={1} style={{ color: "var(--card-badge-positive-dot-color, #3ab667)" }}>
            <CheckmarkIcon />
          </Text>
          <Text size={1} muted>
            Changes save automatically
          </Text>
        </Flex>
        <Box flex={1} />
        <Button
          as="a"
          href={editLink.href}
          onClick={editLink.onClick}
          mode="bleed"
          fontSize={1}
          padding={2}
          icon={EditIcon}
          text="Edit all fields"
        />
      </Flex>

      <Stack gap={2}>
        <Text as="label" htmlFor="photos-album-title" size={1} weight="medium">
          Album title
        </Text>
        <SavingTextInput
          key={`title-${album._id}`}
          id="photos-album-title"
          fontSize={3}
          padding={3}
          value={album.title ?? ""}
          onSave={(value) => onField("title", value)}
        />
      </Stack>

      <Grid gridTemplateColumns={[1, 1, 2]} gap={3}>
        <Stack gap={2}>
          <Text as="label" htmlFor="photos-album-date" size={1} weight="medium">
            Event date
          </Text>
          <SavingTextInput
            key={`date-${album._id}`}
            id="photos-album-date"
            type="date"
            value={album.date ?? ""}
            onSave={(value) => onField("date", value)}
          />
        </Stack>
        <Stack gap={2}>
          <Text as="label" htmlFor="photos-album-description" size={1} weight="medium">
            Short description (optional)
          </Text>
          <SavingTextInput
            key={`description-${album._id}`}
            id="photos-album-description"
            placeholder="One line shown under the album title"
            value={album.description ?? ""}
            onSave={(value) => onField("description", value)}
          />
        </Stack>
      </Grid>

      <Card padding={3} radius={2} border tone={shown ? "positive" : "default"}>
        <Flex align="center" gap={3} wrap="wrap">
          <Switch
            id="photos-album-shown"
            checked={shown}
            onChange={onToggleShown}
            aria-describedby="photos-album-shown-help"
          />
          <Stack gap={2} flex={1} style={{ minWidth: 200 }}>
            <Text as="label" htmlFor="photos-album-shown" weight="medium">
              Show on website
            </Text>
            <Text id="photos-album-shown-help" size={1} muted>
              {shown
                ? album.shareUrl
                  ? "Visible, but visitors are sent to iCloud for now"
                  : "Visitors see this album on the Gallery page"
                : "Hidden. Only admins can see it here."}
            </Text>
          </Stack>
          <Button
            as="a"
            href="/gallery"
            target="_blank"
            rel="noreferrer"
            mode="ghost"
            fontSize={1}
            iconRight={LaunchIcon}
            text="View the gallery"
          />
        </Flex>
      </Card>

      {album.hasDraft ? (
        <Card padding={3} radius={2} border tone="caution">
          <Flex gap={3} align="flex-start">
            <Text>
              <WarningOutlineIcon />
            </Text>
            <Stack gap={3} flex={1}>
              <Text size={1} weight="medium">
                This album has unpublished edits in the regular editor.
              </Text>
              <Text size={1}>
                Changes made here go live right away, but publishing that draft later would undo them.
                Open the editor and publish or discard the draft first.
              </Text>
              <Box>
                <Button
                  as="a"
                  href={editLink.href}
                  onClick={editLink.onClick}
                  mode="ghost"
                  fontSize={1}
                  text="Open in the editor"
                />
              </Box>
            </Stack>
          </Flex>
        </Card>
      ) : null}

      {album.shareUrl ? (
        <Card padding={4} radius={2} border tone="primary">
          <Flex gap={3} align="flex-start">
            <Text>
              <LinkIcon />
            </Text>
            <Stack gap={3} flex={1}>
              <Text weight="semibold">This album still sends visitors to iCloud.</Text>
              <Text size={1}>
                Add its photos here and they will show right on the Gallery page, so nobody has to leave
                the site. When they are in, remove the link.
              </Text>
              <Stack as="ul" gap={2} style={{ margin: 0, paddingLeft: 18 }}>
                <Text as="li" size={1}>
                  <strong>On a Mac:</strong> open the shared album in the Photos app, press ⌘A to select
                  everything, and drag the photos onto this page.
                </Text>
                <Text as="li" size={1}>
                  <strong>On an iPhone:</strong> open this page in Safari, tap Choose photos, and pick them
                  from your library.
                </Text>
              </Stack>
              <Flex gap={3} align="center" wrap="wrap">
                <Text size={1} muted textOverflow="ellipsis" style={{ maxWidth: 360 }}>
                  {album.shareUrl}
                </Text>
                <Button mode="ghost" fontSize={1} text="Remove the iCloud link" onClick={onRemoveLink} />
              </Flex>
            </Stack>
          </Flex>
        </Card>
      ) : null}
    </Stack>
  );
}
