import {
  defineLocations,
  PresentationPluginOptions,
} from "sanity/presentation";

export const resolve: PresentationPluginOptions["resolve"] = {
  locations: {
    // Add more locations for other post types
    blogPost: defineLocations({
      select: {
        title: "title",
        slug: "slug.current",
      },
      resolve: (doc) => ({
        locations: [
          {
            title: doc?.title || "Untitled",
            href: `/blogPosts/${doc?.slug}`,
          },
          { title: "All blog posts", href: `/blogPosts` },
        ],
      }),
    }),
    // Uncomment when it is created
    // event: defineLocations({
    //   select: {
    //     title: "title",
    //     slug: "slug.current",
    //   },
    //   resolve: (doc) => ({
    //     locations: [
    //       {
    //         title: doc?.title || "Untitled event",
    //         href: `/events/${doc?.slug}`,
    //       },
    //       {
    //         title: "Events index",
    //         href: `/events`,
    //       },
    //     ],
    //   }),
    // }),
  },
};
