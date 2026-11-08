import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refresh every page's cached data after Sanity content changes.
 *
 * Why this exists: next-sanity caches each query with `revalidate: false`
 * and relies on tag invalidation, which Sanity Live only triggers for
 * browsers that are already open on the page. Without this route an edit
 * made in Studio can sit unseen behind the cache indefinitely.
 *
 * Two callers:
 *  - A Sanity webhook (Manage → API → Webhooks) for create/update/delete:
 *      POST https://icheritagecn.org/api/revalidate?secret=<SANITY_REVALIDATE_SECRET>
 *  - The daily Vercel Cron in vercel.json as a safety net (GET, with the
 *    Authorization: Bearer <CRON_SECRET> header Vercel adds automatically).
 *
 * `revalidatePath("/", "layout")` marks every route under the root layout
 * and the fetch entries tagged to them as stale, so the next visit renders
 * fresh content.
 */
function isAuthorized(request: NextRequest) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  const cronSecret = process.env.CRON_SECRET;
  const provided =
    request.nextUrl.searchParams.get("secret") ??
    request.headers.get("x-revalidate-secret");
  const bearer = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (secret && provided === secret) return true;
  if (cronSecret && bearer === cronSecret) return true;
  return false;
}

function refresh() {
  revalidatePath("/", "layout");
  return NextResponse.json({ revalidated: true, at: new Date().toISOString() });
}

export async function POST(request: NextRequest) {
  if (!process.env.SANITY_REVALIDATE_SECRET && !process.env.CRON_SECRET) {
    return NextResponse.json(
      { revalidated: false, error: "No revalidation secret configured" },
      { status: 500 }
    );
  }
  if (!isAuthorized(request)) {
    return NextResponse.json({ revalidated: false, error: "Unauthorized" }, { status: 401 });
  }
  return refresh();
}

export const GET = POST;
