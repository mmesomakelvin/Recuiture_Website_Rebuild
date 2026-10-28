import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Browse Jobs",
  description: "Explore roles by skill, location, work mode, and experience level on Recruiture.",
}

export default function JobsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
