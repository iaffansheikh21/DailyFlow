import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from "@/context/AuthContext"
import './globals.css'

export const metadata: Metadata = {
  title: 'TodoFlow',
  description: 'A modern todo application built with Next.js and Geist UI',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <AuthProvider>
        {children}
        </AuthProvider>
        <Analytics />
      </body>
    </html>
  )
}
