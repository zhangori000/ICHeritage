"use client";

import { useCallback, useMemo, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";

type Step = {
  id: string;
  title: string;
  description: string;
};

const STEPS: Step[] = [
  {
    id: "chapter-basics",
    title: "Chapter Basics",
    description: "Tell us who you are and where your chapter will grow.",
  },
  {
    id: "motivation-purpose",
    title: "Motivation & Purpose",
    description: "Share the spark behind your chapter and the impact you imagine.",
  },
  {
    id: "leadership-support",
    title: "Leadership & Support",
    description: "Help us understand your experience and who will mentor the team.",
  },
  {
    id: "team-governance",
    title: "Team & Commitments",
    description: "Outline your early team, support needs, and final commitments.",
  },
];

const mentorshipOptions = [
  "Monthly leadership coaching",
  "Event design & facilitation coaching",
  "Partnerships & sponsorships strategy",
  "Fundraising guidance",
  "Cultural programming support",
  "Social media & branding",
  "Conflict resolution / risk management",
];

const commitments = [
  "We agree to meet monthly with our HQ mentor and provide brief updates.",
  "We will set 1-3 quarterly goals (events, growth, partnerships) and review them with HQ.",
  "We will follow ICHeritage's Code of Conduct and Non-Discrimination Policy.",
  "We agree to use the approved branding ICHeritage - [Campus/City].",
  "We will submit quarterly reports (attendance, photos, recaps).",
  "We consent to share anonymized impact data and photos for nonprofit storytelling.",
];

const classNames = (...values: Array<string | false | null | undefined>) =>
  values.filter(Boolean).join(" ");

type FieldBase = {
  name: string;
  label: string;
  required?: boolean;
  placeholder?: string;
  helperText?: string;
  colSpan?: "full";
  autoComplete?: string;
  minLength?: number;
  maxLength?: number;
  rows?: number;
};

type InputField = FieldBase & {
  kind: "input";
  inputType?: "text" | "email" | "url" | "month" | "date" | "tel";
};

type SelectField = FieldBase & {
  kind: "select";
  options: Array<{ label: string; value: string }>;
  placeholderOption?: string;
};

type TextareaField = FieldBase & {
  kind: "textarea";
  rows?: number;
};

type FileField = FieldBase & {
  kind: "file";
  accept?: string;
};

type FieldConfig = InputField | SelectField | TextareaField | FileField;

type Section = {
  heading: string;
  description?: string;
  columns?: number;
  fields: FieldConfig[];
};

type DialogState = {
  type: "success" | "error";
  message: string;
  details?: {
    institutionName?: string;
    leadEmail?: string;
    attachments?: string[];
    confirmationEmailSent?: boolean;
    confirmationEmailError?: string;
    fallbackGroupUsed?: boolean;
    recipients?: string[];
  };
};

const sectionsByStep: Record<string, Section[]> = {
  "chapter-basics": [
    {
      heading: "Chapter Basics",
      description: "These details help us understand where your chapter will launch.",
      columns: 2,
      fields: [
        {
          kind: "select",
          name: "chapterType",
          label: "Chapter type",
          required: true,
          placeholderOption: "Select chapter type",
          options: [
            { label: "University", value: "university" },
            { label: "High School", value: "high-school" },
            { label: "Community", value: "community" },
          ],
        },
        {
          kind: "input",
          name: "institutionName",
          label: "Institution or organization name",
          required: true,
          placeholder: "e.g., Stanford University",
        },
        {
          kind: "input",
          name: "location",
          label: "City, State/Province, Country",
          required: true,
          placeholder: "e.g., Toronto, Ontario, Canada",
          colSpan: "full",
        },
        {
          kind: "input",
          name: "launchMonth",
          label: "Anticipated launch month",
          required: true,
          inputType: "month",
        },
        {
          kind: "input",
          name: "chapterWebsite",
          label: "Website or social handle (optional)",
          inputType: "url",
          placeholder: "https:// or @handle",
        },
      ],
    },
    {
      heading: "Primary Contact (Chapter Lead)",
      description: "We will use this information to follow up on your application.",
      columns: 2,
      fields: [
        {
          kind: "input",
          name: "leadName",
          label: "Full name",
          required: true,
          autoComplete: "name",
        },
        {
          kind: "input",
          name: "leadRole",
          label: "Role / Title",
          required: true,
          placeholder: "e.g., President, Founder",
        },
        {
          kind: "select",
          name: "leadAcademicYear",
          label: "Academic year",
          required: true,
          placeholderOption: "Select academic year",
          options: [
            { label: "Freshman", value: "freshman" },
            { label: "Sophomore", value: "sophomore" },
            { label: "Junior", value: "junior" },
            { label: "Senior", value: "senior" },
            { label: "Graduate", value: "graduate" },
            { label: "Other", value: "other" },
          ],
        },
        {
          kind: "input",
          name: "leadMajor",
          label: "Major or field of study",
          required: true,
        },
        {
          kind: "input",
          name: "leadEmail",
          label: "Email",
          required: true,
          inputType: "email",
          autoComplete: "email",
        },
        {
          kind: "input",
          name: "leadContact",
          label: "Contact (mobile / WhatsApp / WeChat / email)",
          required: true,
          placeholder: "+1 (555) 123-4567 or @handle",
        },
        {
          kind: "input",
          name: "leadProfile",
          label: "LinkedIn or personal site (optional)",
          inputType: "url",
          placeholder: "https://",
        },
        {
          kind: "file",
          name: "leadResume",
          label: "Resume or CV (PDF only)",
          required: true,
          accept: "application/pdf",
          helperText: "Upload a single PDF (max 10MB).",
          colSpan: "full",
        },
      ],
    },
  ],
  "motivation-purpose": [
    {
      heading: "Motivation & Purpose",
      description: "Use these prompts to show your passion for starting an ICHeritage chapter.",
      fields: [
        {
          kind: "textarea",
          name: "motivationWhy",
          label: "Why do you want to start an ICHeritage chapter? (150-300 words)",
          required: true,
          rows: 6,
          minLength: 500,
          maxLength: 2100,
          placeholder: "Share what draws you to ICHeritage and the community you want to build.",
        },
        {
          kind: "textarea",
          name: "motivationStory",
          label:
            "What inspired you to bring ICHeritage to your campus or community? What part of our mission resonates most, and how will this chapter create local impact?",
          required: true,
          rows: 5,
          placeholder: "Tell us the story and vision behind your chapter.",
        },
        {
          kind: "textarea",
          name: "motivationChallenges",
          label: "What cultural or social challenges do you hope this chapter will address?",
          required: true,
          rows: 5,
        },
        {
          kind: "textarea",
          name: "motivationEngagement",
          label: "How will you motivate and engage members in the first three months?",
          required: true,
          rows: 5,
        },
      ],
    },
  ],
  "leadership-support": [
    {
      heading: "Leadership & Experience",
      description: "Highlight experiences that show your readiness to guide a new chapter.",
      fields: [
        {
          kind: "textarea",
          name: "leadershipExperience",
          label: "Previous leadership or organizational experience (100-200 words)",
          required: true,
          rows: 5,
          minLength: 400,
          maxLength: 1500,
        },
        {
          kind: "textarea",
          name: "leadershipVolunteerExperience",
          label: "Relevant volunteer or cultural experience",
          required: true,
          rows: 5,
        },
        {
          kind: "textarea",
          name: "leadershipSkills",
          label: "Key skills or networks you bring (planning, design, partnerships, etc.)",
          required: true,
          rows: 4,
        },
      ],
    },
    {
      heading: "Advisor / Sponsor (recommended for schools)",
      description: "If you already have an advisor, share their contact so we can welcome them.",
      columns: 2,
      fields: [
        { kind: "input", name: "advisorName", label: "Name" },
        { kind: "input", name: "advisorTitle", label: "Title & department / organization" },
        { kind: "input", name: "advisorEmail", label: "Email", inputType: "email" },
        {
          kind: "file",
          name: "advisorSupportLetter",
          label: "Letter of support (PDF)",
          accept: "application/pdf",
          helperText: "Optional - upload if already available.",
          colSpan: "full",
        },
      ],
    },
  ],
  "team-governance": [
    {
      heading: "Team & Governance",
      description: "Paint a picture of your starting team and the support you hope to receive.",
      columns: 2,
      fields: [
        {
          kind: "textarea",
          name: "teamSizeRoles",
          label: "Initial team size & roles",
          required: true,
          rows: 4,
          placeholder: "List names, roles, and responsibilities.",
          colSpan: "full",
        },
        {
          kind: "select",
          name: "teamCadence",
          label: "Meeting cadence",
          required: true,
          placeholderOption: "Select cadence",
          options: [
            { label: "Weekly", value: "weekly" },
            { label: "Biweekly", value: "biweekly" },
            { label: "Monthly", value: "monthly" },
          ],
        },
        {
          kind: "file",
          name: "teamConstitution",
          label: "Draft constitution or bylaws (optional)",
          accept: "application/pdf",
        },
      ],
    },
  ],
};

const inputClasses =
  "h-12 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-4 text-sm text-[color:var(--foreground)] transition focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20";

const textareaClasses =
  "w-full resize-y rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm leading-relaxed text-[color:var(--foreground)] transition focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/20";

const fileClasses =
  "block w-full rounded-lg border border-dashed border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--muted-foreground)] file:me-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-[color:var(--primary)] file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[color:var(--primary-foreground)] hover:border-[color:var(--primary)]";

const renderField = (field: FieldConfig, stepId: string) => {
  const baseLabelClass = classNames(
    "grid gap-2 text-sm text-[color:var(--foreground)]/80",
    field.colSpan === "full" ? "md:col-span-2" : undefined
  );

  switch (field.kind) {
    case "input":
      return (
        <label key={field.name} className={baseLabelClass}>
          {field.label}
          <input
            name={field.name}
            type={field.inputType ?? "text"}
            required={field.required}
            placeholder={field.placeholder}
            autoComplete={field.autoComplete}
            data-step={stepId}
            className={inputClasses}
          />
          {field.helperText ? (
            <span className="text-xs text-[color:var(--muted-foreground)]">{field.helperText}</span>
          ) : null}
        </label>
      );

    case "select":
      return (
        <label key={field.name} className={baseLabelClass}>
          {field.label}
          <select
            name={field.name}
            required={field.required}
            data-step={stepId}
            className={inputClasses}
            defaultValue=""
          >
            <option value="" disabled>
              {field.placeholderOption ?? "Select an option"}
            </option>
            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {field.helperText ? (
            <span className="text-xs text-[color:var(--muted-foreground)]">{field.helperText}</span>
          ) : null}
        </label>
      );

    case "textarea":
      return (
        <label key={field.name} className={baseLabelClass}>
          {field.label}
          <textarea
            name={field.name}
            required={field.required}
            placeholder={field.placeholder}
            data-step={stepId}
            className={textareaClasses}
            rows={field.rows ?? 4}
            minLength={field.minLength}
            maxLength={field.maxLength}
          />
          {field.helperText ? (
            <span className="text-xs text-[color:var(--muted-foreground)]">{field.helperText}</span>
          ) : null}
        </label>
      );

    case "file":
      return (
        <label key={field.name} className={baseLabelClass}>
          {field.label}
          <input
            name={field.name}
            type="file"
            required={field.required}
            data-step={stepId}
            className={fileClasses}
            accept={field.accept}
          />
          {field.helperText ? (
            <span className="text-xs text-[color:var(--muted-foreground)]">{field.helperText}</span>
          ) : null}
        </label>
      );
  }
};

export function StartChapterApplicationForm() {
  const formRef = useRef<HTMLFormElement | null>(null);
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [status, setStatus] = useState<"idle" | "submitting">("idle");
  const [showOtherMentorship, setShowOtherMentorship] = useState(false);
  const [dialog, setDialog] = useState<DialogState | null>(null);

  const stepIds = useMemo(() => STEPS.map((step) => step.id), []);

  const focusFirstInput = useCallback(
    (stepIndex: number) => {
      queueMicrotask(() => {
        const form = formRef.current;
        if (!form) return;
        const selector = `[data-step="${stepIds[stepIndex]}"]`;
        const control = form.querySelector<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
          `${selector}:not([type="hidden"])`
        );
        control?.focus();
      });
    },
    [stepIds]
  );

  const validateStep = useCallback(
    (stepIndex: number) => {
      const form = formRef.current;
      if (!form) return true;
      const selector = `[data-step="${stepIds[stepIndex]}"]`;
      const elements = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(selector)
      );

      for (const element of elements) {
        if (!element.checkValidity()) {
          element.reportValidity();
          return false;
        }
      }

      return true;
    },
    [stepIds]
  );

  const handleNext = useCallback(() => {
    if (!validateStep(currentStep)) return;
    const target = Math.min(currentStep + 1, STEPS.length - 1);
    setCurrentStep(target);
    focusFirstInput(target);
  }, [currentStep, focusFirstInput, validateStep]);

  const handleBack = useCallback(() => {
    const target = Math.max(currentStep - 1, 0);
    setCurrentStep(target);
    focusFirstInput(target);
  }, [currentStep, focusFirstInput]);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validateStep(currentStep)) return;

      setDialog(null);
      setStatus("submitting");

      const form = event.currentTarget;
      const payload = new FormData(form);
      const institutionNameValue = payload.get("institutionName");
      const leadEmailValue = payload.get("leadEmail");
      const attachmentNames: string[] = [];
      payload.forEach((value) => {
        if (value instanceof File && value.name && value.size > 0) {
          attachmentNames.push(value.name);
        }
      });

      try {
        const response = await fetch("/api/chapter-application", {
          method: "POST",
          body: payload,
        });

        let result: Record<string, unknown> | null = null;
        try {
          result = await response.json();
        } catch {
          // Non-JSON response; treat as null.
          result = null;
        }

        if (!response.ok || (result && result.ok === false)) {
          const errorText =
            (result?.error && typeof result.error === "string" && result.error) ||
            "Something went wrong while submitting. Please try again.";
          throw new Error(errorText);
        }

        form.reset();
        setShowOtherMentorship(false);
        setCurrentStep(0);
        focusFirstInput(0);

        setDialog({
          type: "success",
          message:
            (result?.message && typeof result.message === "string"
              ? result.message
              : "We successfully sent your chapter application to our HQ team."),
          details: {
            institutionName:
              typeof institutionNameValue === "string" && institutionNameValue.trim()
                ? institutionNameValue.trim()
                : undefined,
            leadEmail:
              typeof leadEmailValue === "string" && leadEmailValue.trim()
                ? leadEmailValue.trim()
                : undefined,
            attachments: attachmentNames.length > 0 ? attachmentNames : undefined,
            confirmationEmailSent: Boolean(result?.confirmationEmailSent),
            confirmationEmailError:
              typeof result?.confirmationEmailError === "string"
                ? (result.confirmationEmailError as string)
                : undefined,
            fallbackGroupUsed: Boolean(result?.fallbackGroupUsed),
            recipients: Array.isArray(result?.targetRecipients)
              ? (result?.targetRecipients as string[])
              : undefined,
          },
        });
      } catch (error) {
        console.error("Chapter application submission failed", error);
        const message =
          error instanceof Error
            ? error.message
            : "Something went wrong while submitting. Please try again.";
        setDialog({
          type: "error",
          message,
        });
      } finally {
        setStatus("idle");
      }
    },
    [currentStep, focusFirstInput, validateStep]
  );

  const handleOtherMentorshipChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    setShowOtherMentorship(event.target.checked);
  }, []);

  const handleDialogDismiss = () => {
    const current = dialog;
    setDialog(null);
    if (current?.type === "success") {
      router.push("/start-a-chapter");
    } else {
      focusFirstInput(currentStep);
    }
  };

  const isLastStep = currentStep === STEPS.length - 1;

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-lg md:p-10">
      <div className="space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-[color:var(--muted-foreground)]">
              Application Progress
            </span>
            <span className="text-xs text-[color:var(--muted-foreground)]">
              Step {currentStep + 1} of {STEPS.length}
            </span>
          </div>
          <ol className="grid gap-4 text-sm md:grid-cols-4">
            {STEPS.map((step, index) => {
              const isActive = index === currentStep;
              const isComplete = index < currentStep;

              return (
                <li
                  key={step.id}
                  className={classNames(
                    "rounded-xl border p-4",
                    isActive
                      ? "border-[color:var(--primary)] bg-[color:var(--primary)]/6"
                      : "border-[color:var(--border)] bg-transparent",
                    isComplete ? "opacity-80" : undefined
                  )}
                >
                  <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-[color:var(--muted-foreground)]">
                    <span
                      className={classNames(
                        "flex h-6 w-6 items-center justify-center rounded-full border text-[0.75rem] font-semibold",
                        isActive
                          ? "border-[color:var(--primary)] text-[color:var(--primary)]"
                          : "border-[color:var(--border)] text-[color:var(--muted-foreground)]",
                        isComplete
                          ? "border-[color:var(--primary)] bg-[color:var(--primary)] text-[color:var(--primary-foreground)]"
                          : undefined
                      )}
                    >
                      {index + 1}
                    </span>
                    <span>{step.title}</span>
                  </div>
                  <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">{step.description}</p>
                </li>
              );
            })}
          </ol>
        </div>

        <form ref={formRef} onSubmit={handleSubmit} className="space-y-10">
          {STEPS.map((step, index) => (
            <fieldset
              key={step.id}
              aria-hidden={currentStep !== index}
              className={classNames(
                "space-y-8 transition-opacity duration-300",
                currentStep === index ? "opacity-100" : "hidden opacity-0"
              )}
            >
              {sectionsByStep[step.id]?.map((section) => (
                <div key={section.heading} className="space-y-4">
                  <div className="space-y-2">
                    <h2 className="font-serif text-2xl text-[color:var(--foreground)]">{section.heading}</h2>
                    {section.description ? (
                      <p className="text-sm text-[color:var(--muted-foreground)]">{section.description}</p>
                    ) : null}
                  </div>
                  <div
                    className={
                      section.columns === 2
                        ? "grid gap-4 md:grid-cols-2"
                        : "grid gap-4"
                    }
                  >
                    {section.fields.map((field) => renderField(field, step.id))}
                  </div>
                </div>
              ))}

              {step.id === "team-governance" ? (
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h3 className="font-serif text-xl text-[color:var(--foreground)]">
                      What mentorship do you want from HQ?
                    </h3>
                    <div className="grid gap-3 md:grid-cols-2">
                      {mentorshipOptions.map((option) => (
                        <label
                          key={option}
                          className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)]/90"
                        >
                          <input
                            type="checkbox"
                            name="mentorshipNeeds"
                            value={option}
                            data-step={step.id}
                            className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]/40"
                          />
                          <span>{option}</span>
                        </label>
                      ))}
                      <label className="flex flex-col gap-2 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)]/90 md:col-span-2">
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            name="mentorshipNeeds"
                            value="Other"
                            data-step={step.id}
                            onChange={handleOtherMentorshipChange}
                            className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]/40"
                          />
                          Other (describe)
                        </span>
                        {showOtherMentorship ? (
                          <textarea
                            name="mentorshipNeedsOther"
                            data-step={step.id}
                            rows={3}
                            className={textareaClasses}
                            placeholder="Share other types of mentorship that would help."
                          />
                        ) : null}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-serif text-xl text-[color:var(--foreground)]">Commitment & Agreement</h3>
                    <p className="text-sm text-[color:var(--muted-foreground)]">
                      Please review and check each statement to confirm your commitment to ICHeritage guidelines.
                    </p>
                    <div className="space-y-3">
                      {commitments.map((commitment) => (
                        <label
                          key={commitment}
                          className="flex items-start gap-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--foreground)]/90"
                        >
                          <input
                            type="checkbox"
                            name="commitments"
                            value={commitment}
                            required
                            data-step={step.id}
                            className="mt-1 h-4 w-4 rounded border-[color:var(--border)] text-[color:var(--primary)] focus:ring-[color:var(--primary)]/40"
                          />
                          <span>{commitment}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-serif text-xl text-[color:var(--foreground)]">Signature</h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      <label className="grid gap-2 text-sm text-[color:var(--foreground)]/80">
                        Typed name (digital signature)
                        <input
                          name="signatureName"
                          type="text"
                          required
                          data-step={step.id}
                          className={inputClasses}
                        />
                      </label>
                      <label className="grid gap-2 text-sm text-[color:var(--foreground)]/80">
                        Date
                        <input
                          name="signatureDate"
                          type="date"
                          required
                          data-step={step.id}
                          className={inputClasses}
                        />
                      </label>
                    </div>
                  </div>
                </div>
              ) : null}
            </fieldset>
          ))}

          <div className="flex flex-col gap-3 border-t border-[color:var(--border)] pt-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs text-[color:var(--muted-foreground)]">
              You can move back anytime—your answers stay saved until you submit.
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              {currentStep > 0 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full border border-[color:var(--border)] bg-transparent px-6 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/20"
                >
                  Back
                </button>
              ) : null}
              {isLastStep ? (
                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[color:var(--primary)] px-8 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color-mix(in_oklab,var(--primary)_92%,black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40 disabled:cursor-not-allowed disabled:opacity-75"
                >
                  {status === "submitting" ? "Submitting..." : "Submit application"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex h-11 cursor-pointer items-center justify-center rounded-full bg-[color:var(--primary)] px-8 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color-mix(in_oklab,var(--primary)_92%,black)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40"
                >
                  Next step
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
      {dialog ? (
        <div className="fixed inset-0 z-[400] flex items-center justify-center bg-black/40 px-4 py-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 shadow-2xl">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span
                  className={[
                    "inline-flex h-10 w-10 items-center justify-center rounded-full",
                    dialog.type === "success"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-red-100 text-red-700",
                  ].join(" ")}
                  aria-hidden
                >
                  {dialog.type === "success" ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path d="M12 8v4" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M12 16h.01" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="9" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <div className="space-y-1">
                  <h3 className="font-serif text-xl text-[color:var(--foreground)]">
                    {dialog.type === "success" ? "Application sent" : "Submission issue"}
                  </h3>
                  <p className="text-sm text-[color:var(--muted-foreground)]">{dialog.message}</p>
                </div>
              </div>

              {dialog.type === "success" ? (
                <div className="space-y-3 rounded-lg bg-[color:var(--background)] px-4 py-3 text-sm text-[color:var(--muted-foreground)]">
                  {dialog.details?.institutionName ? (
                    <div>
                      <span className="font-medium text-[color:var(--foreground)]">Chapter:</span>{" "}
                      {dialog.details.institutionName}
                    </div>
                  ) : null}
                  {dialog.details?.leadEmail ? (
                    <div>
                      <span className="font-medium text-[color:var(--foreground)]">Applicant email:</span>{" "}
                      {dialog.details.leadEmail}
                      {dialog.details.confirmationEmailSent ? (
                        <span className="text-emerald-600">{` • Confirmation sent`}</span>
                      ) : (
                        <span className="text-amber-600">{` • Confirmation could not be sent`}</span>
                      )}
                    </div>
                  ) : null}
                  {dialog.details?.confirmationEmailError ? (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      {dialog.details.confirmationEmailError}
                    </div>
                  ) : null}
                  {dialog.details?.recipients && dialog.details.recipients.length > 0 ? (
                    <div>
                      <span className="font-medium text-[color:var(--foreground)]">HQ notified:</span>{" "}
                      {dialog.details.recipients.join(", ")}
                      {dialog.details.fallbackGroupUsed ? (
                        <span className="text-xs text-[color:var(--muted-foreground)]">{` • Using fallback contact group`}</span>
                      ) : null}
                    </div>
                  ) : null}
                  {dialog.details?.attachments && dialog.details.attachments.length > 0 ? (
                    <div>
                      <span className="font-medium text-[color:var(--foreground)]">Attachments:</span>
                      <ul className="mt-1 list-inside list-disc space-y-1">
                        {dialog.details.attachments.map((name, index) => (
                          <li key={`${name}-${index}`} className="text-xs">
                            {name}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <p className="text-xs text-[color:var(--muted-foreground)]">
                    A copy of your answers is on the way. If you don&apos;t see it soon, check your spam folder and mark it as &quot;Not spam&quot;.
                  </p>
                </div>
              ) : null}

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleDialogDismiss}
                  className={[
                    "inline-flex cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40",
                    dialog.type === "success"
                      ? "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] hover:bg-[color-mix(in_oklab,var(--primary)_92%,black)]"
                      : "border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]",
                  ].join(" ")}
                >
                  {dialog.type === "success" ? "Back to Start a Chapter" : "Close"}
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
