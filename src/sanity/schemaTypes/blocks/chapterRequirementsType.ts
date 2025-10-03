import { defineArrayMember, defineField, defineType } from "sanity";
import { CheckmarkCircleIcon } from "@sanity/icons";

const toneOptions: { title: string; value: "primary" | "secondary" | "accent" | "muted" }[] = [
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Accent", value: "accent" },
  { title: "Muted", value: "muted" },
];

const cardIconOptions = [
  { title: "Users", value: "users" },
  { title: "Book", value: "book-open" },
  { title: "Calendar", value: "calendar" },
  { title: "Target", value: "target" },
  { title: "Globe", value: "globe" },
  { title: "Heart", value: "heart" },
  { title: "Award", value: "award" },
  { title: "Lightbulb", value: "lightbulb" },
  { title: "Sparkles", value: "sparkles" },
];

export const chapterRequirementsType = defineType({
  name: "chapterRequirements",
  title: "Chapter Requirements",
  type: "object",
  icon: CheckmarkCircleIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      description: "Optional anchor id without the # (e.g. requirements).",
    }),
    defineField({
      name: "heading",
      title: "Section heading",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      description: "Short paragraph beneath the heading.",
    }),
    defineField({
      name: "cards",
      title: "Requirement cards",
      type: "array",
      validation: (rule) => rule.min(1).max(4),
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
              name: "icon",
              title: "Icon",
              type: "string",
              options: { list: cardIconOptions },
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "tone",
              title: "Accent tone",
              type: "string",
              options: { list: toneOptions, layout: "radio" },
              initialValue: "primary",
            }),
            defineField({
              name: "points",
              title: "Requirements",
              type: "array",
              of: [defineArrayMember({ type: "string" })],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "tone",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Requirement",
                subtitle: subtitle ? `Tone: ${subtitle}` : undefined,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "processCard",
      title: "Application process card",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Application Process",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "steps",
          title: "Steps",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Step",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "duration",
                  title: "Duration",
                  type: "string",
                }),
              ],
              preview: {
                select: { title: "label", subtitle: "duration" },
                prepare({ title, subtitle }) {
                  return {
                    title: title ?? "Step",
                    subtitle,
                  };
                },
              },
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
    }),
    defineField({
      name: "metricsCard",
      title: "Success metrics card",
      type: "object",
      fields: [
        defineField({
          name: "title",
          title: "Title",
          type: "string",
          initialValue: "Success Metrics",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "metrics",
          title: "Metrics",
          type: "array",
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "value",
                  title: "Value",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
              ],
              preview: {
                select: { title: "label", subtitle: "value" },
                prepare({ title, subtitle }) {
                  return {
                    title: title ?? "Metric",
                    subtitle,
                  };
                },
              },
            }),
          ],
          validation: (rule) => rule.min(1),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      cards: "cards",
    },
    prepare({ title, cards }) {
      const total = Array.isArray(cards) ? cards.length : 0;
      return {
        title: title ?? "Chapter requirements",
        subtitle: total ? `${total} card${total === 1 ? "" : "s"}` : undefined,
      };
    },
  },
});
