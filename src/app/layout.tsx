import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "GoldLens — MCX Gold Cross-Contract Intelligence",
  description: "Normalize. Compare. Validate. Trade only what survives. GoldLens converts fragmented MCX gold contracts into defensible market intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased bg-[#0B0E11] text-[#EAECEF] overflow-hidden">
        {children}
      </body>
    </html>
  );
}
