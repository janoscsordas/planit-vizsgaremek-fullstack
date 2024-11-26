import "@radix-ui/themes/styles.css"
import type { Metadata } from "next"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { Toaster } from "@/components/ui/toaster"
import { Theme } from "@radix-ui/themes"
import { Providers } from "@/lib/providers/providers"

export const metadata: Metadata = {
  title: "Planitapp - Kövesd nyomon a terveid!",
  description: "Planitapp - Kövesd nyomon a terveid!",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hu" className="dark">
      <body className={`${GeistSans.className} antialiased`}>
        <Theme hasBackground={false}>
          <Providers>{children}</Providers>
          <Toaster />
        </Theme>
      </body>
    </html>
  )
}
