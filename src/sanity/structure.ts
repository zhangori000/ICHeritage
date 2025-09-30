import type { StructureResolver } from "sanity/structure";

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .id("siteSettings")
        .schemaType("siteSettings")
        .title("Site Settings")
        .child(
          S.editor()
            .id("siteSettings")
            .schemaType("siteSettings")
            .documentId("siteSettings")
        ),
      // Blog section
      S.listItem()
        .title("Blog")
        .child(
          S.list()
            .title("Blog")
            .items([
              S.documentTypeListItem("blogPost").title("Blog Posts"),
              S.documentTypeListItem("category").title("Categories"),
              S.documentTypeListItem("author").title("Authors"),
            ])
        ),

      S.divider(),

      // Pages & FAQs
      S.documentTypeListItem("page").title("Pages"),
      S.documentTypeListItem("faq").title("FAQs"),

      S.divider(),

      // Events (your new type)
      S.documentTypeListItem("event").title("Events"),

      S.divider(),

      // Everything else (catch-all)
      ...S.documentTypeListItems().filter(
        (item) =>
          item.getId() &&
          ![
            "blogPost",
            "category",
            "author",
            "page",
            "faq",
            "event",
            "siteSettings",
          ].includes(item.getId()!)
      ),
    ]);
