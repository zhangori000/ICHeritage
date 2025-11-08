// src/sanity/schemaTypes/galleryAlbum.ts
import { ImagesIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const galleryAlbumType = defineType({
  name: "galleryAlbum",
  title: "Gallery Album",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "title",
      title: "Album title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 2,
      description: "Optional context that appears with the album embed.",
    }),
    defineField({
      name: "shareUrl",
      title: "Shared album URL",
      type: "url",
      description: "Public iCloud, Google Photos, or similar shared link.",
      validation: (rule) =>
        rule.required().uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
    defineField({
      name: "highlightImage",
      title: "Highlight image",
      type: "image",
      description:
        "Optional photo that appears on the gallery card for extra context.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "shareUrl",
    },
  },
});
