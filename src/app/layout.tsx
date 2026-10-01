import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { getLang } from "@/lib/session";
import "./globals.css";

export const metadata: Metadata = {
  title: "GymSathi — your pocket gym coach",
  description: "A calm, structured workout companion for beginners in Bangladesh.",
  applicationName: "GymSathi",
  appleWebApp: { capable: true, title: "GymSathi", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = { themeColor: "#07100f", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: ReactNode }) {
  const lang = await getLang();
  return <html lang={lang}><body>{children}</body></html>;
}
