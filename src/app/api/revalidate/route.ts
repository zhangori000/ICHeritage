import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * On-demand revalidation for Sanity publishes.
 *
 * Point a Sanity webhook (Manage → API → Webhooks) at
 *   POST https://icheritagecn.org/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 * for create/update/delete on all document types. Every page is then
 * regenerated on the next request instead of waiting for the 5-minute
 * background refresh. The secret is a plain shared string set in Vercel's
 * environment variables; it keeps strangers from hammering the cache.
 */
export async function POST(request: NextRequest) {
  const expected = process.env.SANITY_REVALIDATE_SECRET;
  if (!expected) {
    return NextResponse.json(
      { revalidated: false, error: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 }
    );
  }

  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");
  if (provided !== expected) {
    return NextResponse.json({ revalidated: false, error: "Invalid secret" }, { status: 401 });
  }

  // The site is small; refreshing everything is simpler and safer than
  // mapping document types to routes.
  revalidatePath("/", "layout");

  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}
