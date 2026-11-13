# Sanity and Next.js

This is a [Sanity.io](https://sanity.io) and [Next.js](https://nextjs.org) project created following a Course on [Sanity Learn](https://sanity.io/learn).

I used the above template to begin the foundation for ICHeritage. This allows for the owner of ICHeritage to modify content of this without contacting developer all the time

## Getting Started

First, run the development server:

```bash
npm run dev
```

- Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
- Open [http://localhost:3000/studio](http://localhost:3000/studio) to edit content.

# References

Sanity set up course:
https://www.sanity.io/learn/course/content-driven-web-application-foundations/build-up-the-blog

Visual Editing guide
https://www.sanity.io/learn/course/visual-editing-with-next-js/token-handling-and-security

Run this to move developmetn dataset to production (delete the developmetn.tar.gz later)
`npx sanity@latest dataset export development`
`npx sanity@latest dataset import development.tar.gz production --replace`

Or just run the npm command in package.json

# Editing content (for the site owner)

Everything below is done in Sanity Studio at `/studio` — no code changes or redeploy needed.

- **Show / hide Workshops and Brands** — `Site Settings → Section visibility`. Both are off by
  default: the links disappear from the menu and `/workshops` and `/brands` redirect to the home page.
  Tip: if a home-page card still links to a hidden section, edit that card under `Pages → Home Page`.
- **Gallery photos** — open the **Photos** tab at the top of Studio (`/studio/photos`, works on a phone too).
  Press **New album**, give it a title, then drag photos onto the page or press **Choose photos** (as many as
  you like; big photos are shrunk automatically). Click a photo to caption it, drag to reorder, star one to
  make it the cover, or use **Select** to move or remove several at once. Every change saves and goes live
  right away, with **Undo** for anything removed or moved. New albums start hidden: flip **Show on website**
  when they are ready. An album that still links to iCloud shows how to bring its photos in and a button to
  remove the link. `Gallery → Gallery Page Settings` controls the hero text.
- **Articles / newsletters** — `Resources → Articles & Newsletters → + Create`. Write the article in the
  **Body** field (headings, links, and inline images are supported) and optionally attach a PDF under
  **Downloadable file**. Published articles appear automatically on `/resources`.
- **Footer contact details** — `Site Settings` (email and phone). The street address is no longer shown.
- **Donate button** — `Site Settings → Donate link`. Empty = the header shows “Donate · Soon” (disabled). Paste a
  PayPal/Zeffy/Givebutter link and it goes live immediately.
- **Newsletter sign-up** — not connected to a mailing service yet, so the site shows “coming soon” notes instead of
  a form. `Site Settings → Newsletter → Show newsletter teaser` hides the footer note if you prefer.
- **Privacy Policy / Terms** — footer links appear automatically once you create pages with the slugs `privacy`
  and `terms` under `Pages`.

## Developer notes

- Stack: Next.js 16 (Turbopack), React 19.3, Sanity Studio v6 embedded at `/studio`, next-sanity v13.
- `npm run typegen` regenerates `src/sanity/types.ts` (Sanity v6 renamed query result types to `*_QUERY_RESULT`).
- All `sanityFetch` calls pass `stega: false` so components keep the clean TypeGen types; block-level click-to-edit in
  Presentation still works through `createDataAttribute` in `PageBuilder`.
- Local build needs `NEXT_PUBLIC_SANITY_PROJECT_ID`, `NEXT_PUBLIC_SANITY_DATASET`, `SANITY_API_READ_TOKEN`
  (and `RESEND_API_KEY` at runtime for the email forms).
