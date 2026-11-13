import { Badge, Box, Button, Card, Flex, Label, Stack, Text } from "@sanity/ui";
import { AddIcon } from "@sanity/icons/Add";
import { ImageIcon } from "@sanity/icons/Image";

import { coverImage, isShown } from "./api";
import type { Album, AlbumPhoto, CoverImage } from "./types";

type Props = {
  albums: Album[];
  activeId: string | null;
  creating: boolean;
  thumb: (image: AlbumPhoto | CoverImage, size: number) => string;
  onSelect: (albumId: string) => void;
  onCreate: () => void;
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export function albumMeta(album: Album) {
  const count = album.photos?.length ?? 0;
  const photos = `${count} photo${count === 1 ? "" : "s"}`;
  if (!album.date) return photos;
  const [year, month] = album.date.split("-");
  return `${photos} · ${MONTHS[Number(month) - 1] ?? ""} ${year}`;
}

export function AlbumStatus({ album }: { album: Album }) {
  if (album.shareUrl) return <Badge tone="caution">Links to iCloud</Badge>;
  return isShown(album) ? <Badge tone="positive">On the website</Badge> : <Badge>Hidden</Badge>;
}

export function AlbumList({ albums, activeId, creating, thumb, onSelect, onCreate }: Props) {
  return (
    <Stack gap={3} padding={3}>
      <Flex align="center" justify="space-between" paddingX={2} paddingTop={2}>
        <Label size={1} muted>
          Albums
        </Label>
        <Text size={1} muted>
          {albums.length}
        </Text>
      </Flex>
      <Button icon={AddIcon} text="New album" mode="ghost" onClick={onCreate} loading={creating} />
      <Stack as="ul" gap={1} style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {albums.map((album) => {
          const cover = coverImage(album);
          const active = album._id === activeId;
          return (
            <li key={album._id}>
              <Card
                as="button"
                type="button"
                padding={2}
                radius={2}
                selected={active}
                aria-current={active ? "page" : undefined}
                onClick={() => onSelect(album._id)}
                style={{ width: "100%", textAlign: "left", cursor: "pointer" }}
              >
                <Flex align="center" gap={3}>
                  <Card
                    radius={1}
                    tone="transparent"
                    border
                    overflow="hidden"
                    style={{ width: 52, height: 52, flex: "0 0 52px" }}
                  >
                    {cover?.asset ? (
                      // eslint-disable-next-line @next/next/no-img-element -- Studio thumbnail from the Sanity CDN
                      <img
                        src={thumb(cover, 104)}
                        alt=""
                        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                      />
                    ) : (
                      <Flex align="center" justify="center" style={{ height: "100%" }}>
                        <Text muted>
                          <ImageIcon />
                        </Text>
                      </Flex>
                    )}
                  </Card>
                  <Stack gap={2} flex={1} style={{ minWidth: 0 }}>
                    <Text size={1} weight="medium" textOverflow="ellipsis">
                      {album.title || "Untitled album"}
                    </Text>
                    <Text size={1} muted>
                      {albumMeta(album)}
                    </Text>
                    <Box>
                      <AlbumStatus album={album} />
                    </Box>
                  </Stack>
                </Flex>
              </Card>
            </li>
          );
        })}
      </Stack>
      <Box paddingX={2} paddingTop={3}>
        <Text size={1} muted>
          Tip: open this page on your phone to add photos straight from your camera roll.
        </Text>
      </Box>
    </Stack>
  );
}
