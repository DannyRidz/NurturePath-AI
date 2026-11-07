import type { Metadata } from "next";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NurturePath | Fictional examples",
    template: "%s | NurturePath",
  },
  description:
    "Explore twelve fictional male reproductive health examples, written guidance, printable reports and optional Gemini conversation questions for General learning. No personal health intake.",
  robots: { index: false, follow: false },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AppFrame>{children}</AppFrame>
      </body>
    </html>
  );
}
