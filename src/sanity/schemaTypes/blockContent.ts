import { defineType, defineArrayMember } from "sanity";

/**
 * This is the schema definition for the rich text fields used for
 * for this blog studio. When you import it in schemas.js it can be
 * reused in other parts of the studio with:
 *  {
 *    name: 'someName',
 *    title: 'Some title',
 *    type: 'blockContent'
 *  }
 */
export default defineType({
  title: "Block Content",
  name: "blockContent",
  type: "array",
  of: [
    defineArrayMember({
      title: "Block",
      type: "block",
      // Styles let you set what your user can mark up blocks with. These
      // correspond with HTML tags, but you can set any title or value
      // you want and decide how you want to deal with it where you want to
      // use your content.
      styles: [
        { title: "Normal", value: "normal" },
        { title: "H1", value: "h1" },
        { title: "H2", value: "h2" },
        { title: "H3", value: "h3" },
        { title: "H4", value: "h4" },
        { title: "Quote", value: "blockquote" },
      ],
      lists: [
        { title: "Bullet", value: "bullet" },
        { title: "Numbered", value: "number" },
      ],
      // Marks let you mark up inline text in the block editor.
      marks: {
        // Decorators usually describe a single property – e.g. a typographic
        // preference or highlighting by editors.
        decorators: [
          { title: "Strong", value: "strong" },
          { title: "Emphasis", value: "em" },
          { title: "Underline", value: "underline" },
          { title: "Strike", value: "strike-through" },
          { title: "Code", value: "code" },
        ],
        // Annotations can be any object structure – e.g. a link or a footnote.
        annotations: [
          {
            title: "URL",
            name: "link",
            type: "object",
            fields: [
              {
                title: "URL",
                name: "href",
                type: "url",
              },
              {
                title: "Open in new tab",
                name: "newTab",
                type: "boolean",
                initialValue: false,
              },
            ],
          },
        ],
      },
    }),
    // You can add additional types here. Note that you can't use
    // primitive types such as 'string' and 'number' in the same array
    // as a block type.
    defineArrayMember({
      type: "image",
      options: { hotspot: true },
    }),
    defineArrayMember({
      name: "codeBlock",
      type: "object",
      title: "Code Snippet",
      fields: [
        {
          name: "filename",
          title: "Filename",
          type: "string",
        },
        {
          name: "language",
          title: "Language",
          type: "string",
          options: {
            list: [
              { title: "JavaScript", value: "javascript" },
              { title: "TypeScript", value: "typescript" },
              { title: "JSON", value: "json" },
              { title: "Shell", value: "shell" },
              { title: "Markdown", value: "markdown" },
            ],
          },
        },
        {
          name: "code",
          title: "Code",
          type: "text",
          rows: 8,
          validation: (rule) => rule.required(),
        },
      ],
      preview: {
        select: {
          title: "filename",
          subtitle: "language",
        },
        prepare({ title, subtitle }) {
          return {
            title: title || "Code Snippet",
            subtitle: subtitle || undefined,
          };
        },
      },
    }),
    defineArrayMember({
      name: "divider",
      type: "object",
      title: "Divider",
      fields: [
        {
          name: "style",
          type: "string",
          hidden: true,
          initialValue: "divider",
        },
      ],
      preview: {
        prepare() {
          return {
            title: "Divider",
          };
        },
      },
    }),
  ],
});
