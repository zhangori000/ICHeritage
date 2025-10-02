// src/app/layout.tsx
import "./globals.css";
import { Inter, Noto_Serif_SC } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const notoSerif = Noto_Serif_SC({
  subsets: ["latin"],
  variable: "--font-noto-serif-sc",
  weight: ["400", "500", "600"], // gives you thinner options
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
