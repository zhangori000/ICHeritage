// src/sanity/schemaTypes/gallerySettings.ts
import { defineField, defineType } from "sanity";
import { ImagesIcon } from "@sanity/icons";

export const gallerySettingsType = defineType({
  name: "gallerySettings",
  title: "Gallery Page Settings",
  type: "document",
  icon: ImagesIcon,
  fields: [
    defineField({
      name: "heroEyebrow",
      title: "Hero eyebrow",
      type: "string",
      description: "Short label displayed above the headline.",
      initialValue: "Community moments",
    }),
    defineField({
      name: "heroTitle",
      title: "Hero title",
      type: "string",
      validation: (rule) => rule.required(),
      initialValue: "Gallery",
    }),
    defineField({
      name: "heroDescription",
      title: "Hero description",
      type: "text",
      rows: 3,
      description:
        "Explain how chapters can browse shared albums curated in iCloud, Google Photos, etc.",
    }),
    defineField({
      name: "heroBackgroundImage",
      title: "Hero background image",
      type: "image",
      description: "Large backdrop photo shown behind the hero content.",
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
    prepare() {
      return {
        title: "Gallery Page Settings",
      };
    },
  },
});
