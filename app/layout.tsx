import type { Metadata } from "next";
import { Outfit, Geist_Mono, Oi, Alexandria, Cairo, Lalezar } from "next/font/google";
import "./globals.css";
import AppLayout from "@/components/AppLayout";

const outfit = Outfit({
  variable: "--font-geist-sans", // keep same variable for simplicity
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const oiFont = Oi({
  weight: "400",
  variable: "--font-oi",
  subsets: ["latin"],
});

const alexandria = Alexandria({
  variable: "--font-alexandria",
  subsets: ["arabic", "latin"],
});

const cairo = Cairo({
  variable: "--font-cairo",
  subsets: ["arabic", "latin"],
});

const lalezar = Lalezar({
  weight: "400",
  variable: "--font-lalezar",
  subsets: ["arabic", "latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artifix.tech"),
  title: {
    default: "ArtiFix | The Ultimate AI Tool-kit for Creators & Designers",
    template: "%s | ArtiFix"
  },
  description: "The most powerful AI toolkit for content creators, designers, and marketers. Write SEO articles, fix Arabic fonts, upscale images and videos, and denoise audio with cutting-edge AI.",
  keywords: [
    "AI toolkit", "artificial intelligence", "content creator tools", "SEO article writer", 
    "Arabic font fixer", "image upscaler", "video upscaler 4k", "audio denoise",
    "الذكاء الاصطناعي", "أدوات الذكاء الاصطناعي", "كتابة مقالات بالذكاء الاصطناعي",
    "تصحيح الخطوط العربية", "تحسين جودة الصور", "توضيح الفيديوهات", "تنقية الصوت"
  ],
  authors: [{ name: "ArtiFix Team" }],
  creator: "ArtiFix",
  publisher: "ArtiFix",
  openGraph: {
    type: "website",
    locale: "ar_EG",
    url: "https://artifix.tech",
    siteName: "ArtiFix",
    title: "ArtiFix | The Ultimate AI Tool-kit for Creators",
    description: "The most powerful AI toolkit for content creators, designers, and marketers. Write SEO articles, fix Arabic fonts, upscale images and videos, and denoise audio with cutting-edge AI.",
    images: [
      {
        url: "/icon.png",
        width: 800,
        height: 600,
        alt: "ArtiFix Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ArtiFix | The Ultimate AI Tool-kit for Creators",
    description: "The most powerful AI toolkit for content creators, designers, and marketers. Write SEO articles, fix Arabic fonts, upscale images and videos, and denoise audio.",
    images: ["/icon.png"],
  },
  alternates: {
    canonical: "https://artifix.tech",
  },
};

import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import { LanguageProvider } from "@/contexts/LanguageContext";

import AuthProvider from "@/components/AuthProvider";

import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // We can dynamically control 'dir' and 'lang' later if implementing full i18n
  return (
    <html lang="en" dir="ltr">
      <body
        className={`${outfit.variable} ${geistMono.variable} ${oiFont.variable} ${alexandria.variable} ${cairo.variable} ${lalezar.variable} bg-background text-foreground min-h-screen relative`}
      >
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-VJ08TV1F19"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){window.dataLayer.push(arguments);}
            gtag('js', new Date());

            gtag('config', 'G-VJ08TV1F19');
          `}
        </Script>

        <AuthProvider>
          <LanguageProvider>
            <SmoothScrollProvider>
              <CustomCursor>
                <AppLayout>
                  {children}
                </AppLayout>
              </CustomCursor>
            </SmoothScrollProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
