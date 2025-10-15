import { defineArrayMember, defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

const heroIconOptions: { title: string; value: string }[] = [
  { title: "Book", value: "book-open" },
  { title: "Headphones", value: "headphones" },
  { title: "Document", value: "file-text" },
  { title: "Archive", value: "archive" },
  { title: "Star", value: "star" },
  { title: "Community", value: "users" },
  { title: "Globe", value: "globe" },
  { title: "Heart", value: "heart" },
  { title: "Award", value: "award" },
  { title: "Lightbulb", value: "lightbulb" },
];

const toneOptions: { title: string; value: string }[] = [
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Accent", value: "accent" },
];

const colorPresets = [
  "#FFFFFF",
  "#3A3A3A",
  "#A73438",
  "#5A6B4F",
  "#F0E6D2",
  "#000000",
];

export const resourcesHeroType = defineType({
  name: "resourcesHero",
  title: "Resources hero",
  type: "object",
  icon: BookIcon,
  fields: [
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Intro text",
      type: "text",
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "backgroundImage",
      title: "Background image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "overlayOpacity",
      title: "Image overlay opacity (0–100)",
      type: "number",
      initialValue: 85,
      validation: (rule) => rule.min(0).max(100),
    }),
    defineField({
      name: "headingColor",
      title: "Heading color",
      type: "color",
      options: {
        disableAlpha: true,
        colorList: colorPresets,
      },
      description: "Optional override for the main heading color.",
    }),
    defineField({
      name: "taglineColor",
      title: "Intro text color",
      type: "color",
      options: {
        disableAlpha: true,
        colorList: colorPresets,
      },
      description: "Optional override for the intro paragraph color.",
    }),
    defineField({
      name: "highlights",
      title: "Highlight cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              type: "text",
              rows: 3,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "icon",
              type: "string",
              options: { list: heroIconOptions },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tone",
              title: "Color tone",
              type: "string",
              options: { list: toneOptions, layout: "radio" },
              initialValue: "primary",
            }),
          ],
          preview: {
            select: { title: "title", icon: "icon" },
            prepare({ title, icon }) {
              return {
                title: title || "Highlight",
                subtitle: icon,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(4),
    }),
    defineField({
      name: "highlightTitleColor",
      title: "Highlight title color",
      type: "color",
      options: {
        disableAlpha: true,
        colorList: colorPresets,
      },
      description: "Applies to every highlight card title (optional).",
    }),
    defineField({
      name: "highlightBodyColor",
      title: "Highlight body color",
      type: "color",
      options: {
        disableAlpha: true,
        colorList: colorPresets,
      },
      description: "Applies to every highlight card description (optional).",
    }),
    defineField({
      name: "enablePetalAnimation",
      title: "Enable petal animation",
      type: "boolean",
      initialValue: false,
      description: "Adds a subtle floating petal animation over the background image.",
    }),
    defineField({
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      description:
        "Legacy fallback button text (defaults to the resources newsletter link). Prefer using Primary/Secondary CTA below.",
      initialValue: "Start Exploring",
    }),
    defineField({
      name: "primaryCta",
      title: "Primary CTA",
      type: "object",
      fields: [
        defineField({
          name: "label",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          type: "string",
          description:
            "Use an internal path (e.g. /start-a-chapter or #application) or a full URL.",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              const trimmed = value.trim();
              if (!trimmed) return "Enter a path or URL.";
              if (
                trimmed.startsWith("/") ||
                trimmed.startsWith("#") ||
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://") ||
                trimmed.startsWith("mailto:") ||
                trimmed.startsWith("tel:")
              ) {
                return true;
              }
              return "Start with /, #, mailto:, tel:, or use a full URL.";
            }),
        }),
      ],
    }),
    defineField({
      name: "secondaryCta",
      title: "Secondary CTA",
      type: "object",
      fields: [
        defineField({
          name: "label",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "href",
          type: "string",
          description:
            "Use an internal path (e.g. #requirements) or a full URL.",
          validation: (rule) =>
            rule.custom((value) => {
              if (!value) return true;
              const trimmed = value.trim();
              if (!trimmed) return "Enter a path or URL.";
              if (
                trimmed.startsWith("/") ||
                trimmed.startsWith("#") ||
                trimmed.startsWith("http://") ||
                trimmed.startsWith("https://") ||
                trimmed.startsWith("mailto:") ||
                trimmed.startsWith("tel:")
              ) {
                return true;
              }
              return "Start with /, #, mailto:, tel:, or use a full URL.";
            }),
        }),
      ],
    }),
  ],
});
