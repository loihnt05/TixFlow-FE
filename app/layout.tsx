import type { Metadata } from "next";
import { Prompt } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AppAuthProvider } from "@/components/auth-provider";

const promptFont = Prompt({
  subsets: ["latin", "thai"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-prompt",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TixFlow — Inspiration Everywhere | Discover & Book Events",
  description: "Discover concerts, conferences, exhibitions, workshops, and experiences with TixFlow.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={promptFont.variable}>
      <body className={promptFont.className}>
        <AppAuthProvider>
          <Header />
          {children}
          <Footer />
        </AppAuthProvider>
      </body>
    </html>
  );
}
