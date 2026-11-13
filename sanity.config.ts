"use client";

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\studio\[[...tool]]\page.tsx` route
 */

import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import { apiVersion, dataset, projectId } from "./src/sanity/env";
import { schema } from "./src/sanity/schemaTypes";
import { structure } from "./src/sanity/structure";
import { colorInput } from "@sanity/color-input";
import { resolve } from "./src/sanity/presentation/resolve";
import { photosTool } from "./src/sanity/tools/photos";

export default defineConfig({
  basePath: "/studio",
  projectId,
  dataset,
  scheduledPublishing: { enabled: false },
  tasks: { enabled: false },
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema,
  plugins: [
    structureTool({ structure }),
    // Vision is for querying with GROQ from inside the Studio
    // https://www.sanity.io/docs/the-vision-plugin
    visionTool({ defaultApiVersion: apiVersion }),
    presentationTool({
      resolve,
      previewUrl: {
        previewMode: {
          enable: "/api/draft-mode/enable",
        },
      },
    }),
    colorInput(),
  ],
  // "Photos" sits right after the content editor in the top bar.
  tools: (prev) => {
    const at = prev.findIndex((tool) => tool.name === "structure") + 1;
    return [...prev.slice(0, at), photosTool(), ...prev.slice(at)];
  },
  document: {
    newDocumentOptions: (prev) =>
      prev.filter((item) => item.templateId !== "siteSettings"),
  },
});
