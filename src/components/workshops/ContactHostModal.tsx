'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

type ContactHostModalProps = {
  buttonLabel: string;
  instructions?: string;
  email?: string;
  phone?: string;
  responseNote?: string;
  hostNames: string[];
};

export function ContactHostModal({
  buttonLabel,
  instructions,
  email,
  phone,
  responseNote,
  hostNames,
}: ContactHostModalProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearCloseTimeout = useCallback(() => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  }, []);

  const closeModal = useCallback(() => {
    clearCloseTimeout();
    setIsVisible(false);
    closeTimeoutRef.current = setTimeout(() => {
      setIsMounted(false);
    }, 200);
  }, [clearCloseTimeout]);

  const handleOpen = useCallback(() => {
    clearCloseTimeout();
    setIsMounted(true);
  }, [clearCloseTimeout]);

  useEffect(() => {
    if (!isMounted) return;

    const frame = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => cancelAnimationFrame(frame);
  }, [isMounted]);

  useEffect(() => {
    if (!isMounted) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [closeModal, isMounted]);

  useEffect(() => clearCloseTimeout, [clearCloseTimeout]);

  const contactLineParts = [] as string[];
  if (email) contactLineParts.push(email);
  if (phone) contactLineParts.push(phone);

  const contactLine = contactLineParts.join(' · ');

  return (
    <>
      <button
        type="button"
        onClick={handleOpen}
        className="flex w-full items-center justify-center gap-2 rounded-full border border-[color:var(--border)] bg-[color:var(--background)] px-4 py-2.5 text-sm font-semibold text-[color:var(--foreground)] transition hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
      >
        {buttonLabel}
      </button>

      {isMounted ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="Contact the host"
        >
          <div
            className={`absolute inset-0 bg-black/50 transition-opacity duration-200 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={closeModal}
          />
          <div
            className={`relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-[color:var(--border)] bg-[color:var(--card)] shadow-2xl transition-all duration-200 ${
              isVisible ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-4 scale-[0.97] opacity-0'
            }`}
          >
            <div className="flex items-start gap-4 border-b border-[color:var(--border)] bg-[color:var(--muted)]/20 px-6 py-5">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-[color:var(--primary)]/10 text-[color:var(--primary)]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 32 32"
                  className="h-7 w-7"
                  aria-hidden
                >
                  <path
                    fill="currentColor"
                    fillOpacity="0.15"
                    d="M28.544 4.386a1.684 1.684 0 0 1 2.828 1.339L30.883 21.51a1.684 1.684 0 0 1-.844 1.45l-11.7 6.634a1.684 1.684 0 0 1-1.648 0l-11.7-6.635a1.684 1.684 0 0 1-.844-1.45L.628 5.725a1.684 1.684 0 0 1 2.828-1.339l12.544 10.858z"
                  />
                  <path
                    fill="currentColor"
                    d="M16 4c-2.828 0-5.118 0-6.892.175-1.783.177-3.198.547-4.33 1.68-1.132 1.132-1.503 2.547-1.68 4.33C3 11.96 3 14.25 3 17.079v2.063c0 2.83 0 5.118.174 6.892.178 1.783.548 3.198 1.68 4.33 1.132 1.132 2.547 1.503 4.33 1.68C10.96 32 13.25 32 16.079 32h1.842c2.83 0 5.118 0 6.892-.174 1.783-.178 3.198-.548 4.33-1.68 1.132-1.132 1.503-2.547 1.68-4.33C31 22.26 31 19.972 31 17.144v-2.063c0-2.83 0-5.118-.174-6.892-.178-1.783-.548-3.198-1.68-4.33-1.132-1.132-2.547-1.503-4.33-1.68C21.118 4 18.83 4 16 4m0 2h1.857c2.63 0 4.483.002 5.91.146 1.41.143 2.253.414 2.85 1.01s.867 1.44 1.01 2.85C27.771 10.435 27.773 12.287 27.773 14.92v2.16c0 2.634-.002 4.486-.146 5.914-.143 1.41-.414 2.253-1.01 2.85s-1.44.867-2.85 1.01c-1.427.143-3.28.146-5.91.146H16c-2.63 0-4.483-.002-5.91-.146-1.41-.143-2.253-.414-2.85-1.01s-.867-1.44-1.01-2.85C6.087 21.566 6.084 19.713 6.084 17.08v-2.16c0-2.633.003-4.485.147-5.913.143-1.41.414-2.253 1.01-2.85s1.44-.867 2.85-1.01c1.427-.143 3.28-.146 5.91-.146"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase tracking-[0.2em] text-[color:var(--muted-foreground)]">
                  Contact the host
                </p>
                <h3 className="mt-1 font-serif text-xl text-[color:var(--foreground)]">
                  {hostNames.length > 0 ? `Message ${hostNames.join(' & ')}` : 'Send a message'}
                </h3>
                <p className="mt-1 text-sm text-[color:var(--muted-foreground)]">
                  {instructions || 'Have a question about this workshop? Leave a message and we will get back to you soon.'}
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                className="ml-auto inline-flex h-9 w-9 items-center justify-center rounded-full text-[color:var(--muted-foreground)] transition hover:bg-[color:var(--muted)]/30 hover:text-[color:var(--foreground)]"
                aria-label="Close modal"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-4 w-4"
                >
                  <path d="m7 7 10 10M7 17 17 7" />
                </svg>
              </button>
            </div>
            <form className="px-6 py-6">
              <label className="flex flex-col gap-2 text-sm text-[color:var(--foreground)]">
                <span>Your question</span>
                <textarea
                  required
                  placeholder="What's your question for the host?"
                  className="min-h-[120px] rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--border)] focus:outline-none focus-soft"
                />
              </label>
              <label className="mt-4 flex flex-col gap-2 text-sm text-[color:var(--foreground)]">
                <span>How can we reach you?</span>
                <input
                  required
                  placeholder="Email or phone number"
                  className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--background)] px-3 py-3 text-sm text-[color:var(--foreground)] focus:border-[color:var(--border)] focus:outline-none focus-soft"
                />
              </label>
              {contactLine ? (
                <p className="mt-3 text-xs text-[color:var(--muted-foreground)]">
                  The host will send replies to <span className="font-medium text-[color:var(--foreground)]">{contactLine}</span>.
                </p>
              ) : null}
              {responseNote ? (
                <p className="mt-1 text-xs text-[color:var(--muted-foreground)]">{responseNote}</p>
              ) : null}
              <button
                type="button"
                className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-[color:var(--primary)] px-5 py-3 text-sm font-semibold text-[color:var(--primary-foreground)] transition hover:bg-[color:var(--primary)]/90"
              >
                Send message
              </button>
            </form>
          </div>
        </div>
      ) : null}
    </>
  );
}
