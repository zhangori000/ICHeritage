"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { gsap } from "gsap";

type VolunteerFormProps = {
  instructions?: string;
  workshopId: string;
  workshopSlug: string;
  workshopTitle: string;
  workshopDate?: string | null;
  workshopLocation?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  needsVolunteers?: boolean;
};

type SubmissionFeedback = {
  type: "success" | "error";
  message: string;
  details?: {
    volunteerId?: string;
    targetRecipients?: string[];
  };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const defaultVolunteerMessage =
  "Tell us how you would like to support this workshop. We will follow up via email.";

export type VolunteerFormHandle = {
  focus: () => void;
  submit: () => void;
};

export const VolunteerForm = forwardRef<VolunteerFormHandle, VolunteerFormProps>(function VolunteerForm(
  {
    instructions = defaultVolunteerMessage,
    workshopId,
    workshopSlug,
    workshopTitle,
    workshopDate,
  workshopLocation,
  contactEmail,
  contactPhone,
  needsVolunteers,
  }: VolunteerFormProps,
  ref
) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const firstFieldRef = useRef<HTMLInputElement | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        if (firstFieldRef.current) {
          firstFieldRef.current.focus();
          return;
        }

        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      },
      submit: () => {
        formRef.current?.requestSubmit();
      },
    }),
    []
  );

  const handleAutoResize = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const element = event.currentTarget;
    const minHeight = 56;
    const previousHeight = element.style.height;
    element.style.height = "auto";
    const targetHeight = `${Math.min(300, Math.max(minHeight, element.scrollHeight))}px`;
    element.style.height = previousHeight || `${minHeight}px`;
    requestAnimationFrame(() => {
      element.style.height = targetHeight;
    });
  }, []);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".volunteer-field", {
        y: 12,
        duration: 0.5,
        ease: "power2.out",
        stagger: 0.08,
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === "submitting") return;

      const form = event.currentTarget;
      const formData = new FormData(form);
      const firstName = (formData.get("firstName") as string | null)?.trim() ?? "";
      const lastName = (formData.get("lastName") as string | null)?.trim() ?? "";
      const email = (formData.get("email") as string | null)?.trim() ?? "";
      const experience =
        (formData.get("experience") as string | null)?.trim() ||
        "Volunteer interest submitted via workshop page.";

      if (!firstName || !lastName) {
        setFeedback({
          type: "error",
          message: "Please share your first and last name.",
        });
        return;
      }

      if (!email || !EMAIL_REGEX.test(email)) {
        setFeedback({
          type: "error",
          message: "A valid email is required so we can follow up with volunteer details.",
        });
        return;
      }

      const payload = {
        workshopId,
        workshopSlug,
        workshopTitle,
        workshopDate: workshopDate ?? null,
        workshopLocation: workshopLocation ?? null,
        contactEmail: contactEmail ?? null,
        contactPhone: contactPhone ?? null,
        pageUrl: typeof window !== "undefined" ? window.location.href : null,
        volunteer: {
          firstName,
          lastName,
          email,
          phone: null,
          pronouns: null,
          availability: null,
          interests: [],
          experience,
          notes: null,
        },
      };

      try {
        setStatus("submitting");
        setFeedback(null);
        const response = await fetch("/api/workshops/volunteer", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        const result = (await response.json().catch(() => null)) as
          | { error?: string; message?: string; targetRecipients?: string[]; volunteerId?: string }
          | null;

        if (!response.ok || result?.error) {
          throw new Error(
            result?.error ||
              "We could not submit your volunteer interest. Please try again in a moment."
          );
        }

        setFeedback({
          type: "success",
          message:
            result?.message || "Thank you for volunteering - the workshop team has your details.",
          details: {
            volunteerId:
              typeof result?.volunteerId === "string" ? result.volunteerId : undefined,
            targetRecipients: Array.isArray(result?.targetRecipients)
              ? (result?.targetRecipients as string[])
              : undefined,
          },
        });

        form.reset();
        requestAnimationFrame(() => {
          form.querySelectorAll("textarea").forEach((node) => {
            const textarea = node as HTMLTextAreaElement;
            textarea.style.height = "56px";
          });
        });
      } catch (error) {
        console.error("Volunteer submission failed", error);
        setFeedback({
          type: "error",
          message:
            error instanceof Error
              ? error.message
              : "We could not submit your volunteer interest right now.",
        });
      } finally {
        setStatus("idle");
      }
    },
    [
      contactEmail,
      contactPhone,
      status,
      workshopDate,
      workshopId,
      workshopLocation,
      workshopSlug,
      workshopTitle,
    ]
  );

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 md:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl text-[color:var(--foreground)]">Volunteer Support</h2>
          <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
            {instructions}
          </p>
        </div>
        {needsVolunteers ? (
          <span className="inline-flex shrink-0 items-center rounded-full border border-[color:var(--primary)]/50 bg-[color:var(--primary)]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[color:var(--primary)]">
            Actively needed
          </span>
        ) : null}
      </div>

      {feedback?.type === "success" ? (
        <div className="mt-6 space-y-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-5 py-4 text-sm text-[color:var(--foreground)]">
          <p className="font-semibold text-[color:var(--foreground)]">{feedback.message}</p>
          {feedback.details?.volunteerId ? (
            <p className="text-xs text-[color:var(--muted-foreground)]">
              Reference ID: {feedback.details.volunteerId}
            </p>
          ) : null}
          {feedback.details?.targetRecipients && feedback.details.targetRecipients.length > 0 ? (
            <p className="text-xs text-[color:var(--muted-foreground)]">
              <span className="font-medium text-[color:var(--foreground)]">Notified:</span>{" "}
              {feedback.details.targetRecipients.join(", ")}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
          >
            Offer another time slot
          </button>
        </div>
      ) : null}

      {feedback?.type !== "success" ? (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
          {feedback?.type === "error" ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedback.message}
            </div>
          ) : null}

          <div className="space-y-3">
            <span className="text-sm font-medium uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">
              Personal details
            </span>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                name="firstName"
                required
                ref={firstFieldRef}
                className="volunteer-field h-14 flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
                placeholder="First name"
                autoComplete="given-name"
              />
              <input
                name="lastName"
                required
                className="volunteer-field h-14 flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>
            <input
              name="email"
              type="email"
              required
              className="volunteer-field h-14 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
              placeholder="Email we can reply to"
              autoComplete="email"
            />
          </div>

          <div className="space-y-3">
            <span className="text-sm font-medium uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">
              Tell us more
            </span>
            <textarea
              name="experience"
              required
              rows={6}
              onChange={handleAutoResize}
              className="volunteer-field min-h-[140px] w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 py-3 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
              placeholder="How would you like to support this workshop?"
            />
          </div>

          <p className="text-xs text-[color:var(--muted-foreground)]">
            We’ll email you with next steps and log this submission in Sanity Studio so workshop
            leads can coordinate volunteers.
          </p>

          <button
            type="submit"
            disabled={status === "submitting"}
            className="volunteer-field inline-flex w-full cursor-pointer items-center justify-center rounded-full border border-[color:var(--primary)] bg-[color:var(--primary)] px-6 py-3 text-base font-semibold uppercase tracking-[0.18em] text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {status === "submitting" ? "Sending..." : "Submit volunteer form"}
          </button>
        </form>
      ) : null}
    </div>
  );
});
