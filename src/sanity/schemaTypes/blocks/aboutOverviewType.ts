import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

const iconOptions = [
  { title: "Users", value: "users" },
  { title: "Calendar", value: "calendar" },
  { title: "Globe", value: "globe" },
  { title: "Award", value: "award" },
  { title: "Sparkles", value: "sparkles" },
  { title: "Book", value: "book-open" },
  { title: "Heart", value: "heart" },
];

export const aboutOverviewType = defineType({
  name: "aboutOverview",
  title: "About – Overview",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      description: "Optional anchor id without the # (e.g. who-we-are).",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "intro",
      title: "Intro paragraphs",
      type: "array",
      of: [defineArrayMember({ type: "text" })],
      validation: (rule) => rule.min(1).max(4),
    }),
    defineField({
      name: "pillars",
      title: "Pillar cards",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Description",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "title" },
            prepare({ title }) {
              return {
                title: title ?? "Pillar",
                subtitle: "Overview pillar",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(3),
    }),
    defineField({
      name: "stats",
      title: "Stats",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon",
              type: "string",
              options: { list: iconOptions },
              initialValue: "users",
            }),
            defineField({
              name: "value",
              title: "Headline value",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "label",
              title: "Label",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Supporting text",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "value" },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Stat",
                subtitle,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(4),
    }),
  ],
  preview: {
    select: {
      title: "heading",
      stats: "stats",
    },
    prepare({ title, stats }) {
      const count = Array.isArray(stats) ? stats.length : 0;
      return {
        title: title ?? "About overview",
        subtitle: count ? `${count} stat${count === 1 ? "" : "s"}` : undefined,
      };
    },
  },
});
