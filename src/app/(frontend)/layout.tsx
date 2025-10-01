import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { Header } from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

export default async function FrontendLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: siteSettings } = await sanityFetch({
    query: SITE_SETTINGS_QUERY,
  });
  return (
    <section className="bg-white min-h-screen">
      <Header logo={siteSettings?.logo} />
      {children}
      <SanityLive />
      {(await draftMode()).isEnabled && (
        <>
          <DisableDraftMode />
          <VisualEditing />
        </>
      )}
    </section>
  );
}
