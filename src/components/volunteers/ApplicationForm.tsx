'use client';

import { useCallback, useEffect, useId, useRef, type ChangeEvent } from 'react';
import { gsap } from 'gsap';

type VolunteerApplicationFormProps = {
  instructions?: string;
  applyHref?: string | null;
  isExternalApplyLink?: boolean;
};

const inputClass =
  'volunteer-field w-full rounded-none border border-[color:var(--hairline)] bg-white px-4 py-3 text-base text-[color:var(--ink)] placeholder:text-[color:var(--ink-muted)] transition-colors focus:border-[color:var(--ink)] focus:outline-none focus:ring-0';

export function VolunteerApplicationForm({
  instructions,
  applyHref,
  isExternalApplyLink,
}: VolunteerApplicationFormProps) {
  const formRef = useRef<HTMLFormElement | null>(null);
  const idBase = useId();
  const ids = {
    firstName: `${idBase}-first-name`,
    lastName: `${idBase}-last-name`,
    contact: `${idBase}-contact`,
    notes: `${idBase}-notes`,
  };

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
      gsap.from('.volunteer-field', {
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
    <div id="apply-form" className="border-t border-[color:var(--ink)] pt-8 md:pt-10">
      <h2 className="font-serif text-3xl text-[color:var(--ink)] md:text-4xl">Apply to Volunteer</h2>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
        {instructions || 'Leave your details and we will connect you with the volunteer team.'}
      </p>

      {applyHref ? (
        <div className="mt-6">
          <a
            href={applyHref}
            target={isExternalApplyLink ? '_blank' : undefined}
            rel={isExternalApplyLink ? 'noreferrer' : undefined}
            className="volunteer-field btn"
          >
            Open application
          </a>
        </div>
      ) : null}

      <form ref={formRef} className="mt-10 space-y-6">
        <fieldset className="space-y-4">
          <legend className="eyebrow mb-4">Personal information</legend>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label htmlFor={ids.firstName} className="eyebrow block">
                First name
              </label>
              <input
                id={ids.firstName}
                required
                className={`${inputClass} mt-2`}
                placeholder="First name"
                autoComplete="given-name"
              />
            </div>
            <div>
              <label htmlFor={ids.lastName} className="eyebrow block">
                Last name
              </label>
              <input
                id={ids.lastName}
                required
                className={`${inputClass} mt-2`}
                placeholder="Last name"
                autoComplete="family-name"
              />
            </div>
          </div>
          <div>
            <label htmlFor={ids.contact} className="eyebrow block">
              Email or phone number
            </label>
            <input
              id={ids.contact}
              required
              className={`${inputClass} mt-2`}
              placeholder="Email or phone number"
              autoComplete="email"
            />
          </div>
        </fieldset>

        <div>
          <label htmlFor={ids.notes} className="eyebrow block">
            Availability or interests
          </label>
          <textarea
            id={ids.notes}
            className={`${inputClass} mt-2 resize-none overflow-y-auto`}
            placeholder="Optional: share availability or interests"
            rows={1}
            onChange={handleAutoResize}
            style={{ height: '56px' }}
          />
        </div>

        <p className="text-sm leading-relaxed text-[color:var(--ink-muted)]">
          We only use your details to coordinate volunteer opportunities. You can opt out at any time.
        </p>

        <button type="button" className="volunteer-field btn btn-primary cursor-pointer">
          Submit interest
        </button>
      </form>
    </div>
  );
}
