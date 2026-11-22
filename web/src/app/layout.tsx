import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

// Poppins is the EduBridge brand font; exposed as --font-poppins for Tailwind's font-sans
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-poppins",
})

export const metadata: Metadata = {
  title: {
    default: "Recruiture | Find the right role. Hire the right people.",
    template: "%s | Recruiture",
  },
  description: "Find opportunities and connect with talent across Nigeria. Recruiture is the recruitment platform by EduBridge Academy.",
  keywords: ["Nigeria jobs", "recruitment", "hiring", "EduBridge Academy"],
  authors: [{ name: "EduBridge Academy" }],
  creator: "EduBridge Academy",
  publisher: "EduBridge Academy",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://recruiture.edubridgeacademy.com",
    siteName: "Recruiture",
    title: "Recruiture | Find the right role. Hire the right people.",
    description: "Find opportunities and connect with talent across Nigeria.",
  },
  twitter: {
    card: "summary",
    title: "Recruiture | Find the right role. Hire the right people.",
    description: "Find opportunities and connect with talent across Nigeria.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${poppins.variable} h-full bg-white antialiased`}>
      <body className={`${poppins.className} flex min-h-full flex-col bg-white`}>{children}</body>
    </html>
  )
}
