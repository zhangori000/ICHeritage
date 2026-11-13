import { Button, Card, Flex, Text } from "@sanity/ui";
import { Menu, MenuButton, MenuItem } from "@sanity/ui/menu";
import { ArrowLeftIcon } from "@sanity/icons/ArrowLeft";
import { ArrowRightIcon } from "@sanity/icons/ArrowRight";
import { CloseIcon } from "@sanity/icons/Close";
import { FolderIcon } from "@sanity/icons/Folder";
import { StarIcon } from "@sanity/icons/Star";
import { TrashIcon } from "@sanity/icons/Trash";

type SelectionBarProps = {
  count: number;
  otherAlbums: { id: string; title: string }[];
  onCover: () => void;
  onEarlier: () => void;
  onLater: () => void;
  onMoveTo: (albumId: string) => void;
  onRemove: () => void;
  onDone: () => void;
};

/** Floating actions for the photos picked in Select mode. */
export function SelectionBar({
  count,
  otherAlbums,
  onCover,
  onEarlier,
  onLater,
  onMoveTo,
  onRemove,
  onDone,
}: SelectionBarProps) {
  const none = count === 0;
  const one = count === 1;
  return (
    <Card role="toolbar" aria-label="Selected photos" padding={2} radius={3} shadow={3} scheme="dark">
      <Flex align="center" gap={2} wrap="wrap">
        <Text weight="medium" style={{ padding: "0 8px", minWidth: 140 }}>
          {none ? "Click photos to select" : `${count} selected`}
        </Text>
        <Button icon={StarIcon} mode="ghost" text="Make cover" disabled={!one} onClick={onCover} />
        <Button icon={ArrowLeftIcon} mode="ghost" aria-label="Move earlier" title="Move earlier" disabled={!one} onClick={onEarlier} />
        <Button icon={ArrowRightIcon} mode="ghost" aria-label="Move later" title="Move later" disabled={!one} onClick={onLater} />
        <MenuButton
          id="photos-move-to-album"
          button={<Button icon={FolderIcon} mode="ghost" text="Move to album" disabled={none || otherAlbums.length === 0} />}
          menu={
            <Menu>
              {otherAlbums.map((album) => (
                <MenuItem key={album.id} text={album.title} onClick={() => onMoveTo(album.id)} />
              ))}
            </Menu>
          }
          popover={{ placement: "top", portal: true }}
        />
        <Button icon={TrashIcon} mode="ghost" tone="critical" text="Remove" disabled={none} onClick={onRemove} />
        <Button text="Done" tone="default" onClick={onDone} />
      </Flex>
    </Card>
  );
}

/** "Photo removed · Undo", shown for a few seconds after anything that is hard to redo by hand. */
export function UndoBar({
  message,
  onUndo,
  onDismiss,
}: {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  return (
    <Card role="status" padding={2} paddingLeft={3} radius={3} shadow={3} scheme="dark">
      <Flex align="center" gap={3}>
        <Text>{message}</Text>
        <Button mode="ghost" text="Undo" onClick={onUndo} />
        <Button mode="bleed" icon={CloseIcon} aria-label="Dismiss" onClick={onDismiss} />
      </Flex>
    </Card>
  );
}
