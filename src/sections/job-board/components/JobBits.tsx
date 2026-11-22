import { Building2, GraduationCap } from 'lucide-react'
import type { Company, Job } from '@/../product/sections/job-board/types'
import { companyInitials, isNewJob, logoTone } from './format'

interface CompanyLogoProps {
  company: Company
  size?: 'sm' | 'md' | 'lg'
}

const LOGO_SIZES = {
  sm: 'h-10 w-10 rounded-lg text-sm',
  md: 'h-12 w-12 rounded-xl text-base',
  lg: 'h-16 w-16 rounded-2xl text-xl',
}

export function CompanyLogo({ company, size = 'md' }: CompanyLogoProps) {
  if (company.logoUrl) {
    return (
      <img
        src={company.logoUrl}
        alt={`${company.name} logo`}
        className={`${LOGO_SIZES[size]} shrink-0 border border-stone-200 bg-white object-contain p-1`}
      />
    )
  }
  return (
    <span
      aria-hidden="true"
      className={`${LOGO_SIZES[size]} ${logoTone(company.id)} flex shrink-0 items-center justify-center font-semibold tracking-tight`}
    >
      {companyInitials(company.name)}
    </span>
  )
}

export function GraduateFriendlyBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-900 ring-1 ring-inset ring-amber-300/70">
      <GraduationCap className="h-3.5 w-3.5" strokeWidth={2.25} />
      Graduate-friendly
    </span>
  )
}

export function EduBridgeBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-semibold text-teal-900 ring-1 ring-inset ring-teal-200">
      <Building2 className="h-3.5 w-3.5" strokeWidth={2.25} />
      Hiring through EduBridge
    </span>
  )
}

export function NewBadge() {
  return (
    <span className="inline-flex items-center rounded-full bg-teal-900 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-200">
      New
    </span>
  )
}

/** Graduate-friendly and Hiring through EduBridge badges; renders nothing when neither applies */
export function JobBadges({ job }: { job: Job }) {
  if (!job.isGraduateFriendly && !job.isManagedByEduBridge) return null
  return (
    <div className="flex flex-wrap gap-1.5">
      {job.isGraduateFriendly && <GraduateFriendlyBadge />}
      {job.isManagedByEduBridge && <EduBridgeBadge />}
    </div>
  )
}

export function NewJobBadge({ job }: { job: Job }) {
  return isNewJob(job) ? <NewBadge /> : null
}
