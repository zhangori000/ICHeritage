import type { PAGE_QUERY_RESULT } from "@/sanity/types";

type FeaturesProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
  { _type: "features" }
>;

export function Features({ features, title }: FeaturesProps) {
  return (
    <section className="py-20 md:py-28">
      <div className="wrap">
        {title ? (
          <h2 className="display max-w-3xl text-4xl text-[color:var(--ink)] md:text-5xl lg:text-6xl">
            {title}
          </h2>
        ) : null}

        {Array.isArray(features) ? (
          <div className="mt-12 grid grid-cols-1 border-t border-[color:var(--ink)] md:mt-16 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature._key}
                className="border-b border-[color:var(--hairline)] py-8 last:border-b-0 md:border-b-0 md:border-r md:pr-8 md:pl-8 md:first:pl-0 md:last:border-r-0"
              >
                {feature.title ? (
                  <h3 className="font-serif text-2xl text-[color:var(--ink)]">{feature.title}</h3>
                ) : null}
                {feature.text ? (
                  <p className="mt-4 text-[15px] leading-relaxed text-[color:var(--ink-soft)]">
                    {feature.text}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
