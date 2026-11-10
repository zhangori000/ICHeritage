import type { PAGE_QUERY_RESULT } from "@/sanity/types";
import { PortableText } from "next-sanity";

type FAQsProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
  { _type: "faqs" }
>;

export function FAQs({ _key, title, faqs }: FAQsProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="wrap">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
          {title ? (
            <h2 className="display text-4xl text-[color:var(--ink)] md:text-5xl lg:col-span-4">
              {title}
            </h2>
          ) : null}

          {Array.isArray(faqs) ? (
            <div className="border-t border-[color:var(--ink)] lg:col-span-8 lg:col-start-5">
              {faqs.map((faq) => (
                <details
                  key={faq._id}
                  className="group border-b border-[color:var(--hairline)]"
                  name={_key}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-6 font-serif text-xl text-[color:var(--ink)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[color:var(--seal)] md:text-2xl [&::-webkit-details-marker]:hidden">
                    <span>{faq.title}</span>
                    {/* Plus that turns into a minus: the vertical stroke rotates away. */}
                    <svg
                      viewBox="0 0 16 16"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.25"
                      strokeLinecap="square"
                      className="mt-2 h-4 w-4 shrink-0"
                      aria-hidden
                    >
                      <line x1="1" y1="8" x2="15" y2="8" />
                      <line
                        x1="8"
                        y1="1"
                        x2="8"
                        y2="15"
                        className="origin-center transition-transform duration-200 group-open:rotate-90"
                      />
                    </svg>
                  </summary>
                  <div className="max-w-prose pb-8 leading-relaxed text-[color:var(--ink-soft)] [&_a]:underline [&_li]:mt-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_p+p]:mt-4 [&_strong]:font-semibold [&_ul]:list-disc [&_ul]:pl-5">
                    {faq.body ? <PortableText value={faq.body} /> : null}
                  </div>
                </details>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
