import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RankScope — JoSAA College Predictor 2026",
  description:
    "Free, no-login tool that predicts your JoSAA college admissions based on JEE rank, category, and preferences. Get Safe, Moderate, and Ambitious predictions for IITs, NITs, IIITs, and GFTIs.",
  keywords: [
    "JoSAA", "college predictor", "JEE Main", "JEE Advanced",
    "IIT", "NIT", "IIIT", "GFTI", "cutoff", "rank predictor",
    "engineering admission", "2026", "counselling"
  ],
  openGraph: {
    title: "RankScope — JoSAA College Predictor 2026",
    description: "Intelligence for your JoSAA counselling. Predict your admissions for free.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
