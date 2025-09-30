import { defineQuery } from "next-sanity";

export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)]
    | order(publishedAt desc)[]{
      _id,
      title,
      slug,
      body,
      mainImage,
      publishedAt,
      "categories": coalesce(
        categories[]->{
          _id,
          slug,
          title
        },
        []
      ),
      author->{
        name,
        image
      }
    }
`);

export const BLOG_POSTS_SLUGS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)]{
    "slug": slug.current
  }
`);

export const BLOG_POST_QUERY = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    body,
    mainImage,
    publishedAt,
    "categories": coalesce(
      categories[]->{
        _id,
        slug,
        title
      },
      []
    ),
    author->{
      name,
      image
    },
    relatedBlogPosts[] {
      _key, // each array item always has one
      ...@->{ _id, title, slug }
    }
  }
`);

// EVENT QUERIES
export const EVENTS_QUERY = defineQuery(`
  *[_type == "event" && defined(slug.current)] | order(date asc)[0...20]{
    _id,
    title,
    slug,
    date,
    location,
    needsVolunteer
  }
`);

export const EVENT_QUERY = defineQuery(`
  *[_type == "event" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    description,
    date,
    location,
    link,
    needsVolunteer,
    image
  }
`);

export const PAGE_QUERY =
  defineQuery(`*[_type == "page" && slug.current == $slug][0]{
  ...,
  content[]{
    ...,
    _type == "faqs" => {
      ...,
      faqs[]->
    }
  }
}`);

export const HOME_PAGE_QUERY = defineQuery(`*[_id == "siteSettings"][0]{
    homePage->{
      ...,
      content[]{
        ...,
        _type == "faqs" => {
          ...,
          faqs[]->
        }
      }      
    }
  }`);
