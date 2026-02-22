import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { DemoBanner } from "@/components/shared/demo-banner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "Tideshift — Demand-Driven Token Migration for Solana",
  description:
    "Full-lifecycle infrastructure for token migrations to Solana. Discover demand, score candidates, and onboard communities — powered by Sunrise.",
  openGraph: {
    title: "Tideshift",
    description:
      "Demand-driven token migration pipeline for Solana. From discovery to onboarding.",
    type: "website",
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
        className={`${dmSans.variable} ${jetbrainsMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <DemoBanner />
        </ThemeProvider>
      </body>
    </html>
  );
}
