import { PageSkeleton } from "@/components/PageSkeleton";

// This route renders on request, so show a skeleton while its data loads.
export default function Loading() {
  return <PageSkeleton />;
}
