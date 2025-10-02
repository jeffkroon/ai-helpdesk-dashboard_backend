import type React from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/lib/providers"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata = {
  title: "Voiceflow Analytics Dashboard",
  description: "Analytics and insights for your Voiceflow chatbot",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} antialiased dark`}>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
