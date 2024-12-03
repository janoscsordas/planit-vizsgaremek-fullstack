import '@radix-ui/themes/styles.css'
import type { Metadata } from 'next'
import './globals.css'
import { GeistSans } from 'geist/font/sans'
import { Theme } from '@radix-ui/themes'
import { Providers } from '@/lib/providers/providers'
import { Toaster } from '@/components/ui/toaster'
import { Toaster as Sonner } from '@/components/ui/sonner'

export const metadata: Metadata = {
	title: 'Planitapp - Kövesd nyomon a terveid!',
	description: 'Planitapp - Kövesd nyomon a terveid!',
}

export default async function RootLayout({
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
					<Sonner />
				</Theme>
			</body>
		</html>
	)
}
