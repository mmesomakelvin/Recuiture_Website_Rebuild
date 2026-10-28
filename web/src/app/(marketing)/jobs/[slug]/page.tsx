import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { previewJobs } from '@/lib/jobs/mock-jobs'
import JobDetail from './JobDetailClient'

interface JobDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = previewJobs.find((item) => item.slug === slug)
  if (!job) return { title: 'Job not found' }
  return {
    title: `${job.title} at ${job.company}`,
    description: job.description,
    openGraph: { title: `${job.title} at ${job.company}`, description: job.description, type: 'website' },
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params
  const job = previewJobs.find((item) => item.slug === slug)
  if (!job) notFound()
  return <JobDetail job={job} />
}
