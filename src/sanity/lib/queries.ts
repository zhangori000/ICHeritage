import { defineQuery } from "next-sanity";

// BLOG QUERIES
export const BLOG_POSTS_QUERY = defineQuery(`
  *[_type == "blogPost" && defined(slug.current)][0...12]{
    _id,
    title,
    slug,
    author,
    publishedAt
  }
`);

export const BLOG_POST_QUERY = defineQuery(`
  *[_type == "blogPost" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    author,
    publishedAt,
    body
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
