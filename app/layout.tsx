import type { Metadata } from "next";
import "./globals.css";
import { GeistSans } from "geist/font/sans"
import { Toaster } from "@/components/ui/toaster";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="dark">
      <body
        className={`${GeistSans.className} antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
