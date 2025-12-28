import type { Metadata, Viewport } from "next";
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

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#000000",
};

export const metadata: Metadata = {
  // ... existing metadata
  title: {
    default: "Superball - Premium US Powerball & Lottery Generator",
    template: "%s | Superball",
  },
  description: "Boost your luck with Superball! The most beautiful and advanced random number generator for US Powerball and Mega Millions. Instant lucky numbers with history tracking.",
  keywords: ["Powerball", "Lottery Generator", "Lucky Numbers", "Superball", "US Lottery", "Lotto Numbers", "Random Number Generator", "Mega Millions"],
  authors: [{ name: "LuckyGen Team" }],
  creator: "LuckyGen",
  publisher: "LuckyGen",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://crush-super.netlify.app"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://crush-super.netlify.app",
    title: "Superball - Win the US Lottery",
    description: "Generate your winning Powerball numbers instantly. Beautiful, fast, and effectively random.",
    siteName: "Superball Lottery",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Superball Lottery Generator Interface",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Superball - Premium Lottery Generator",
    description: "Your daily dose of luck. Generate US Powerball numbers now.",
    creator: "@superball_lotto",
    // images: ["/twitter-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
