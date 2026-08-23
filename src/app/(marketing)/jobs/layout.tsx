import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Jobs",
  description: "Search and filter thousands of job opportunities from top companies.",
}

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}