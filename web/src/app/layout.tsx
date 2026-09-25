import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: {
    default: "Recruiture - Find Your Dream Job",
    template: "%s | Recruiture",
  },
  description: "Connect with top companies and find your perfect role. Smart job matching, transparent salaries, and a seamless application experience.",
  keywords: ["jobs", "career", "recruitment", "hiring", "employment"],
  authors: [{ name: "Recruiture" }],
  creator: "Recruiture",
  publisher: "Recruiture",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recruiture.edubridgeacademy.com",
    siteName: "Recruiture",
    title: "Recruiture - Find Your Dream Job",
    description: "Connect with top companies and find your perfect role.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Recruiture",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Recruiture - Find Your Dream Job",
    description: "Connect with top companies and find your perfect role.",
    images: ["/og-image.png"],
  },
  verification: {
    google: "google-site-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  )
}