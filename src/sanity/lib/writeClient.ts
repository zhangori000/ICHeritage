import { client } from "./client";
import { writeToken } from "./writeToken";

export const writeClient = client.withConfig({
  token: writeToken,
  useCdn: false,
});

