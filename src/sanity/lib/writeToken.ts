const fallbackToken =
  process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

if (!fallbackToken) {
  throw new Error("Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN fallback).");
}

export const writeToken = fallbackToken;

