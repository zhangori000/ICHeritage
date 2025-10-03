import Image from "next/image";
import Link from "next/link";
import { PortableTextComponents } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";

export const components: PortableTextComponents = {
  types: {
    image: (props) =>
      props.value ? (
        <Image
          className="not-prose h-auto w-full rounded-lg"
          src={urlFor(props.value)
            .width(600)
            .height(400)
            .quality(80)
            .auto("format")
            .url()}
          alt={props?.value?.alt || ""}
          width="600"
          height="400"
        />
      ) : null,
    codeBlock: ({ value }) =>
      value?.code ? (
        <pre className="not-prose overflow-x-auto rounded-xl border border-[color:var(--border)] bg-[color:var(--muted)]/50 p-4 font-mono text-sm text-[color:var(--foreground)]">
          {(value.filename || value.language) && (
            <div className="mb-2 flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-[color:var(--muted-foreground)]">
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
      <hr className="not-prose my-12 border-t border-dashed border-[color:var(--border)]" />
    ),
  },
  marks: {
    code: ({ children }) => (
      <code className="rounded bg-[color:var(--muted)]/70 px-1.5 py-0.5 font-mono text-sm">
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
          <Link
            href={href}
            target={target}
            rel={rel}
            className="font-medium text-[color:var(--primary)] underline underline-offset-4 hover:text-[color:var(--primary)]/80"
          >
            {children}
          </Link>
        );
      }

      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className="font-medium text-[color:var(--primary)] underline underline-offset-4 hover:text-[color:var(--primary)]/80"
        >
          {children}
        </a>
      );
    },
  },
};
