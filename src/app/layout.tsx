import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GoldLens | One price per gram for MCX gold",
  description: "Four MCX gold contracts, normalized to a single price per gram, with an honest answer on whether anything is worth doing today.",
  openGraph: {
    title: "GoldLens | One price per gram for MCX gold",
    description: "Four MCX gold contracts normalized to one true price per gram.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#0A0A0B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0A0A0B] text-[#F5F2EA] min-h-screen selection:bg-gold/20 selection:text-gold`}>
        {children}
      </body>
    </html>
  );
}
