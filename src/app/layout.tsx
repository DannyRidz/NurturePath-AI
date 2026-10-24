import type { Metadata } from "next";
import { AppFrame } from "@/components/app-frame";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NurturePath | Fictional demonstration",
    template: "%s | NurturePath",
  },
  description:
    "Explore a fictional reproductive health information journey. Authored simulation, not a personal assessment or clinical service.",
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
