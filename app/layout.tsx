import type { Metadata } from "next";
import type { CSSProperties } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteConfigProvider } from "./site-config-context";
import { getSiteConfig } from "@/server/site/site";
import { getSiteMetadata } from "@/utils/seo";
import { Navbar } from "./navbar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

type ThemeStyle = CSSProperties & {
  "--site-primary": string;
  "--site-primary-soft": string;
  "--site-secondary": string;
  "--site-secondary-soft": string;
  "--site-radius": string;
  "--site-font": string;
};

const radiusValues: Record<string, string> = {
  none: "0",
  sm: "0.125rem",
  md: "0.375rem",
  lg: "0.5rem",
  xl: "0.75rem",
  "2xl": "1rem",
  full: "9999px",
};

function getRadiusValue(radius: string): string {
  return radiusValues[radius] ?? radius;
}

function getThemeStyle(theme: {
  primaryColor: string;
  secondaryColor: string;
  borderRadius: string;
  fontFamily: string;
}): ThemeStyle {
  return {
    "--site-primary": theme.primaryColor,
    "--site-primary-soft": `color-mix(in oklab, ${theme.primaryColor} 10%, transparent)`,
    "--site-secondary": theme.secondaryColor,
    "--site-secondary-soft": `color-mix(in oklab, ${theme.secondaryColor} 10%, transparent)`,
    "--site-radius": getRadiusValue(theme.borderRadius),
    "--site-font": theme.fontFamily,
  };
}

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();

  return getSiteMetadata(siteConfig);
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();
  const themeStyle = getThemeStyle(siteConfig.theme);

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      style={themeStyle}
    >
      <body className="min-h-full flex flex-col">
        <SiteConfigProvider value={siteConfig}>
          <Navbar siteConfig={siteConfig} />
          <main className="flex-1">{children}</main>
        </SiteConfigProvider>
      </body>
    </html>
  );
}
