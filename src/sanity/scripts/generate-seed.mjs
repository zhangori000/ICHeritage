// ./src/sanity/scripts/generate-seed.mjs
import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";

// Simple slugify helper
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "");
}

// Generate Authors
function generateAuthors(n) {
  return Array.from({ length: n }).map(() => {
    const name = faker.person.fullName();
    return {
      _id: slugify(name), // stable ID for reference
      _type: "author",
      name,
      slug: { current: slugify(name) },
      image: undefined, // could add later with faker.image
      bio: [
        {
          _type: "block",
          children: [{ _type: "span", text: faker.lorem.sentence() }],
        },
      ],
    };
  });
}

// Generate Events
function generateEvents(n) {
  return Array.from({ length: n }).map(() => {
    const title = faker.company.catchPhrase();
    return {
      _type: "event",
      title,
      slug: { current: slugify(title) },
      description: faker.lorem.paragraph(),
      date: faker.date.future().toISOString(),
      location: faker.location.city(),
      link: faker.datatype.boolean() ? faker.internet.url() : undefined,
      needsVolunteer: faker.datatype.boolean(),
    };
  });
}

// ✅ Generate a single "general" category doc
function generateGeneralCategory() {
  return {
    _id: "general-category", // stable ID for reference
    _type: "category",
    title: "General",
    slug: { current: "general" },
    description: "Default catch-all category for blog posts.",
  };
}

// Generate Blog Posts with Author references + default category
function generatePosts(n, authors, generalCategory) {
  return Array.from({ length: n }).map(() => {
    const author = faker.helpers.arrayElement(authors);
    const title = faker.lorem.sentence();
    return {
      _type: "blogPost",
      title,
      slug: { current: slugify(title) },
      author: {
        _type: "reference",
        _ref: author._id, // link to an author doc
      },
      categories: [
        {
          _type: "reference",
          _ref: generalCategory._id, // assign "General"
        },
      ],
      publishedAt: faker.date.past().toISOString(),
      body: [
        {
          _type: "block",
          children: [{ _type: "span", text: faker.lorem.paragraph() }],
        },
      ],
    };
  });
}

// Convert docs to NDJSON
function toNDJSON(docs) {
  return docs.map((doc) => JSON.stringify(doc)).join("\n");
}

// Main script
const outPath = path.resolve("./src/sanity/seed.ndjson");

const authors = generateAuthors(5); // 5 fake authors
const events = generateEvents(20);
const generalCategory = generateGeneralCategory();
const posts = generatePosts(20, authors, generalCategory);

const ndjson = toNDJSON([generalCategory, ...authors, ...events, ...posts]);

fs.writeFileSync(outPath, ndjson);
console.log(
  `✅ Generated ${authors.length} authors, ${events.length} events, ${
    posts.length
  } posts, and 1 general category at ${outPath}`
);
