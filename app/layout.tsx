import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export const metadata: Metadata = {
  title: "Zipevent — Inspiration Everywhere",
  description: "Discover events, experiences, and inspiration everywhere."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body><Header />{children}<Footer /></body>
    </html>
  );
}
