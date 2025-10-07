import { defineArrayMember, defineField, defineType } from "sanity";
import { MicrophoneIcon } from "@sanity/icons";

export const podcastHighlightsType = defineType({
  name: "podcastHighlights",
  title: "Podcast Highlights",
  type: "object",
  icon: MicrophoneIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      description: "Optional anchor id without the # (e.g. podcast).",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Heritage Voices Podcast",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "episodes",
      title: "Episodes",
      type: "array",
      validation: (rule) => rule.min(1),
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "episodeLabel",
              title: "Episode label",
              type: "string",
              description: "E.g. Episode 15",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "duration",
              title: "Duration",
              type: "string",
              description: "E.g. 45 min",
            }),
            defineField({
              name: "publishedAt",
              title: "Published date",
              type: "date",
            }),
            defineField({
              name: "title",
              title: "Title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "guestName",
              title: "Guest name",
              type: "string",
            }),
            defineField({
              name: "guestTitle",
              title: "Guest title",
              type: "string",
            }),
            defineField({
              name: "programTag",
              title: "Program tag",
              type: "string",
              description: "Short tag shown under the guest info.",
            }),
            defineField({
              name: "summary",
              title: "Episode summary",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "heroImage",
              title: "Episode image",
              type: "image",
              options: { hotspot: true },
              fields: [
                defineField({
                  name: "alt",
                  title: "Alternative text",
                  type: "string",
                }),
              ],
            }),
            defineField({
              name: "youtubeUrl",
              title: "Listen now (YouTube)",
              type: "url",
            }),
            defineField({
              name: "spotifyUrl",
              title: "Spotify link",
              type: "url",
            }),
            defineField({
              name: "appleUrl",
              title: "Apple Podcasts link",
              type: "url",
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "episodeLabel",
              media: "heroImage",
            },
            prepare({ title, subtitle, media }) {
              return {
                title: title ?? "Podcast episode",
                subtitle,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "platformHeading",
      title: "Platform heading",
      type: "string",
      initialValue: "Listen on Your Favorite Platform",
    }),
    defineField({
      name: "platforms",
      title: "Platforms",
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
              name: "href",
              title: "Link",
              type: "url",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "platform",
              title: "Platform type",
              type: "string",
              options: {
                list: [
                  { title: "Spotify", value: "spotify" },
                  { title: "Apple Podcasts", value: "apple" },
                  { title: "YouTube", value: "youtube" },
                  { title: "Other", value: "other" },
                ],
              },
              initialValue: "other",
            }),
          ],
          preview: {
            select: { title: "label" },
            prepare({ title }) {
              return {
                title: title ?? "Platform link",
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "viewAllCta",
      title: "View all CTA",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Label",
          type: "string",
          initialValue: "View All Episodes",
        }),
        defineField({
          name: "href",
          title: "Link",
          type: "string",
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      episodes: "episodes",
    },
    prepare({ title, episodes }) {
      const count = Array.isArray(episodes) ? episodes.length : 0;
      return {
        title: title ?? "Podcast highlights",
        subtitle: count ? `${count} episode${count === 1 ? "" : "s"}` : undefined,
      };
    },
  },
});
