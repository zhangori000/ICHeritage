"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";

type BlurUpImageProps = Omit<ImageProps, "fill" | "placeholder" | "blurDataURL"> & {
  /** Sanity's tiny base64 preview (`asset->metadata.lqip`). */
  lqip?: string | null;
  /** Sanity hotspot, used to aim the blurred preview at the same spot as the crop. */
  hotspot?: { x?: number | null; y?: number | null } | null;
};

/**
 * A `fill` image that never shows an empty box: Sanity's blurred preview is
 * painted instantly (it is inlined in the HTML), and the real photo fades in
 * over it once loaded. The parent must be positioned (relative/absolute).
 */
export function BlurUpImage({ lqip, hotspot, className, onLoad, alt, ...props }: BlurUpImageProps) {
  const [loaded, setLoaded] = useState(false);
  const position =
    hotspot && typeof hotspot.x === "number" && typeof hotspot.y === "number"
      ? `${hotspot.x * 100}% ${hotspot.y * 100}%`
      : "center";

  return (
    <>
      {lqip ? (
        <span
          aria-hidden
          className={[
            "absolute inset-0 scale-110 bg-cover blur-xl transition-opacity duration-700 motion-reduce:transition-none",
            loaded ? "opacity-0" : "opacity-100",
          ].join(" ")}
          style={{ backgroundImage: `url("${lqip}")`, backgroundPosition: position }}
        />
      ) : null}
      <Image
        {...props}
        alt={alt}
        fill
        onLoad={(event) => {
          setLoaded(true);
          onLoad?.(event);
        }}
        className={[
          className,
          "transition-opacity duration-700 motion-reduce:transition-none",
          loaded ? "opacity-100" : "opacity-0",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </>
  );
}
