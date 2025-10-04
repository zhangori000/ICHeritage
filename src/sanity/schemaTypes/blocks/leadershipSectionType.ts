import { defineArrayMember, defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

export const leadershipSectionType = defineType({
  name: "leadershipSection",
  title: "Leadership & Team",
  type: "object",
  icon: UsersIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      description: "Optional anchor id without the # (e.g. leadership).",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "executiveHeading",
      title: "Executive heading",
      type: "string",
      initialValue: "Executive Team",
    }),
    defineField({
      name: "executiveSubheading",
      title: "Executive subheading",
      type: "string",
    }),
    defineField({
      name: "executiveTeam",
      title: "Executive team",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "title",
              title: "Role",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "credential",
              title: "Credential",
              type: "string",
            }),
            defineField({
              name: "bio",
              title: "Short bio",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "headshot",
              title: "Headshot",
              type: "image",
              options: { hotspot: true },
            }),
            defineField({
              name: "linkedin",
              title: "LinkedIn URL",
              type: "url",
            }),
            defineField({
              name: "email",
              title: "Email",
              type: "string",
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "title", media: "headshot" },
            prepare({ title, subtitle, media }) {
              return {
                title: title ?? "Team member",
                subtitle,
                media,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "advisoryHeading",
      title: "Advisory heading",
      type: "string",
      initialValue: "Advisory Board",
    }),
    defineField({
      name: "advisorySubheading",
      title: "Advisory subheading",
      type: "string",
    }),
    defineField({
      name: "advisors",
      title: "Advisors",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Name",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "role",
              title: "Role",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "expertise",
              title: "Expertise badge",
              type: "string",
            }),
            defineField({
              name: "bio",
              title: "Bio",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: { title: "name", subtitle: "role" },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Advisor",
                subtitle,
              };
            },
          },
        }),
      ],
    }),
    defineField({
      name: "ctaCard",
      title: "CTA card",
      type: "object",
      fields: [
        defineField({
          name: "heading",
          title: "Heading",
          type: "string",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "body",
          title: "Body",
          type: "text",
          rows: 3,
        }),
        defineField({
          name: "primaryCta",
          title: "Primary CTA",
          type: "object",
          fields: [
            defineField({
              name: "label",
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
              description: "Use a relative path (e.g. /volunteer) or leave empty for now.",
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
              title: "Label",
              type: "string",
            }),
            defineField({
              name: "href",
              title: "Link",
              type: "string",
            }),
          ],
        }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "heading",
      execs: "executiveTeam",
    },
    prepare({ title, execs }) {
      const count = Array.isArray(execs) ? execs.length : 0;
      return {
        title: title ?? "Leadership section",
        subtitle: count ? `${count} executive member${count === 1 ? "" : "s"}` : undefined,
      };
    },
  },
});
