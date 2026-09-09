import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TixFlow",
  description: "Đặt vé sự kiện nhanh, minh bạch và an toàn"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}

