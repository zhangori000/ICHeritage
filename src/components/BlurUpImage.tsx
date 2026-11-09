"use client";

import Image, { type ImageProps } from "next/image";
import { useCallback, useState } from "react";

type BlurUpImageProps = Omit<ImageProps, "fill" | "placeholder" | "blurDataURL" | "ref"> & {
  /** Sanity's tiny base64 preview (`asset->metadata.lqip`). */
  lqip?: string | null;
  /** Sanity hotspot, used to aim the blurred preview at the same spot as the crop. */
  hotspot?: { x?: number | null; y?: number | null } | null;
};

/**
 * "static"  server HTML / before hydration: photo fully visible, so it shows
 *           as soon as the browser has it even if JavaScript is slow or off.
 * "fading"  hydrated while the photo was still downloading: hide it and fade
 *           it in on load (WebP/AVIF paint nothing until complete, so hiding
 *           an in-flight image is invisible to the visitor).
 * "shown"   photo loaded: fully visible, blurred preview faded out.
 */
type Phase = "static" | "fading" | "shown";

/**
 * A `fill` image that never shows an empty box: Sanity's blurred preview is
 * painted instantly (it is inlined in the HTML) underneath, and the real
 * photo covers it once loaded. The parent must be positioned.
 */
export function BlurUpImage({ lqip, hotspot, className, onLoad, alt, ...props }: BlurUpImageProps) {
  const [phase, setPhase] = useState<Phase>("static");

  // Runs once the <img> is attached on the client. Only an image that is
  // still downloading switches to the fade-in path.
  const imageRef = useCallback((img: HTMLImageElement | null) => {
    if (img && !img.complete) {
      setPhase((current) => (current === "static" ? "fading" : current));
    }
  }, []);

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
            phase === "shown" ? "opacity-0" : "opacity-100",
          ].join(" ")}
          style={{ backgroundImage: `url("${lqip}")`, backgroundPosition: position }}
        />
      ) : null}
      <Image
        {...props}
        ref={imageRef}
        alt={alt}
        fill
        onLoad={(event) => {
          setPhase("shown");
          onLoad?.(event);
        }}
        className={[
          className,
          "transition-opacity duration-700 motion-reduce:transition-none",
          phase === "fading" ? "opacity-0" : "opacity-100",
        ]
          .filter(Boolean)
          .join(" ")}
      />
    </>
  );
}
