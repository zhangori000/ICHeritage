import { type SchemaTypeDefinition } from "sanity";

import blogPost from "./blogPost";
import author from "./author";
import category from "./category";
import event from "./event";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [blogPost, category, author, event],
};
