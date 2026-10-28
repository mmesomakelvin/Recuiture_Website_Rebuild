import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "Recruiture | Find work. Build teams.",
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
    title: "Recruiture | Find work. Build teams.",
    description: "Find opportunities and connect with talent across Nigeria.",
  },
  twitter: {
    card: "summary",
    title: "Recruiture | Find work. Build teams.",
    description: "Find opportunities and connect with talent across Nigeria.",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${poppins.className} flex min-h-full flex-col`}>{children}</body>
    </html>
  )
}
