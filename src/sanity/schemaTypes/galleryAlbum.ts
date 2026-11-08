// src/sanity/schemaTypes/galleryAlbum.ts
import { ImagesIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A gallery album is a set of photos uploaded directly in Sanity Studio.
 * Editors can drag-and-drop many images at once into the "Photos" field.
 * An optional external link (iCloud, Google Photos, …) is still supported
 * for albums that live elsewhere.
 */
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
      description: "Optional short intro shown under the album title.",
    }),
    defineField({
      name: "date",
      title: "Event date",
      type: "date",
      description:
        "Optional. Used to order albums on the gallery page (newest first) and shown next to the title.",
      options: { dateFormat: "YYYY-MM-DD" },
    }),
    defineField({
      name: "highlightImage",
      title: "Cover image",
      type: "image",
      description:
        "Optional. Large banner photo at the top of the album. If left empty, the first photo below is used.",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          type: "string",
          title: "Alt text",
        }),
      ],
    }),
    defineField({
      name: "photos",
      title: "Photos",
      type: "array",
      description:
        "Upload the photos for this album. You can drag and drop several files at once. Drag photos to reorder them.",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              type: "string",
              title: "Alt text",
              description: "Short description of the photo for screen readers.",
            }),
            defineField({
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional caption shown under the photo when opened.",
            }),
          ],
        }),
      ],
      options: { layout: "grid" },
    }),
    defineField({
      name: "shareUrl",
      title: "External album link (optional)",
      type: "url",
      description:
        "Only needed if the full album lives somewhere else (iCloud, Google Photos, Dropbox…). A “View full album” button will link to it.",
      validation: (rule) =>
        rule.uri({ allowRelative: false, scheme: ["http", "https"] }),
    }),
  ],
  preview: {
    select: {
      title: "title",
      date: "date",
      photos: "photos",
      media: "highlightImage",
      firstPhoto: "photos.0",
    },
    prepare({ title, date, photos, media, firstPhoto }) {
      const count = Array.isArray(photos) ? photos.length : 0;
      const parts = [
        date ? String(date) : null,
        `${count} photo${count === 1 ? "" : "s"}`,
      ].filter(Boolean);
      return {
        title: title || "Untitled album",
        subtitle: parts.join(" · "),
        media: media ?? firstPhoto,
      };
    },
  },
});
