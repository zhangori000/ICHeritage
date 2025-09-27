import { type SchemaTypeDefinition } from "sanity";

import event from "./event";
import blogPost from "./blogPost";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [event, blogPost],
};
