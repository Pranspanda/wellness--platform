import type { Metadata } from "next";
import { Geist, Geist_Mono, Dancing_Script } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-dancing-script",
  subsets: ["latin"],
});

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const LOGO_URL = SUPABASE_URL ? `${SUPABASE_URL}/storage/v1/object/public/static-assets/logo.png` : '/favicon.ico';

export const metadata: Metadata = {
  title: {
    default: "Pranspanda : Youth Society",
    template: "%s | Pranspanda"
  },
  description: "Empowering youth through mindfulness, healing, and conscious growth. Join Pranspanda to unlock your potential and find balance within.",
  keywords: ["Wellness", "Youth", "Mindfulness", "Healing", "Pranspanda", "Manisha Jain", "Mental Health", "Conscious Growth", "Meditation"],
  authors: [{ name: "Dr. Manisha Jain" }],
  creator: "Pranspanda",
  publisher: "Pranspanda",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pranspanda.com",
    title: "Pranspanda : Youth Society",
    description: "Guiding Youth Through Mindfulness, Healing & Conscious Growth",
    siteName: "Pranspanda",
    images: [
      {
        url: LOGO_URL,
        width: 800,
        height: 600,
        alt: "Pranspanda Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pranspanda : Youth Society",
    description: "Guiding Youth Through Mindfulness, Healing & Conscious Growth",
    images: [LOGO_URL],
  },
  icons: {
    icon: LOGO_URL,
    apple: LOGO_URL,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dancingScript.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
