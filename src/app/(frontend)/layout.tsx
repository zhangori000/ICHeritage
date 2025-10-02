import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { Header } from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "@/sanity/lib/live";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { Footer } from "@/components/Footer";
import type { Image } from "sanity"; // 👈 1. IMPORT THE TYPE HERE.. to solve annoying typing issues.

export default async function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Fetch site settings (logo, org name, footer stuff)
  const { data: settings } = await sanityFetch({ query: SITE_SETTINGS_QUERY });

  return (
    <section className="bg-white min-h-screen flex flex-col">
      <Header settings={settings ?? null} />
      <main className="flex-1">{children}</main>
      {/* Footer uses editor-controlled settings */}
      <Footer settings={settings ?? null} />

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
