import type { StructureResolver } from "sanity/structure";
import { CogIcon } from "@sanity/icons/Cog";
import { DocumentsIcon } from "@sanity/icons/Documents";
import { ImagesIcon } from "@sanity/icons/Images";
import { BookIcon } from "@sanity/icons/Book";

// Document types that get a dedicated spot in the sidebar below.
// Everything else falls into the "catch-all" list at the bottom.
const PINNED_TYPES = [
  "siteSettings",
  "page",
  "faq",
  "event",
  "newsletter",
  "galleryAlbum",
  "gallerySettings",
  "brand",
  // Blog types are kept out of the sidebar (see commented block below).
  "blogPost",
  "category",
  "author",
];

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .id("siteSettings")
        .schemaType("siteSettings")
        .title("Site Settings")
        .icon(CogIcon)
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),

      S.divider(),

      // Pages built with the page builder (Home, About, Resources layout…)
      S.documentTypeListItem("page").title("Pages").icon(DocumentsIcon),

      // Resources: articles / newsletters + the Resources page layout
      S.listItem()
        .title("Resources")
        .icon(BookIcon)
        .child(
          S.list()
            .title("Resources")
            .items([
              S.documentTypeListItem("newsletter").title(
                "Articles & Newsletters"
              ),
              S.listItem()
                .title("Resources page layout")
                .icon(DocumentsIcon)
                .child(
                  S.documentList()
                    .title("Resources page")
                    .schemaType("page")
                    .filter('_type == "page" && slug.current == "resources"')
                ),
            ])
        ),

      // Gallery: photo albums + the gallery page hero text
      S.listItem()
        .title("Gallery")
        .icon(ImagesIcon)
        .child(
          S.list()
            .title("Gallery")
            .items([
              S.documentTypeListItem("galleryAlbum").title("Photo Albums"),
              S.documentTypeListItem("gallerySettings").title(
                "Gallery Page Settings"
              ),
            ])
        ),

      S.divider(),

      S.documentTypeListItem("faq").title("FAQs"),
      S.documentTypeListItem("event").title("Events"),
      S.documentTypeListItem("brand").title("Brands"),

      S.divider(),

      /*
       * Blog section (kept for reference, currently unused on the site)
       * S.listItem()
       *   .title("Blog")
       *   .child(
       *     S.list()
       *       .title("Blog")
       *       .items([
       *         S.documentTypeListItem("blogPost").title("Blog Posts"),
       *         S.documentTypeListItem("category").title("Categories"),
       *         S.documentTypeListItem("author").title("Authors"),
       *       ])
       *   ),
       */

      // Everything else (workshops, volunteers, contact groups, …)
      ...S.documentTypeListItems().filter(
        (item) => item.getId() && !PINNED_TYPES.includes(item.getId()!)
      ),
    ]);
