import { defineArrayMember, defineField, defineType } from "sanity";
import { BookIcon } from "@sanity/icons";

const heroIconOptions: { title: string; value: string }[] = [
  { title: "Book", value: "book-open" },
  { title: "Headphones", value: "headphones" },
  { title: "Document", value: "file-text" },
  { title: "Archive", value: "archive" },
  { title: "Star", value: "star" },
];

const toneOptions: { title: string; value: string }[] = [
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Accent", value: "accent" },
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
      name: "ctaLabel",
      title: "CTA label",
      type: "string",
      description: "Button text. Links to the newsletter section automatically.",
      initialValue: "Start Exploring",
    }),
  ],
});
