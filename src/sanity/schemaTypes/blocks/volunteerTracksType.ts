import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

const toneOptions = [
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Accent", value: "accent" },
  { title: "Muted", value: "muted" },
];

export const volunteerTracksType = defineType({
  name: "volunteerTracks",
  title: "Volunteer Tracks",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      description: "Optional anchor used for in-page navigation.",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Two Ways to Make an Impact",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 4,
      description:
        "Short paragraph displayed below the heading. Supports about 1-2 sentences.",
      initialValue:
        "Choose the volunteer track that fits your schedule, interests, and availability. Both paths offer meaningful ways to contribute to cultural preservation.",
    }),
    defineField({
      name: "tracks",
      title: "Tracks",
      type: "array",
      of: [
        defineArrayMember({
          name: "track",
          type: "object",
          fields: [
            defineField({
              name: "badgeLabel",
              title: "Badge label",
              type: "string",
              description: "Short label shown above the track title (e.g., Track 1).",
            }),
            defineField({
              name: "tone",
              title: "Tone",
              type: "string",
              options: {
                list: toneOptions,
                layout: "radio",
              },
              initialValue: "primary",
              description:
                "Controls background colors to complement the theme. Recommended to pick unique tones for each card.",
            }),
            defineField({
              name: "icon",
              title: "Icon name",
              type: "string",
              description:
                "Lucide icon name (e.g., building-2, calendar, clock, map-pin, sparkles). Leave blank to show a stylized initial.",
            }),
            defineField({
              name: "title",
              title: "Track title",
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
            defineField({
              name: "keyAreasHeading",
              title: "Key areas heading",
              type: "string",
              initialValue: "Key Areas",
            }),
            defineField({
              name: "keyAreas",
              title: "Key areas",
              type: "array",
              of: [{ type: "string" }],
              validation: (rule) => rule.min(1),
            }),
            defineField({
              name: "commitmentHeading",
              title: "Commitment heading",
              type: "string",
              initialValue: "Commitment",
            }),
            defineField({
              name: "commitmentItems",
              title: "Commitment details",
              type: "array",
              of: [
                defineArrayMember({
                  name: "commitment",
                  type: "object",
                  fields: [
                    defineField({
                      name: "icon",
                      title: "Icon name",
                      type: "string",
                      description:
                        "Lucide icon name (e.g., clock, calendar, map-pin). Leave blank for default dot.",
                    }),
                    defineField({
                      name: "text",
                      title: "Text",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "text",
                      subtitle: "icon",
                    },
                  },
                }),
              ],
              validation: (rule) => rule.min(1),
            }),
            defineField({
              name: "benefitsHeading",
              title: "Benefits heading",
              type: "string",
              initialValue: "Benefits",
            }),
            defineField({
              name: "benefits",
              title: "Benefits",
              type: "array",
              of: [{ type: "string" }],
              validation: (rule) => rule.min(1),
            }),
            defineField({
              name: "cta",
              title: "Primary CTA",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "href",
                  title: "Link",
                  type: "url",
                  description:
                    "Use a full URL or on-site path. Leave blank to create the destination later.",
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "badgeLabel",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Volunteer track",
                subtitle: subtitle ?? "Configure details for this track",
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(4),
    }),
    defineField({
      name: "callout",
      title: "Guidance callout",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          initialValue: "Not Sure Which Track is Right for You?",
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 4,
          description: "Helpful guidance shown beneath the tracks.",
        }),
        defineField({
          name: "links",
          title: "Call-to-action links",
          type: "array",
          of: [
            defineArrayMember({
              name: "link",
              type: "object",
              fields: [
                defineField({
                  name: "label",
                  title: "Label",
                  type: "string",
                  validation: (rule) => rule.required(),
                }),
                defineField({
                  name: "href",
                  title: "Link",
                  type: "url",
                }),
              ],
              preview: {
                select: {
                  title: "label",
                  subtitle: "href",
                },
              },
            }),
          ],
          validation: (rule) => rule.max(2),
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title ?? "Volunteer tracks",
      };
    },
  },
});
