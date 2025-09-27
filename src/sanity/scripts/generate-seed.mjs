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

function generatePosts(n) {
  return Array.from({ length: n }).map(() => {
    const title = faker.lorem.sentence();
    return {
      _type: "blogPost",
      title,
      slug: { current: slugify(title) },
      author: faker.person.fullName(),
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

function toNDJSON(docs) {
  return docs.map((doc) => JSON.stringify(doc)).join("\n");
}

const outPath = path.resolve("./src/sanity/seed.ndjson");
const events = generateEvents(20);
const posts = generatePosts(20);
const ndjson = toNDJSON([...events, ...posts]);

fs.writeFileSync(outPath, ndjson);
console.log(
  `✅ Generated ${events.length} events + ${posts.length} posts at ${outPath}`
);
