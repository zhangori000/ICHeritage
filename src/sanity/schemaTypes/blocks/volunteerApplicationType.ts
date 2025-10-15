import { defineArrayMember, defineField, defineType } from "sanity";
import { ClipboardIcon } from "@sanity/icons";

const stepDefaults = [
  {
    title: "Choose Your Track",
    description:
      "Decide between Organizational or Workshop volunteer tracks based on your availability and interests.",
    timeEstimate: "5 minutes",
  },
  {
    title: "Complete Application",
    description:
      "Fill out our volunteer application form with your background, skills, and preferences.",
    timeEstimate: "15-20 minutes",
  },
  {
    title: "Background Check",
    description:
      "Complete a simple background check and provide references (for certain roles).",
    timeEstimate: "1-2 weeks",
  },
  {
    title: "Orientation & Training",
    description:
      "Attend volunteer orientation and receive role-specific training and resources.",
    timeEstimate: "2-3 hours",
  },
  {
    title: "Start Volunteering",
    description:
      "Begin making an impact! Get matched with projects and start contributing to cultural preservation.",
    timeEstimate: "Ongoing",
  },
];

const requirementDefaults = [
  "Must be 16+ years old (or 14+ with parent/guardian consent)",
  "Commit to minimum time requirements for the chosen track",
  "Complete volunteer orientation and required training",
  "Pass background check (for roles involving minors or sensitive work)",
  "Demonstrate genuine interest in cultural preservation",
  "Maintain professional conduct and represent ICHeritage values",
];

const trackDefaults = [
  {
    title: "Organizational Volunteers",
    description: "Join our core team for ongoing projects and strategic initiatives.",
    tone: "primary",
    highlights: [
      { icon: "clock", label: "5-15 hours/week commitment" },
      { icon: "users", label: "6+ month commitment preferred" },
    ],
    cta: { label: "Apply for Organizational Track", href: "/forms/volunteer-organizational" },
  },
  {
    title: "Workshop Volunteers",
    description: "Support events and workshops on a flexible, per-event basis.",
    tone: "secondary",
    highlights: [
      { icon: "clock", label: "2-6 hours per event" },
      { icon: "users", label: "Flexible event-by-event basis" },
    ],
    cta: { label: "Apply for Workshop Track", href: "/forms/volunteer-workshop" },
  },
];

const trackHighlightIcons = [
  { title: "Clock", value: "clock" },
  { title: "People", value: "users" },
  { title: "Calendar", value: "calendar" },
  { title: "Map", value: "map" },
  { title: "Sparkles", value: "sparkles" },
  { title: "Globe", value: "globe" },
];

export const volunteerApplicationType = defineType({
  name: "volunteerApplication",
  title: "Volunteer application",
  type: "object",
  icon: ClipboardIcon,
  fields: [
    defineField({
      name: "sectionId",
      title: "Section anchor id",
      type: "string",
      initialValue: "application",
    }),
    defineField({
      name: "heading",
      title: "Heading",
      type: "string",
      initialValue: "Ready to Join Our Team?",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 3,
      initialValue:
        "Getting started as a volunteer is easy! Follow our simple application process and you'll be making an impact in cultural preservation in no time.",
    }),
    defineField({
      name: "processHeading",
      title: "Process heading",
      type: "string",
      initialValue: "Application Process",
    }),
    defineField({
      name: "processSubheading",
      title: "Process subheading",
      type: "string",
      initialValue: "From application to active volunteer in 5 simple steps",
    }),
    defineField({
      name: "steps",
      title: "Steps",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", type: "text", rows: 3 }),
            defineField({ name: "timeEstimate", title: "Time estimate", type: "string" }),
          ],
          preview: {
            select: { title: "title", subtitle: "timeEstimate" },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Step",
                subtitle,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(3).max(6),
      initialValue: stepDefaults,
    }),
    defineField({
      name: "requirementsHeading",
      title: "Requirements heading",
      type: "string",
      initialValue: "Volunteer Requirements",
    }),
    defineField({
      name: "requirementsIntro",
      title: "Requirements intro",
      type: "text",
      rows: 3,
      initialValue: "Before applying, please ensure you meet our basic volunteer requirements:",
    }),
    defineField({
      name: "requirements",
      title: "Requirement list",
      type: "array",
      of: [{ type: "string" }],
      validation: (rule) => rule.min(3),
      initialValue: requirementDefaults,
    }),
    defineField({
      name: "tracks",
      title: "Volunteer tracks",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", type: "string", validation: (rule) => rule.required() }),
            defineField({ name: "description", type: "text", rows: 3 }),
            defineField({
              name: "tone",
              title: "Color tone",
              type: "string",
              options: {
                list: [
                  { title: "Primary", value: "primary" },
                  { title: "Secondary", value: "secondary" },
                  { title: "Accent", value: "accent" },
                ],
                layout: "radio",
              },
              initialValue: "primary",
            }),
            defineField({
              name: "highlights",
              title: "Highlights",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({
                      name: "icon",
                      title: "Icon",
                      type: "string",
                      options: { list: trackHighlightIcons },
                      initialValue: "clock",
                    }),
                    defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
                  ],
                  preview: {
                    select: { title: "label" },
                  },
                }),
              ],
              validation: (rule) => rule.max(4),
            }),
            defineField({
              name: "cta",
              title: "CTA",
              type: "object",
              fields: [
                defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "href", type: "string", readOnly: true }),
              ],
            }),
          ],
          preview: {
            select: { title: "title", subtitle: "description" },
          },
        }),
      ],
      validation: (rule) => rule.min(1).max(2),
      initialValue: trackDefaults,
    }),
    defineField({
      name: "supportHeading",
      title: "Support heading",
      type: "string",
      initialValue: "Questions About Volunteering?",
    }),
    defineField({
      name: "supportBody",
      title: "Support body",
      type: "text",
      rows: 3,
      initialValue:
        "Our volunteer coordinator is here to help you find the perfect opportunity and answer any questions about the application process.",
    }),
    defineField({
      name: "supportLinks",
      title: "Support links",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string", validation: (rule) => rule.required() }),
            defineField({
              name: "href",
              type: "string",
              validation: (rule) =>
                rule.custom((value) => {
                  if (!value) return "Provide a link.";
                  const trimmed = value.trim();
                  if (trimmed.startsWith("/") || trimmed.startsWith("http")) return true;
                  return "Start with / for internal links or use a full URL.";
                }),
            }),
          ],
          preview: {
            select: { title: "label", subtitle: "href" },
          },
        }),
      ],
      initialValue: [
        { label: "Contact Volunteer Coordinator", href: "/contact" },
        { label: "Read Volunteer FAQ", href: "/volunteers/faq" },
      ],
      validation: (rule) => rule.max(4),
    }),
  ],
  preview: {
    select: { title: "heading" },
    prepare({ title }) {
      return {
        title: title ?? "Volunteer application",
      };
    },
  },
});
