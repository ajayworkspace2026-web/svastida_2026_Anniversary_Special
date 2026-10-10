import type { Metadata } from "next";
import "./globals.css";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";

const displayFont = Cormorant_Garamond({ subsets: ["latin"], variable: "--font-display-local" });
const bodyFont = DM_Sans({ subsets: ["latin"], variable: "--font-body-local" });
import { CartProvider } from "@/components/cart/CartProvider";
import TailorAssistant from "@/components/TailorAssistant";
import CyberSafetyNotice from "@/components/CyberSafetyNotice";

export const metadata: Metadata = {
  metadataBase: process.env.NEXT_PUBLIC_SITE_URL
    ? new URL(process.env.NEXT_PUBLIC_SITE_URL)
    : undefined,
  title: {
    default: "Svastida",
    template: "%s | Svastida",
  },
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
      <body className={`${displayFont.variable} ${bodyFont.variable}`}>
        <CartProvider>
          {children}
          <TailorAssistant aiConfigured={Boolean(process.env.AI_PROVIDER_API_KEY)} />
          <CyberSafetyNotice />
        </CartProvider>
      </body>
    </html>
  );
}
