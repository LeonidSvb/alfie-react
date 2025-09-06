import type { Metadata } from 'next'
import './globals.css'
import '../styles/embed.css'

export const metadata: Metadata = {
  title: 'Outdoorable TripGuide Widget',
  description: 'Get your personalized outdoor trip guide and connect with local experts',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  )
}