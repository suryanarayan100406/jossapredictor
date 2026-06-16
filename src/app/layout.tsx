import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "2026 College Predictor (JoSAA) — Predict Your Dream College",
  description:
    "Free, no-login tool that predicts your JoSAA college admissions based on JEE rank, category, and preferences. Get Safe, Moderate, and Ambitious predictions for IITs, NITs, IIITs, and GFTIs.",
  keywords: [
    "JoSAA", "college predictor", "JEE Main", "JEE Advanced",
    "IIT", "NIT", "IIIT", "GFTI", "cutoff", "rank predictor",
    "engineering admission", "2026", "counselling"
  ],
  openGraph: {
    title: "2026 College Predictor (JoSAA)",
    description: "Predict your JoSAA college admissions for free. No login required.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Animated background orbs */}
        <div className="animated-bg" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
