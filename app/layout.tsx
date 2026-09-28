import type { Metadata } from "next";
import "./globals.css";
<<<<<<< HEAD
import { AppAuthProvider } from "@/components/auth-provider";
import { SiteHeader } from "@/components/auth-controls";
=======
>>>>>>> origin/dev

export const metadata: Metadata = {
  title: "TixFlow",
  description: "Đặt vé sự kiện nhanh, minh bạch và an toàn"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
<<<<<<< HEAD
      <body><AppAuthProvider><SiteHeader />{children}</AppAuthProvider></body>
=======
      <body>{children}</body>
>>>>>>> origin/dev
    </html>
  );
}

