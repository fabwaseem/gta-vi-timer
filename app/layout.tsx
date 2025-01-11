import type { Metadata } from "next";
import { Orbitron, Press_Start_2P } from "next/font/google";
import "./globals.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const pressStart = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-press-start",
});

export const metadata: Metadata = {
  title: "GTA VI Countdown Timer",
  description:
    "Track the countdown to GTA VI release and days since first trailer",
  keywords: [
    "GTA VI",
    "GTA",
    "GTA 6",
    "GTA 6 countdown",
    "GTA 6 release",
    "GTA 6 trailer",
    "GTA 6 release date",
    "GTA 6 release date countdown",
    "GTA 6 release date countdown timer",
  ],
  openGraph: {
    title: "GTA VI Countdown Timer",
    description:
      "Track the countdown to GTA VI release and days since first trailer",
    url: "https://gta-vi-countdown.vercel.app",
    siteName: "GTA VI Countdown Timer",
  },
  applicationName: "GTA VI Countdown Timer",
  robots: {
    index: true,
    follow: true,
  },
  creator: "https://github.com/fabwaseem",
  category: "games",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${orbitron.variable} ${pressStart.variable}`}>
        {children}
      </body>
    </html>
  );
}
