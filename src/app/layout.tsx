import type { Metadata } from "next";
import { Geist_Mono, Inter } from "next/font/google";

import { SiteNav } from "@/components/site-nav";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PromptBina — Jana prompt untuk membina aplikasi",
  description:
    "Isi masalah, sasaran pengguna, cadangan menu, dan situasi. PromptBina menyusunnya menjadi prompt AI yang sedia digunakan untuk membina aplikasi.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="ms"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background text-foreground">
        <style
          dangerouslySetInnerHTML={{
            __html: `
              html, body { margin: 0; min-height: 100%; background: #f4f7fb; color: #12203a; font-family: ui-sans-serif, system-ui, sans-serif; }
              a { color: #1d4ed8; }
              textarea, input, select { width: 100%; max-width: 100%; box-sizing: border-box; font: inherit; }
              textarea { min-height: 7rem; display: block; }
              input, select, textarea { border: 1px solid #c5d4ea; border-radius: 8px; padding: .45rem .65rem; background: #fff; }
              button[type="submit"] { background: #1d4ed8; color: #fff; border: 0; border-radius: 8px; padding: .65rem 1.1rem; cursor: pointer; font: inherit; }
            `,
          }}
        />
        <SiteNav />
        <div className="flex min-h-0 flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
