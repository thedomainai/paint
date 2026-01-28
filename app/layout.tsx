import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Paint - Image Prompt Builder",
  description: "Build structured image generation prompts with a visual interface",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* Neon glow orbs */}
        <div className="glow-orb glow-orb-1" aria-hidden="true" />
        <div className="glow-orb glow-orb-2" aria-hidden="true" />
        <div className="glow-orb glow-orb-3" aria-hidden="true" />
        {/* Grid pattern overlay */}
        <div className="fixed inset-0 grid-pattern pointer-events-none z-0" aria-hidden="true" />
        {/* Main content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
