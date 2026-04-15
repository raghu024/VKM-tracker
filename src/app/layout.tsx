import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionProvider from "@/components/SessionProvider";
import Navbar from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "VK & SIP Mentorship Program | 12-Week Business Transformation",
  description:
    "Track your progress through the VK & SIP 12-week Business Transformation Journey. Upload proof of implementation, earn points, and compete on the leaderboard.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        {/* Aurora animated background */}
        <div className="aurora-bg" />
        <div className="grid-overlay" />

        <SessionProvider>
          <Navbar />
          <main className="relative flex-1">{children}</main>
          <footer className="relative border-t border-white/[0.04] py-10 text-center">
            <p className="text-xs font-bold tracking-[0.2em] text-white/20 uppercase">
              Unik Life Company | VK & SIP Mentorship Program
            </p>
          </footer>
        </SessionProvider>
      </body>
    </html>
  );
}
