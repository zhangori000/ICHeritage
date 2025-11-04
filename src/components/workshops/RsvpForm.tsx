'use client';

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { gsap } from 'gsap';

type RsvpFormProps = {
  instructions?: string;
  workshopId: string;
  workshopSlug: string;
  workshopTitle: string;
  workshopDate?: string | null;
  workshopLocation?: string | null;
  contactEmail?: string;
  contactPhone?: string;
};

type SubmissionFeedback = {
  type: 'success' | 'error';
  message: string;
  details?: {
    confirmationEmailSent?: boolean;
    confirmationEmailError?: string;
    fallbackGroupUsed?: boolean;
    targetRecipients?: string[];
  };
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const detectEmail = (value?: string | null) => {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return EMAIL_REGEX.test(trimmed) ? trimmed : null;
};

export function RsvpForm({
  instructions,
  workshopId,
  workshopSlug,
  workshopTitle,
  workshopDate,
  workshopLocation,
  contactEmail,
  contactPhone,
}: RsvpFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle');
  const [feedback, setFeedback] = useState<SubmissionFeedback | null>(null);

  const handleAutoResize = useCallback((event: ChangeEvent<HTMLTextAreaElement>) => {
    const element = event.currentTarget;
    const minHeight = 56;
    const previousHeight = element.style.height;
    element.style.height = 'auto';
    const targetHeight = `${Math.min(240, Math.max(minHeight, element.scrollHeight))}px`;
    element.style.height = previousHeight || `${minHeight}px`;
    requestAnimationFrame(() => {
      element.style.height = targetHeight;
    });
  }, []);

  useEffect(() => {
    if (!formRef.current) return;
    const ctx = gsap.context(() => {
      gsap.from('.rsvp-field', {
        y: 12,
        opacity: 0,
        duration: 0.5,
        ease: 'power2.out',
        stagger: 0.08,
      });
    }, formRef);

    return () => ctx.revert();
  }, []);

  const handleSubmit = useCallback(
    async (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (status === 'submitting') return;

      const form = event.currentTarget;
      const formData = new FormData(form);
      const firstName = (formData.get('firstName') as string | null)?.trim() ?? '';
      const lastName = (formData.get('lastName') as string | null)?.trim() ?? '';
      const contact = (formData.get('contact') as string | null)?.trim() ?? '';
      const notes = (formData.get('notes') as string | null)?.trim() ?? '';

      if (!firstName || !lastName || !contact) {
        setFeedback({
          type: 'error',
          message: 'Please share your first name, last name, and a way to reach you.',
        });
        return;
      }

      const attendeeEmail = detectEmail(contact);
      const payload = {
        workshopId,
        workshopSlug,
        workshopTitle,
        workshopDate: workshopDate ?? null,
        workshopLocation: workshopLocation ?? null,
        contactEmail: contactEmail ?? null,
        contactPhone: contactPhone ?? null,
        pageUrl: typeof window !== 'undefined' ? window.location.href : null,
        attendee: {
          firstName,
          lastName,
          contact,
          email: attendeeEmail,
          notes: notes || null,
        },
      };

      try {
        setStatus('submitting');
        setFeedback(null);

        const response = await fetch('/api/workshops/rsvp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json().catch(() => ({}));
        if (!response.ok || result?.ok === false) {
          const resultError =
            typeof result === 'object' &&
            result !== null &&
            typeof (result as { error?: unknown }).error === 'string'
              ? (result as { error: string }).error
              : undefined;
          const errorMessage =
            resultError ?? 'We could not submit your RSVP. Please try again in a moment.';
          throw new Error(errorMessage);
        }

        form.reset();
        const notesField = form.querySelector<HTMLTextAreaElement>('textarea[name="notes"]');
        if (notesField) {
          notesField.style.height = '56px';
        }

        setFeedback({
          type: 'success',
          message:
            (typeof result?.message === 'string' && result.message) ||
            'RSVP request sent. We will share details as soon as they are available.',
          details: {
            confirmationEmailSent: Boolean(result?.confirmationEmailSent),
            confirmationEmailError:
              typeof result?.confirmationEmailError === 'string'
                ? result.confirmationEmailError
                : undefined,
            fallbackGroupUsed: Boolean(result?.fallbackGroupUsed),
            targetRecipients: Array.isArray(result?.targetRecipients)
              ? (result.targetRecipients as string[])
              : undefined,
          },
        });
      } catch (error) {
        console.error('RSVP submission failed', error);
        setFeedback({
          type: 'error',
          message:
            error instanceof Error
              ? error.message
              : 'We could not submit your RSVP. Please try again in a moment.',
        });
      } finally {
        setStatus('idle');
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
      <h2 className="font-serif text-2xl text-[color:var(--foreground)]">Join This Workshop</h2>
      <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
        {instructions || 'Leave your details and we will share RSVP information as soon as it is available.'}
      </p>

      {feedback?.type === 'success' ? (
        <div className="mt-6 space-y-4 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] px-5 py-4 text-sm text-[color:var(--foreground)]">
          <p className="font-semibold text-[color:var(--foreground)]">{feedback.message}</p>
          {feedback.details?.confirmationEmailSent ? (
            <p className="text-xs text-emerald-700">A confirmation email is on the way to your inbox.</p>
          ) : null}
          {feedback.details?.confirmationEmailError ? (
            <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
              {feedback.details.confirmationEmailError}
            </p>
          ) : null}
          {feedback.details?.targetRecipients && feedback.details.targetRecipients.length > 0 ? (
            <p className="text-xs text-[color:var(--muted-foreground)]">
              <span className="font-medium text-[color:var(--foreground)]">Notified:</span>{' '}
              {feedback.details.targetRecipients.join(', ')}
              {feedback.details.fallbackGroupUsed ? ' (using default contact group)' : ''}
            </p>
          ) : null}
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="inline-flex cursor-pointer items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-2.5 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
          >
            Send another response
          </button>
        </div>
      ) : null}

      {feedback?.type !== 'success' ? (
        <form ref={formRef} onSubmit={handleSubmit} className="mt-6 space-y-4">
          {feedback?.type === 'error' ? (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {feedback.message}
            </div>
          ) : null}

          <div className="space-y-3">
            <span className="text-sm font-medium uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">
              Personal information
            </span>
            <div className="flex flex-col gap-3 md:flex-row">
              <input
                name="firstName"
                required
                className="rsvp-field h-14 flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
                placeholder="First name"
                autoComplete="given-name"
              />
              <input
                name="lastName"
                required
                className="rsvp-field h-14 flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>
            <input
              name="contact"
              required
              className="rsvp-field h-14 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
              placeholder="Email or phone number"
              autoComplete="email"
            />
          </div>

          <textarea
            name="notes"
            className="rsvp-field w-full resize-none overflow-y-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 py-3 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none"
            placeholder="Optional: type here to share additional thoughts"
            rows={1}
            onChange={handleAutoResize}
            style={{ height: '56px' }}
          />

          <div className="text-xs text-[color:var(--muted-foreground)]">
            We only use your details to coordinate this workshop. You can opt out at any time.
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="rsvp-field inline-flex cursor-pointer items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40 disabled:cursor-not-allowed disabled:opacity-75"
          >
            {status === 'submitting' ? 'Sending…' : 'Request RSVP details'}
          </button>
        </form>
      ) : null}
    </div>
  );
}

