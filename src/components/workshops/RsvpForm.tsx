'use client';

import { useMemo, useState } from 'react';

type ContactMethod = 'email' | 'phone';

type RsvpFormProps = {
  instructions?: string;
};

export function RsvpForm({ instructions }: RsvpFormProps) {
  const [contactMethod, setContactMethod] = useState<ContactMethod>('email');

  const contactPlaceholder = useMemo(() => {
    return contactMethod === 'email' ? 'you@example.com' : '(123) 456-7890';
  }, [contactMethod]);

  const contactLabel = contactMethod === 'email' ? 'Email address' : 'Phone number';

  return (
    <div className="rounded-3xl border border-[color:var(--border)] bg-[color:var(--card)] p-8">
      <h2 className="font-serif text-2xl text-[color:var(--foreground)]">Join This Workshop</h2>
      <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
        {instructions || 'Leave your details and we will share RSVP information as soon as it is available.'}
      </p>

      <form className="mt-6 grid gap-5">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex flex-col gap-2 text-sm text-[color:var(--foreground)]">
            <span>First name</span>
            <input
              required
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/40"
              placeholder="First name"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm text-[color:var(--foreground)]">
            <span>Last name</span>
            <input
              required
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/40"
              placeholder="Last name"
            />
          </label>
        </div>

        <div className="flex flex-col gap-3 text-sm text-[color:var(--foreground)]">
          <span>Preferred contact method</span>
          <div className="grid grid-cols-2 gap-2">
            {(['email', 'phone'] as ContactMethod[]).map((method) => {
              const isActive = contactMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setContactMethod(method)}
                  className={`rounded-2xl border px-4 py-2 font-medium transition ${
                    isActive
                      ? 'border-[color:var(--primary)] bg-[color:var(--primary)]/10 text-[color:var(--primary)]'
                      : 'border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] hover:border-[color:var(--primary)]/50'
                  }`}
                >
                  {method === 'email' ? 'Email' : 'Phone'}
                </button>
              );
            })}
          </div>
        </div>

        <label className="flex flex-col gap-2 text-sm text-[color:var(--foreground)]">
          <span>{contactLabel}</span>
          <input
            required
            className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/40"
            placeholder={contactPlaceholder}
            type={contactMethod === 'email' ? 'email' : 'tel'}
          />
        </label>

        <label className="flex flex-col gap-2 text-sm text-[color:var(--foreground)]">
          <span>Anything else we should know? <span className="text-[color:var(--muted-foreground)]">(optional)</span></span>
          <textarea
            className="min-h-[120px] rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/40"
            placeholder="Share any accessibility needs or questions."
          />
        </label>

        <div className="text-xs text-[color:var(--muted-foreground)]">
          We only use your details to coordinate this workshop. You can opt out at any time.
        </div>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
        >
          Request RSVP details
        </button>
      </form>
    </div>
  );
}

