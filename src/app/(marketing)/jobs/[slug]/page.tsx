import { Metadata } from "next"
import { notFound } from "next/navigation"
import JobDetail from "./JobDetailClient"

const mockJobs: Record<string, any> = {
  'senior-frontend-engineer': {
    id: '1',
    title: 'Senior Frontend Engineer',
    company: 'TechCorp Inc.',
    companyLogo: null,
    location: 'San Francisco, CA',
    isRemote: true,
    jobType: ['FULL_TIME'],
    salaryMin: 150000,
    salaryMax: 200000,
    experienceLevel: 'SENIOR',
    postedAt: '2024-01-15',
    slug: 'senior-frontend-engineer',
    description: `
We are looking for a Senior Frontend Engineer to join our growing team. You will be responsible for building and maintaining our customer-facing web applications using React, TypeScript, and modern tooling.

**What you'll do:**
- Lead the development of new features for our core product
- Collaborate with designers and product managers to define requirements
- Mentor junior engineers and conduct code reviews
- Optimize application performance and user experience
- Contribute to our design system and component library

**Who you are:**
- 5+ years of professional frontend development experience
- Expert knowledge of React, TypeScript, and modern CSS
- Experience with state management (Redux, Zustand, or similar)
- Strong understanding of web performance optimization
- Experience with testing frameworks (Jest, Cypress, Playwright)
- Excellent communication and collaboration skills
    `,
    requirements: `
- 5+ years of professional frontend development experience
- Expert knowledge of React 18+, TypeScript, and modern CSS
- Experience with Next.js, Remix, or similar frameworks
- Strong understanding of web performance optimization
- Experience with testing frameworks (Jest, Cypress, Playwright)
- Experience with design systems and component libraries
- Excellent communication and collaboration skills
    `,
    responsibilities: `
- Lead the development of new features for our core product
- Collaborate with designers and product managers to define requirements
- Mentor junior engineers and conduct code reviews
- Optimize application performance and user experience
- Contribute to our design system and component library
- Participate in architectural decisions and technical planning
    `,
    benefits: `
- Competitive salary and equity package
- Comprehensive health, dental, and vision insurance
- 401(k) matching
- Flexible PTO and remote work options
- Learning and development budget ($2,000/year)
- Home office stipend
- Team retreats and social events
    `,
    skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest', 'Cypress'],
  },
  'backend-developer': {
    id: '2',
    title: 'Backend Developer',
    company: 'StartupXYZ',
    companyLogo: null,
    location: 'New York, NY',
    isRemote: false,
    jobType: ['FULL_TIME'],
    salaryMin: 120000,
    salaryMax: 160000,
    experienceLevel: 'MID',
    postedAt: '2024-01-14',
    slug: 'backend-developer',
    description: 'Join our backend team to build scalable APIs and services...',
    requirements: '3+ years backend experience, Node.js/Go, PostgreSQL, AWS',
    responsibilities: 'Design and implement RESTful APIs, optimize database queries',
    benefits: 'Health insurance, equity, flexible hours',
    skills: ['Node.js', 'Go', 'PostgreSQL', 'AWS', 'Docker', 'Kubernetes'],
  },
  'devops-engineer': {
    id: '3',
    title: 'DevOps Engineer',
    company: 'CloudScale',
    companyLogo: null,
    location: 'Remote',
    isRemote: true,
    jobType: ['FULL_TIME', 'REMOTE'],
    salaryMin: 130000,
    salaryMax: 180000,
    experienceLevel: 'SENIOR',
    postedAt: '2024-01-13',
    slug: 'devops-engineer',
    description: 'Build and maintain our cloud infrastructure...',
    requirements: '5+ years DevOps, AWS/GCP, Kubernetes, Terraform',
    responsibilities: 'Manage CI/CD pipelines, monitor infrastructure',
    benefits: 'Remote-first, competitive salary, learning budget',
    skills: ['AWS', 'Kubernetes', 'Terraform', 'Docker', 'Prometheus', 'Grafana'],
  },
}

interface JobDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: JobDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const job = mockJobs[slug]
  
  if (!job) {
    return { title: 'Job Not Found' }
  }

  return {
    title: `${job.title} at ${job.company}`,
    description: job.description.slice(0, 160),
    openGraph: {
      title: `${job.title} at ${job.company}`,
      description: job.description.slice(0, 160),
      type: 'website',
    },
  }
}

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const { slug } = await params
  const job = mockJobs[slug]

  if (!job) {
    notFound()
  }

  return <JobDetail job={job} />
}