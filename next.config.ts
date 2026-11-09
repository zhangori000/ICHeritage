import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Sanity images are resized by Sanity's own CDN; see the loader for why.
    loader: "custom",
    loaderFile: "./src/sanity/lib/imageLoader.ts",
  },
};

export default nextConfig;
