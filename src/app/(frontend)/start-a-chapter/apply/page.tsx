import Link from "next/link";
import { StartChapterApplicationForm } from "@/components/chapters/StartChapterApplicationForm";

export const metadata = {
  title: "Start a Chapter Application",
  description: "Share your chapter vision, team, and commitments so our HQ mentors can support your launch.",
};

export default function StartChapterApplyPage() {
  return (
    <div className="bg-[color:var(--background)] text-[color:var(--foreground)]">
      <div className="container mx-auto flex flex-col gap-10 px-4 py-12 md:gap-14 md:py-16 lg:max-w-5xl">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3 text-sm text-[color:var(--muted-foreground)]">
            <Link href="/start-a-chapter" className="transition hover:text-[color:var(--primary)]">
              Start a chapter
            </Link>
            <span aria-hidden>›</span>
            <span>Application</span>
          </div>
          <div className="space-y-3">
            <span className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted-foreground)]">
              Apply
            </span>
            <h1 className="font-serif text-3xl leading-tight md:text-4xl">
              Begin your ICHeritage chapter application
            </h1>
            <p className="max-w-2xl text-base text-[color:var(--muted-foreground)]">
              This form guides you through the essentials we need to get your chapter launched smoothly. You can
              gather details ahead of time, and the form will keep your answers in place while you move between
              steps.
            </p>
          </div>
        </div>

        <StartChapterApplicationForm />
      </div>
    </div>
  );
}

