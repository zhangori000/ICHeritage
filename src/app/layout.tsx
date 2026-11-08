// src/app/layout.tsx
import "./globals.css";
import { Inter, Noto_Serif_SC } from "next/font/google";

// Both fonts are self-hosted and preloaded by next/font. `display: "swap"`
// shows the system fallback immediately (no invisible text), and next/font's
// size-adjusted fallback keeps the swap from shifting the layout.
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
  weight: ["400", "500", "600"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${notoSerif.variable} font-sans`} // base = Inter
    >
      <body>{children}</body>
    </html>
  );
}
