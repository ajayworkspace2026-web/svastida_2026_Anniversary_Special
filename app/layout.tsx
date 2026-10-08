import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Svastida | Custom Women's Fashion",
  description:
    "A premium custom women's fashion storefront with personalized styling and direct WhatsApp ordering.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
