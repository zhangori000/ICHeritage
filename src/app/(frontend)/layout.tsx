import { draftMode } from "next/headers";
import { VisualEditing } from "next-sanity/visual-editing";
import { DisableDraftMode } from "@/components/DisableDraftMode";
import { Header } from "@/components/Header";
import { SanityLive } from "@/sanity/lib/live";
import { sanityFetch } from "@/sanity/lib/live";
import { LEGAL_PAGES_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";
import { Footer } from "@/components/Footer";
import { NavigationProgress } from "@/components/NavigationProgress";

export default async function FrontendLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Site settings (logo, org name, footer, donate link) plus any legal pages
  // that exist, so the footer only links to pages that are really there.
  const [{ data: settings }, { data: legalPages }] = await Promise.all([
    sanityFetch({ stega: false, query: SITE_SETTINGS_QUERY }),
    sanityFetch({ stega: false, query: LEGAL_PAGES_QUERY }),
  ]);

  return (
    <section className="bg-white min-h-screen flex flex-col">
      <NavigationProgress />
      <Header settings={settings ?? null} />
      <main className="flex-1">{children}</main>
      {/* Footer uses editor-controlled settings */}
      <Footer settings={settings ?? null} legalPages={legalPages ?? []} />

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
