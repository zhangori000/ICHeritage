import { defineField, defineType } from "sanity";

export const workshopType = defineType({
  name: "workshop",
  title: "Workshop",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
      description: "Short summary shown on the workshops listing cards.",
    }),
    defineField({
      name: "categories",
      title: "Categories",
      type: "array",
      of: [
        defineField({
          name: "category",
          type: "reference",
          to: [{ type: "workshopCategory" }],
        }),
      ],
      description: "Select one or more categories to organize this workshop.",
    }),
    defineField({
      name: "start",
      title: "Start",
      type: "datetime",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "end",
      title: "End",
      type: "datetime",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "capacity",
      title: "Capacity",
      type: "number",
      description: "Maximum number of participants",
    }),
    defineField({
      name: "registeredCount",
      title: "Registered count",
      type: "number",
      description: "How many participants are currently registered",
    }),
    defineField({
      name: "needsVolunteers",
      title: "Needs volunteers",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "registerUrl",
      title: "Register URL",
      type: "url",
      description: "Link to the registration form or page",
    }),
    defineField({
      name: "volunteerUrl",
      title: "Volunteer URL",
      type: "url",
      description: "Optional volunteer signup link",
    }),
    defineField({
      name: "volunteerResponses",
      title: "Volunteer responses",
      type: "array",
      description:
        "Automatically populated with volunteer submissions. You can also add or remove entries manually.",
      of: [
        defineField({
          name: "volunteerReference",
          type: "reference",
          to: [{ type: "workshopVolunteer" }],
        }),
      ],
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
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
      name: "hosts",
      title: "Hosts",
      type: "array",
      description: "People presenting or hosting this workshop.",
      of: [
        defineField({
          name: "host",
          title: "Host",
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
              title: "Role or affiliation",
              type: "string",
            }),
            defineField({
              name: "avatar",
              title: "Avatar",
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
              name: "socialLinks",
              title: "Social links",
              type: "array",
              of: [
                defineField({
                  name: "link",
                  title: "Link",
                  type: "object",
                  fields: [
                    defineField({
                      name: "label",
                      title: "Label",
                      type: "string",
                      validation: (rule) => rule.required(),
                    }),
                    defineField({
                      name: "url",
                      title: "URL",
                      type: "url",
                      validation: (rule) => rule.required(),
                    }),
                  ],
                  preview: {
                    select: {
                      title: "label",
                      subtitle: "url",
                    },
                  },
                }),
              ],
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "role",
              media: "avatar",
            },
          },
        }),
      ],
    }),
    defineField({
      name: "contact",
      title: "Contact settings",
      type: "object",
      options: { collapsible: true },
      initialValue: {
        ctaLabel: "Contact the host",
        instructions: "Have a question about the event? You can send a message to the host",
      },
      fields: [
        defineField({
          name: "ctaLabel",
          title: "Button label",
          type: "string",
          initialValue: "Contact the host",
          description: "Text for the contact button on the workshop page.",
        }),
        defineField({
          name: "instructions",
          title: "Modal instructions",
          type: "text",
          rows: 3,
          initialValue: "Have a question about the event? You can send a message to the host",
          description:
            "Short welcome message that appears at the top of the contact modal. Explain what happens after someone submits.",
        }),
        defineField({
          name: "email",
          title: "Contact email (shown to attendees)",
          type: "string",
          description:
            "Where should attendee questions be delivered? This email is shown in the modal so participants know who will reply.",
          validation: (rule) =>
            rule.email().warning("Enter a valid email address, or leave blank if you do not use email."),
        }),
        defineField({
          name: "phone",
          title: "Contact phone (optional)",
          type: "string",
          description:
            "Optional phone number to display alongside the email. Use if you prefer SMS responses.",
        }),
        defineField({
          name: "responseNote",
          title: "Response note",
          type: "string",
          description:
            "Extra reassurance for attendees (for example, \"We respond within 24 hours\"). Shown under the contact info.",
        }),
      ],
    }),
    defineField({
      name: "externalLinks",
      title: "External links",
      type: "array",
      of: [
        defineField({
          name: "link",
          title: "Link",
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
              title: "URL",
              type: "url",
              validation: (rule) => rule.required(),
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
      description: "Partner or supporting links displayed as buttons.",
    }),
    defineField({
      name: "body",
      title: "Workshop details",
      type: "blockContent",
      description: "Full details shown on the individual workshop page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "heroImage",
    },
  },
});
