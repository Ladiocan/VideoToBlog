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
  title: "VideoToBlog.ro - Transformă Video YouTube în Articole de Blog cu AI | Transcriere Video în Text",
  description: "Transformă video-uri YouTube în articole de blog SEO-ready + imagine unică generată cu AI. Serviciu de transcriere video în text și content marketing automat pentru piața din România. Doar 5 RON per articol, fără abonament.",
  keywords: "video în text, articol din youtube, transcriere video, content marketing automat, youtube to blog, transformă video în articol, AI content generator, transcriere video românia, articol blog din video, content automat",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "VideoToBlog.ro - Transformă Video YouTube în Articole de Blog",
    description: "Transformă video-uri YouTube în articole de blog SEO-ready + imagine unică. Doar 5 RON per articol, fără abonament.",
    type: "website",
    locale: "ro_RO",
  },
  twitter: {
    card: "summary_large_image",
    title: "VideoToBlog.ro - Transformă Video YouTube în Articole de Blog",
    description: "Transformă video-uri YouTube în articole de blog SEO-ready + imagine unică. Doar 5 RON per articol.",
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
    <html lang="ro">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
