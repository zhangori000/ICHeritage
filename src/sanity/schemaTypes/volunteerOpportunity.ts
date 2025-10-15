import { defineField, defineType } from "sanity";
import { UsersIcon } from "@sanity/icons";

const defaultResponsibilities = [
  "Collaborate closely with our core team to identify the most urgent volunteer needs.",
  "Coordinate communication with prospective volunteers and match them to suitable roles.",
  "Track progress and share impact updates during weekly stand-ups.",
];

const defaultQualifications = [
  "Strong communicator who enjoys helping people find their perfect role.",
  "Experience with community coordination or volunteer management is a plus.",
  "Comfortable working in collaborative, fast-paced environments.",
];

const defaultBenefits = [
  "Make a measurable impact by supporting volunteers across multiple programs.",
  "Gain experience with community organizing and people operations.",
  "Join a friendly, mission-aligned team that values empathy and initiative.",
];

const defaultApplicationSteps = [
  {
    title: "Submit the volunteer interest form",
    description:
      "Share your goals, availability, and relevant experience so we can understand your interests and schedule.",
  },
  {
    title: "Chat with our volunteer coordinator",
    description:
      "We’ll schedule a short introduction call to answer questions and align on expectations.",
  },
  {
    title: "Complete onboarding and start contributing",
    description:
      "Receive your welcome kit, meet the team, and begin supporting our programs where your skills shine.",
  },
];

export const volunteerOpportunityType = defineType({
  name: "volunteerOpportunity",
  title: "Volunteer Opportunity",
  type: "document",
  icon: UsersIcon,
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
      title: "Card summary",
      type: "text",
      rows: 3,
      description: "Short description shown on the volunteer listing and search results.",
    }),
    defineField({
      name: "trackLabel",
      title: "Track label",
      type: "string",
      description: "Displayed as the pill on the volunteer card (e.g. Organizational Support).",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "commitmentSummary",
      title: "Commitment summary",
      type: "string",
      description: 'Short note such as "5 hrs/week • ongoing".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
      description: 'For example "Remote", "San Francisco, CA", or "Hybrid • New York, NY".',
    }),
    defineField({
      name: "openings",
      title: "Open positions",
      type: "number",
      description: "Number of available spots. Leave blank if flexible.",
    }),
    defineField({
      name: "experienceLevel",
      title: "Experience level note",
      type: "string",
      description: "Displayed under the details to set expectations, e.g. All experience levels welcome.",
      initialValue: "All experience levels welcome",
    }),
    defineField({
      name: "isUrgent",
      title: "Mark as urgent need",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "isRemoteFriendly",
      title: "Remote friendly",
      type: "boolean",
      initialValue: true,
      description: "Toggle off if the role requires in-person participation.",
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
      name: "applyUrl",
      title: "Application URL",
      type: "string",
      description: "External link for the application form. Leave empty to route to a contact email or on-page form.",
    }),
    defineField({
      name: "responsibilities",
      title: "Key responsibilities",
      type: "array",
      of: [{ type: "string" }],
      initialValue: defaultResponsibilities,
    }),
    defineField({
      name: "qualifications",
      title: "Preferred qualifications",
      type: "array",
      of: [{ type: "string" }],
      initialValue: defaultQualifications,
    }),
    defineField({
      name: "benefits",
      title: "Volunteer benefits",
      type: "array",
      of: [{ type: "string" }],
      initialValue: defaultBenefits,
    }),
    defineField({
      name: "applicationProcess",
      title: "Application process",
      type: "array",
      of: [
        defineField({
          name: "step",
          type: "object",
          fields: [
            defineField({
              name: "title",
              title: "Step title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Step description",
              type: "text",
              rows: 3,
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
          },
        }),
      ],
      initialValue: defaultApplicationSteps,
    }),
    defineField({
      name: "contact",
      title: "Contact details",
      type: "object",
      fields: [
        defineField({
          name: "ctaLabel",
          title: "Primary CTA label",
          type: "string",
          initialValue: "Learn More & Apply",
        }),
        defineField({
          name: "instructions",
          title: "Instructions",
          type: "text",
          rows: 3,
          description: "Optional message displayed in the sidebar (e.g. how quickly you respond).",
        }),
        defineField({
          name: "email",
          title: "Contact email",
          type: "string",
        }),
        defineField({
          name: "phone",
          title: "Contact phone",
          type: "string",
        }),
        defineField({
          name: "responseNote",
          title: "Response note",
          type: "string",
          description: "Short reassurance like “We reply within 2 business days.”",
        }),
      ],
    }),
    defineField({
      name: "body",
      title: "Full description",
      type: "blockContent",
      description: "Long-form description shown on the individual opportunity page.",
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "trackLabel",
      media: "heroImage",
    },
    prepare({ title, subtitle, media }) {
      return {
        title: title ?? "Volunteer Opportunity",
        subtitle: subtitle ?? "Volunteer role",
        media,
      };
    },
  },
});
