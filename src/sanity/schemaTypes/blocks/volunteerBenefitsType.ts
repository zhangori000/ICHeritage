import { defineArrayMember, defineField, defineType } from "sanity";
import { StarIcon } from "@sanity/icons";

const toneOptions = [
  { title: "Primary", value: "primary" },
  { title: "Secondary", value: "secondary" },
  { title: "Accent", value: "accent" },
];

const defaultBenefits = [
  {
    icon: "heart",
    tone: "primary",
    title: "Support Culture",
    description:
      "Make a meaningful impact in preserving Chinese heritage for future generations.",
    points: [
      "Directly contribute to cultural preservation initiatives",
      "Help bridge generational and cultural gaps",
      "Support community education and awareness programs",
      "Create lasting positive change in local communities",
    ],
  },
  {
    icon: "lightbulb",
    tone: "secondary",
    title: "Gain Experience",
    description:
      "Develop valuable professional and personal skills through hands-on work.",
    points: [
      "Event planning and project management experience",
      "Marketing, communications, and social media skills",
      "Leadership and team collaboration abilities",
      "Cross-cultural communication and sensitivity training",
    ],
  },
  {
    icon: "users",
    tone: "accent",
    title: "Join Community",
    description:
      "Connect with passionate individuals who share your values and interests.",
    points: [
      "Build lasting friendships with like-minded volunteers",
      "Network with cultural experts and community leaders",
      "Join a supportive and inclusive volunteer community",
      "Participate in volunteer appreciation events and gatherings",
    ],
  },
  {
    icon: "award",
    tone: "primary",
    title: "Recognition & Growth",
    description:
      "Receive formal recognition and opportunities for personal development.",
    points: [
      "Volunteer appreciation certificates and awards",
      "Professional references and recommendation letters",
      "Access to exclusive training workshops and seminars",
      "Leadership development and mentorship opportunities",
    ],
  },
  {
    icon: "book-open",
    tone: "secondary",
    title: "Cultural Learning",
    description:
      "Deepen your understanding of Chinese culture, history, and traditions.",
    points: [
      "Learn from cultural experts and master practitioners",
      "Gain insights into traditional arts, languages, and customs",
      "Access exclusive educational resources and materials",
      "Participate in cultural immersion experiences",
    ],
  },
  {
    icon: "globe",
    tone: "accent",
    title: "Global Impact",
    description:
      "Be part of a worldwide movement preserving cultural heritage.",
    points: [
      "Connect with volunteers and chapters internationally",
      "Contribute to global cultural preservation efforts",
      "Share best practices with volunteers worldwide",
      "Participate in international cultural exchange programs",
    ],
  },
];

const defaultTestimonials = [
  {
    quote:
      "Volunteering with ICHeritage has been transformative. I've learned so much about my own culture while helping others connect with theirs. The community here is incredibly supportive.",
    name: "Sarah Chen",
    role: "Workshop Volunteer, San Francisco",
  },
  {
    quote:
      "The leadership skills I've developed through my organizational volunteer role have been invaluable for my career. Plus, the work we do here truly matters.",
    name: "Michael Zhang",
    role: "Organizational Volunteer, New York",
  },
  {
    quote:
      "What I love most is the flexibility. I can volunteer for events that fit my schedule while still making a meaningful contribution to cultural preservation.",
    name: "Lisa Wang",
    role: "Workshop Volunteer, Los Angeles",
  },
];

export const volunteerBenefitsType = defineType({
  name: "volunteerBenefits",
  title: "Volunteer Benefits",
  type: "object",
  icon: StarIcon,
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
      initialValue: "Why Volunteer with ICHeritage?",
    }),
    defineField({
      name: "intro",
      title: "Intro text",
      type: "text",
      rows: 4,
      initialValue:
        "Volunteering with us offers unique opportunities for personal growth, cultural learning, and meaningful community impact. Here's what you'll gain from the experience.",
    }),
    defineField({
      name: "benefits",
      title: "Benefit cards",
      type: "array",
      of: [
        defineArrayMember({
          name: "benefit",
          type: "object",
          fields: [
            defineField({
              name: "icon",
              title: "Icon name",
              type: "string",
              description: "Lucide icon keyword (e.g. heart, users, award).",
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
            }),
            defineField({
              name: "title",
              title: "Card title",
              type: "string",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "description",
              title: "Card description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "points",
              title: "Highlights",
              type: "array",
              of: [{ type: "string" }],
              validation: (rule) => rule.min(1),
            }),
          ],
          preview: {
            select: {
              title: "title",
              subtitle: "description",
            },
            prepare({ title, subtitle }) {
              return {
                title: title ?? "Benefit",
                subtitle,
              };
            },
          },
        }),
      ],
      validation: (rule) => rule.min(3).max(6),
      initialValue: defaultBenefits,
    }),
    defineField({
      name: "testimonialsHeading",
      title: "Testimonials heading",
      type: "string",
      initialValue: "What Our Volunteers Say",
    }),
    defineField({
      name: "testimonialsIntro",
      title: "Testimonials intro",
      type: "string",
      initialValue: "Hear from volunteers about their experiences and the impact they've made.",
    }),
    defineField({
      name: "testimonials",
      title: "Testimonials",
      type: "array",
      of: [
        defineArrayMember({
          name: "testimonial",
          type: "object",
          fields: [
            defineField({
              name: "quote",
              title: "Quote",
              type: "text",
              rows: 4,
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "name",
              title: "Name",
              type: "string",
            }),
            defineField({
              name: "role",
              title: "Role / location",
              type: "string",
            }),
          ],
          preview: {
            select: {
              title: "name",
              subtitle: "role",
            },
          },
        }),
      ],
      validation: (rule) => rule.max(6),
      initialValue: defaultTestimonials,
    }),
  ],
  preview: {
    select: {
      title: "heading",
    },
    prepare({ title }) {
      return {
        title: title ?? "Volunteer benefits",
      };
    },
  },
});
