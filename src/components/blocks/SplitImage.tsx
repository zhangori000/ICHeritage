import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { PAGE_QUERY_RESULT } from "@/sanity/types";
import { stegaClean } from "next-sanity";

type SplitImageProps = Extract<
  NonNullable<NonNullable<PAGE_QUERY_RESULT>["content"]>[number],
  { _type: "splitImage" }
>;

export function SplitImage({ title, image, orientation }: SplitImageProps) {
  const side = stegaClean(orientation) || "imageLeft";
  const imageRight = side === "imageRight";

  return (
    <section className="py-20 md:py-28" data-orientation={side}>
      <div className="wrap">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-2 md:gap-16">
          {image ? (
            <div
              className={[
                "border border-[color:var(--ink)]",
                imageRight ? "md:order-2" : "",
              ].join(" ")}
            >
              <Image
                className="block h-auto w-full"
                src={urlFor(image).width(1200).height(900).url()}
                width={1200}
                height={900}
                alt=""
              />
            </div>
          ) : null}

          {title ? (
            <h2
              className={[
                "display text-4xl text-[color:var(--ink)] md:text-6xl",
                imageRight ? "md:order-1" : "",
              ].join(" ")}
            >
              {title}
            </h2>
          ) : null}
        </div>
      </div>
    </section>
  );
}
