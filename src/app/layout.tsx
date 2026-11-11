// src/app/layout.tsx
import "./globals.css";
import { Fraunces, Inter, Noto_Serif_SC } from "next/font/google";

// All three fonts are self-hosted and preloaded by next/font. `display: "swap"`
// shows the system fallback immediately (no invisible text), and next/font's
// size-adjusted fallback keeps the swap from shifting the layout.
//
// Inter       body text, labels, buttons
// Fraunces    display headings (variable optical size: tight at 9, open at 144)
// Noto Serif  Chinese characters used as typographic elements (传承, 薪火相传)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  weight: "variable",
  style: ["normal", "italic"],
  axes: ["opsz"],
  display: "swap",
});
const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
  weight: ["400", "600", "900"],
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
      className={`${inter.variable} ${fraunces.variable} ${notoSerif.variable} font-sans`}
    >
      <body>{children}</body>
    </html>
  );
}
