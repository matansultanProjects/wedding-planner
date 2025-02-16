import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "חתונה חכמה - תכנון חתונות מושלם",
  description: "פלטפורמה מקיפה לתכנון וניהול חתונות",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="he" dir="rtl">
      <body className={inter.className}>{children}</body>
    </html>
  )
}



import './globals.css'