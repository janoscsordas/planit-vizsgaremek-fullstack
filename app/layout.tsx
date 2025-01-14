import "@radix-ui/themes/styles.css"
import type { Metadata } from "next"
import "./globals.css"
import { GeistSans } from "geist/font/sans"
import { Theme } from "@radix-ui/themes"
import { Providers } from "@/lib/providers/providers"
import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { ThemeProvider } from "@/app/(profile)/appearance/theme-provider"

export const metadata: Metadata = {
  title: "Planitapp - Kövesd nyomon a terveid!",
  description: "Planitapp - Kövesd nyomon a terveid!",
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <body className={`${GeistSans.className} antialiased`}>
        <ThemeProvider
          attribute={"class"}
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Theme
            hasBackground={false}
            className={`${GeistSans.className} antialiased`}
          >
            <Providers>{children}</Providers>
            <Toaster />
            <Sonner />
          </Theme>
        </ThemeProvider>
      </body>
    </html>
  )
}
