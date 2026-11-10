import Image from "next/image";
import Link from "next/link";
import { PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

const linkClass =
  "font-medium text-[color:var(--seal)] underline decoration-1 underline-offset-4 hover:text-[color:var(--seal-deep)]";

export const components: PortableTextComponents = {
  types: {
    image: (props) =>
      props.value?.asset ? (
        <figure className="not-prose my-10">
          <div className="overflow-hidden border border-[color:var(--ink)] bg-[color:var(--paper-slot)]">
            <Image
              className="h-auto w-full"
              src={urlFor(props.value)
                .width(1400)
                .fit("max")
                .quality(80)
                .auto("format")
                .url()}
              alt={props.value.alt || ""}
              width={1400}
              height={900}
              sizes="(min-width: 1024px) 800px, 100vw"
            />
          </div>
          {props.value.caption ? (
            <figcaption className="mt-2 text-[13px] text-[color:var(--ink-muted)]">
              {props.value.caption}
            </figcaption>
          ) : null}
        </figure>
      ) : null,
    codeBlock: ({ value }) =>
      value?.code ? (
        <pre className="not-prose my-8 overflow-x-auto border border-[color:var(--hairline)] bg-[color:var(--paper-deep)] p-4 font-mono text-sm text-[color:var(--ink)]">
          {(value.filename || value.language) && (
            <div className="eyebrow mb-3 flex items-center justify-between">
              <span>{value.filename || "Code"}</span>
              {value.language ? <span>{value.language}</span> : null}
            </div>
          )}
          <code className="block whitespace-pre text-sm leading-6">
            {value.code}
          </code>
        </pre>
      ) : null,
    divider: () => (
      <hr className="not-prose my-12 border-t border-[color:var(--hairline)]" />
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="bg-[color:var(--paper-deep)] px-1.5 py-0.5 font-mono text-sm text-[color:var(--ink)]">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = value?.href || "#";
      const newTab = Boolean(value?.newTab);
      const rel = newTab ? "noopener noreferrer" : undefined;
      const target = newTab ? "_blank" : undefined;

      if (href.startsWith("/")) {
        return (
          <Link href={href} target={target} rel={rel} className={linkClass}>
            {children}
          </Link>
        );
      }

      return (
        <a href={href} target={target} rel={rel} className={linkClass}>
          {children}
        </a>
      );
    },
  },
};
