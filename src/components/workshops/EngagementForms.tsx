"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { RsvpForm } from "./RsvpForm";
import { VolunteerForm, type VolunteerFormHandle } from "./VolunteerForm";

type RsvpProps = React.ComponentProps<typeof RsvpForm>;
type VolunteerProps = React.ComponentProps<typeof VolunteerForm>;

type EngagementFormsProps = {
  rsvp: RsvpProps;
  volunteer: VolunteerProps;
};

type Mode = "attend" | "volunteer";

export function EngagementForms({ rsvp, volunteer }: EngagementFormsProps) {
  const defaultMode: Mode = useMemo(
    () => (volunteer.needsVolunteers ? "volunteer" : "attend"),
    [volunteer.needsVolunteers]
  );
  const [mode, setMode] = useState<Mode>(defaultMode);
  const volunteerFormRef = useRef<VolunteerFormHandle | null>(null);
  const focusVolunteerAfterToggle = useRef(false);

  const handleVolunteerAction = useCallback(() => {
    if (mode !== "volunteer") {
      focusVolunteerAfterToggle.current = true;
      setMode("volunteer");
      return;
    }

    volunteerFormRef.current?.focus();
  }, [mode]);

  useEffect(() => {
    if (mode === "volunteer" && focusVolunteerAfterToggle.current) {
      focusVolunteerAfterToggle.current = false;
      volunteerFormRef.current?.focus();
    }
  }, [mode]);

  const helperCopy =
    mode === "attend"
      ? "Use this form if you plan to participate in the session."
      : "Use this form if you can help run the workshop (logistics, facilitation, outreach, etc.).";

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-5 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[color:var(--muted-foreground)]">
              Participation options
            </p>
            <h2 className="mt-2 font-serif text-2xl text-[color:var(--foreground)]">
              Choose how you want to contribute
            </h2>
            <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
              Select one option below. Attendees and volunteers have separate forms so we can
              respond with the right next steps.
            </p>
          </div>
          <div className="inline-flex rounded-full border border-[color:var(--border)] bg-[color:var(--background)] p-1 text-sm font-semibold">
            <button
              type="button"
              onClick={() => setMode("attend")}
              className={`rounded-full px-4 py-2 transition ${
                mode === "attend"
                  ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              }`}
            >
              Join as attendee
            </button>
            <button
              type="button"
              onClick={() => setMode("volunteer")}
              className={`rounded-full px-4 py-2 transition ${
                mode === "volunteer"
                  ? "bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
              }`}
            >
              Volunteer support
            </button>
          </div>
        </div>
        <p className="mt-4 text-xs text-[color:var(--muted-foreground)]">{helperCopy}</p>
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-[color:var(--border)]/70 bg-[color:var(--background)]/70 p-4 text-xs text-[color:var(--muted-foreground)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            {mode === "volunteer"
              ? "Need that submit button? Scroll to the bottom of the form or tap this shortcut to jump there."
              : "Prefer to help run things? Use the button to switch to the volunteer form and share your availability."}
          </p>
          <button
            type="button"
            onClick={handleVolunteerAction}
            className="inline-flex items-center justify-center rounded-full bg-[color:var(--foreground)] px-5 py-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--background)] transition hover:bg-[color:var(--foreground)]/90"
          >
            {mode === "volunteer" ? "Go to volunteer form" : "Volunteer for this workshop"}
          </button>
        </div>
        {mode === "volunteer" && volunteer.needsVolunteers ? (
          <p className="mt-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            This workshop still needs volunteers. Thanks for helping us make it happen!
          </p>
        ) : null}
      </div>

      {mode === "attend" ? (
        <RsvpForm {...rsvp} />
      ) : (
        <VolunteerForm ref={volunteerFormRef} {...volunteer} />
      )}
    </div>
  );
}
