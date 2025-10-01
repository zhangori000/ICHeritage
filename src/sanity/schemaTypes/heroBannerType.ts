// src/sanity/schemaTypes/heroBannerType.ts
import { defineType, defineField } from "sanity";

export const heroBannerType = defineType({
  name: "heroBanner",
  title: "Hero Banner",
  type: "object",
  fields: [
    defineField({
      name: "background",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
    }),

    defineField({
      name: "overlayOpacity",
      title: "Overlay opacity (0–100)",
      type: "number",
      description: "Darker overlay on top of the image to improve contrast",
      initialValue: 0,
      validation: (Rule) => Rule.min(0).max(100),
    }),

    defineField({ name: "title", type: "string" }),
    defineField({
      name: "titleColor",
      title: "Title color",
      type: "color",
      options: {
        disableAlpha: true,
        colorList: [
          "#FFFFFF", // white
          "#3A3A3A", // foreground
          "#A73438", // primary
          "#5A6B4F", // secondary/accent
          "#F0E6D2", // muted
          "#000000", // black
        ],
      },
    }),

    defineField({ name: "kicker", title: "Subtitle / Kicker", type: "string" }),
    defineField({
      name: "kickerColor",
      title: "Kicker color",
      type: "color",
      options: {
        disableAlpha: true,
        colorList: [
          "#FFFFFF",
          "#3A3A3A",
          "#A73438",
          "#5A6B4F",
          "#F0E6D2",
          "#000000",
        ],
      },
    }),

    defineField({ name: "body", title: "Description", type: "text" }),
    defineField({
      name: "bodyColor",
      title: "Body color",
      type: "color",
      options: {
        disableAlpha: true,
        colorList: [
          "#FFFFFF",
          "#3A3A3A",
          "#A73438",
          "#5A6B4F",
          "#F0E6D2",
          "#000000",
        ],
      },
    }),

    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", type: "url" }),
      ],
    }),

    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "object",
      fields: [
        defineField({ name: "label", type: "string" }),
        defineField({ name: "href", type: "url" }),
      ],
    }),
  ],
});
