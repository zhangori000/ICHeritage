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
      _key,
      ...@->{ _id, title, slug }
    }
  }
`);

export const NEWSLETTERS_QUERY = defineQuery(`
  *[_type == "newsletter" && defined(slug.current)]
    | order(publishedAt desc){
      _id,
      title,
      "slug": slug.current,
      issueLabel,
      publishedAt,
      readTime,
      excerpt,
      coverImage
    }
`);

export const NEWSLETTER_QUERY = defineQuery(`
  *[_type == "newsletter" && slug.current == $slug][0]{
    _id,
    title,
    issueLabel,
    publishedAt,
    readTime,
    excerpt,
    coverImage,
    body
  }
`);

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

export const PAGE_QUERY = defineQuery(`
*[_type == "page" && slug.current == $slug][0]{
  _id,
  _type,
  title,
  slug,
  content[]{
    ...,
    _type == "heroBanner" => {
      ...,
      titleColor,
      kickerColor,
      bodyColor,
      overlayOpacity
    },
    _type == "faqs" => {
      ...,
      faqs[]->
    }
  }
}
`);

export const HOME_PAGE_QUERY = defineQuery(`
*[_id == "siteSettings"][0]{
  homePage->{
    _id,
    _type,
    title,
    slug,
    content[]{
      ...,
      _type == "heroBanner" => {
        ...,
        titleColor,
        kickerColor,
        bodyColor,
        overlayOpacity
      },
      _type == "faqs" => { ..., faqs[]-> }
    }
  }
}
`);

export const SITE_SETTINGS_QUERY = defineQuery(`
*[_id == "siteSettings"][0]{
  logo,
  orgName,
  footerBlurb,
  social{
    facebook, twitter, instagram, youtube
  },
  quickLinks[]{
    _key, label, href
  },
  contactEmail,
  contactPhone,
  address,
  newsletter{
    enabled, blurb
  }
}
`);
