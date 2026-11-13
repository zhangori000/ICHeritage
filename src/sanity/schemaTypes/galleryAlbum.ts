// src/sanity/schemaTypes/galleryAlbum.ts
import { ImagesIcon } from "@sanity/icons/Images";
import { defineArrayMember, defineField, defineType } from "sanity";

/**
 * A gallery album is a set of photos uploaded directly in Sanity Studio.
 * The "Photos" tool (src/sanity/tools/photos) is the easy way to manage
 * them: bulk upload, reorder, captions and cover. Editors can also drag
 * images into the "Photos" field here. An optional external link (iCloud,
 * Google Photos, …) is still supported for albums that live elsewhere.
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
      name: "hideFromWebsite",
      title: "Hide from website",
      type: "boolean",
      description:
        "Turn on to keep this album off the Gallery page while you are still adding photos.",
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
        "Upload the photos for this album. You can drag and drop several files at once. Drag photos to reorder them. For many photos at once, captions and covers, the Photos tab at the top of Studio is easier.",
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
            defineField({
              name: "takenAt",
              type: "datetime",
              title: "Date taken",
              description: "Filled in by the Photos tool, used for sorting.",
              hidden: true,
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
      hideFromWebsite: "hideFromWebsite",
    },
    prepare({ title, date, photos, media, firstPhoto, hideFromWebsite }) {
      const count = Array.isArray(photos) ? photos.length : 0;
      const parts = [
        date ? String(date) : null,
        `${count} photo${count === 1 ? "" : "s"}`,
        hideFromWebsite === true ? "Hidden" : null,
      ].filter(Boolean);
      return {
        title: title || "Untitled album",
        subtitle: parts.join(" · "),
        media: media ?? firstPhoto,
      };
    },
  },
});
