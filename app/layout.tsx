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
  title: "ArtiFix - The Ultimate AI Tool-kit for Designers & Creators",
  description: "AI Font Fixer, Content Architect, Visual Transformer, and more.",
};

import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import CustomCursor from "@/components/CustomCursor";
import { LanguageProvider } from "@/contexts/LanguageContext";

import AuthProvider from "@/components/AuthProvider";

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
