'use client';

import { useCallback, useEffect, useRef, type ChangeEvent } from 'react';
import { gsap } from 'gsap';

type RsvpFormProps = {
  instructions?: string;
};

export function RsvpForm({ instructions }: RsvpFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);

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

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] p-6 md:p-7">
      <h2 className="font-serif text-2xl text-[color:var(--foreground)]">Join This Workshop</h2>
      <p className="mt-2 text-sm text-[color:var(--muted-foreground)]">
        {instructions || 'Leave your details and we will share RSVP information as soon as it is available.'}
      </p>

      <form ref={formRef} className="mt-6 space-y-4">
        <div className="space-y-3">
          <span className="text-sm font-medium uppercase tracking-[0.25em] text-[color:var(--muted-foreground)]">Personal information</span>
          <div className="flex flex-col gap-3 md:flex-row">
            <input
              required
              className="rsvp-field h-14 flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
              placeholder="First name"
              autoComplete="given-name"
            />
            <input
              required
              className="rsvp-field h-14 flex-1 rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
              placeholder="Last name"
              autoComplete="family-name"
            />
          </div>
          <input
            required
            className="rsvp-field h-14 w-full rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none focus:ring-0"
            placeholder="Email or phone number"
            autoComplete="email"
          />
        </div>

        <textarea
          className="rsvp-field w-full resize-none overflow-y-auto rounded-lg border border-[color:var(--border)] bg-[color:var(--background)] px-5 py-3 text-base text-[color:var(--foreground)] transition-colors focus:border-[color:var(--border)] focus:outline-none rsvp-notes"
          placeholder="Optional: type here to share additional thoughts"
          rows={1}
          onChange={handleAutoResize}
          style={{ height: '56px' }}
        />

        <div className="text-xs text-[color:var(--muted-foreground)]">
          We only use your details to coordinate this workshop. You can opt out at any time.
        </div>

        <button
          type="button"
          className="rsvp-field inline-flex cursor-pointer items-center justify-center rounded-full bg-[color:var(--primary)] px-6 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition-colors hover:bg-[color:var(--primary)]/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--primary)]/40"
        >
          Request RSVP details
        </button>
      </form>
    </div>
  );
}
