import { PortableText } from "next-sanity";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";

type HeroProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
  { _type: "hero" }
>;

export function Hero({ title, text, image }: HeroProps) {
  return (
    <section className="bg-[color:var(--paper)] py-20 md:py-28">
      <div className="wrap">
        <div className="grid grid-cols-1 items-end gap-12 md:grid-cols-12 md:gap-16">
          <div className="rise md:col-span-7">
            {title ? (
              <h1 className="display text-5xl text-[color:var(--ink)] md:text-6xl lg:text-7xl">
                {title}
              </h1>
            ) : null}
            {text ? (
              <div className="mt-8 max-w-xl text-lg leading-relaxed text-[color:var(--ink-soft)] [&_a]:underline [&_p+p]:mt-4 [&_strong]:font-semibold">
                <PortableText value={text} />
              </div>
            ) : null}
          </div>

          {image ? (
            <div className="border border-[color:var(--ink)] md:col-span-5">
              <Image
                className="block h-auto w-full"
                src={urlFor(image).width(1000).height(1250).url()}
                width={1000}
                height={1250}
                alt=""
                priority
              />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
