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
    },
    _type == "workshopsDirectory" => {
      ...,
      categoryCards[]->{
        _id,
        title,
        slug,
        icon,
        description
      },
      "workshops": *[_type == "workshop"]
        | order(start asc){
          _id,
          title,
          "slug": slug.current,
          summary,
          categories[]->{
            _id,
            title,
            slug,
            icon,
            description
          },
          start,
          end,
          location,
          capacity,
          registeredCount,
          needsVolunteers,
          registerUrl,
          volunteerUrl,
          heroImage
        }
    },
    _type == "volunteersDirectory" => {
      ...,
      "opportunities": *[_type == "volunteerOpportunity"]
        | order(title asc){
          _id,
          title,
          "slug": slug.current,
          summary,
          trackLabel,
          isUrgent,
          isRemoteFriendly,
          location,
          commitmentSummary,
          openings,
          experienceLevel,
          applyUrl,
          heroImage,
          contact{
            ctaLabel
          }
        }
    },
    _type == "brandPromos" => {
      ...,
      brands[]->{
        _id,
        title,
        kicker,
        headline,
        subhead,
        footnote,
        themeColor,
        textColor,
        imageOverlayStrength,
        primaryCta{
          label,
          href
        },
        secondaryCta{
          label,
          href
        },
        promoLink{
          href,
          label
        },
        heroImage{
          asset,
          alt
        },
        logo{
          asset,
          alt
        }
      }
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
      _type == "faqs" => { ..., faqs[]-> },
      _type == "workshopsDirectory" => {
        ...,
        categoryCards[]->{
          _id,
          title,
          slug,
          icon,
          description
        },
        "workshops": *[_type == "workshop"]
          | order(start asc){
            _id,
            title,
            "slug": slug.current,
            summary,
            categories[]->{
              _id,
              title,
              slug,
              icon,
              description
            },
            start,
            end,
            location,
            capacity,
            registeredCount,
            needsVolunteers,
            registerUrl,
            volunteerUrl,
            heroImage
          }
      }
    },
      _type == "volunteersDirectory" => {
        ...,
        "opportunities": *[_type == "volunteerOpportunity"]
          | order(title asc){
            _id,
            title,
            "slug": slug.current,
            summary,
            trackLabel,
            isUrgent,
            isRemoteFriendly,
            location,
            commitmentSummary,
            openings,
            experienceLevel,
            applyUrl,
            heroImage,
            contact{
              ctaLabel
            }
          }
      },
      _type == "brandPromos" => {
        ...,
        brands[]->{
          _id,
          title,
          kicker,
          headline,
          subhead,
        footnote,
        themeColor,
        textColor,
        imageOverlayStrength,
        primaryCta{
          label,
          href
          },
          secondaryCta{
            label,
            href
          },
        promoLink{
          href,
          label
        },
        heroImage{
          asset,
          alt
        },
        logo{
          asset,
          alt
        }
        }
      }
    }
  }
`);

export const WORKSHOPS_QUERY = defineQuery(`
  *[_type == "workshop"]
    | order(start asc){
      _id,
      title,
      "slug": slug.current,
      summary,
      categories,
      start,
      end,
      location,
      capacity,
      registeredCount,
      needsVolunteers,
      registerUrl,
      volunteerUrl,
      heroImage,
      categories[]->{
        _id,
        title,
        slug,
        icon,
        description
      }
    }
`);

export const WORKSHOP_QUERY = defineQuery(`
  *[_type == "workshop" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    categories[]->{
      _id,
      title,
      slug,
      icon,
      description
    },
    start,
    end,
    location,
    capacity,
    registeredCount,
    needsVolunteers,
    registerUrl,
    volunteerUrl,
    heroImage,
    hosts[]{
      _key,
      name,
      role,
      avatar,
      socialLinks[]{
        _key,
        label,
        url
      }
    },
    contact{
      ctaLabel,
      instructions,
      email,
      phone,
      responseNote
    },
    externalLinks[]{
      _key,
      label,
      href
    },
    body
  }
`);

export const WORKSHOP_SLUGS_QUERY = defineQuery(`
  *[_type == "workshop" && defined(slug.current)]{
    "slug": slug.current
  }
`);

export const VOLUNTEERS_QUERY = defineQuery(`
  *[_type == "volunteerOpportunity"]
    | order(title asc){
      _id,
      title,
      "slug": slug.current,
      summary,
      trackLabel,
      isUrgent,
      isRemoteFriendly,
      location,
      commitmentSummary,
      openings,
      experienceLevel,
      applyUrl,
      heroImage,
      contact{
        ctaLabel
      }
    }
`);

export const VOLUNTEER_QUERY = defineQuery(`
  *[_type == "volunteerOpportunity" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    trackLabel,
    isUrgent,
    isRemoteFriendly,
    location,
    commitmentSummary,
    openings,
    experienceLevel,
    applyUrl,
    heroImage,
    responsibilities,
    qualifications,
    benefits,
    applicationProcess[]{
      _key,
      title,
      description
    },
    contact{
      ctaLabel,
      instructions,
      email,
      phone,
      responseNote
    },
    body
  }
`);

export const VOLUNTEER_SLUGS_QUERY = defineQuery(`
  *[_type in ["volunteerOpportunity", "volunteerOPportunity"] && defined(slug.current)]{
    "slug": slug.current
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
