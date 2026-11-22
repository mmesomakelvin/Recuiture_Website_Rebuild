import { useState } from 'react'
import { BriefcaseBusiness, UserRound } from 'lucide-react'
import type { Application, Candidate, CandidatePortalProps, PortalTab } from '@/../product/sections/candidate-portal/types'
import { ApplicationDetail } from './ApplicationDetail'
import { ApplicationsTracker } from './ApplicationsTracker'
import { ProfilePanel } from './ProfilePanel'
import { PORTAL_STYLES } from './styles'

const TABS: { value: PortalTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { value: 'applications', label: 'My applications', icon: BriefcaseBusiness },
  { value: 'profile', label: 'Profile', icon: UserRound },
]

/**
 * The signed-in candidate area. Keeps a local copy of the data so actions show
 * straight away, and reports each action through its callback for the host app
 * to save.
 */
export function CandidatePortal({
  candidate: initialCandidate,
  today,
  applications: initialApplications,
  locationOptions,
  activeTab = 'applications',
  initialApplicationId = null,
  onTabChange,
  onOpenApplication,
  onViewJob,
  onOpenSubmittedCv,
  onWithdraw,
  onBrowseJobs,
  onUpdateProfile,
  onViewCv,
  onReplaceCv,
  onRequestPasswordReset,
}: CandidatePortalProps) {
  const [tab, setTab] = useState<PortalTab>(activeTab)
  const [lastActiveTab, setLastActiveTab] = useState<PortalTab>(activeTab)
  const [candidate, setCandidate] = useState<Candidate>(initialCandidate)
  const [applications, setApplications] = useState<Application[]>(initialApplications)
  const [selectedId, setSelectedId] = useState<string | null>(initialApplicationId)

  // Follow the activeTab prop when the host changes it
  if (activeTab !== lastActiveTab) {
    setLastActiveTab(activeTab)
    setTab(activeTab)
  }

  const selected = selectedId ? applications.find((app) => app.id === selectedId) : undefined
  const firstName = candidate.fullName.split(' ')[0]

  const switchTab = (next: PortalTab) => {
    setTab(next)
    setSelectedId(null)
    onTabChange?.(next)
  }

  const openApplication = (id: string) => {
    setSelectedId(id)
    onOpenApplication?.(id)
  }

  const withdraw = (id: string, reason: string) => {
    const at = new Date().toISOString()
    setApplications((current) =>
      current.map((app) =>
        app.id === id
          ? {
              ...app,
              stage: 'withdrawn',
              updatedAt: at,
              history: [...app.history, { id: `h-${Date.now().toString(36)}`, stage: 'withdrawn', at, actorKind: 'candidate', note: null, emailSent: false }],
            }
          : app,
      ),
    )
    onWithdraw?.(id, reason)
  }

  return (
    <div className="min-h-full">
      <style>{PORTAL_STYLES}</style>

      {/* Portal header */}
      <div className="border-b border-stone-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 pt-6 sm:px-6 sm:pt-8 lg:px-8">
          <p className="text-sm text-stone-500">My Recruiture</p>
          <h1 className="text-2xl font-semibold tracking-tight text-stone-900 sm:text-3xl">Hello, {firstName}</h1>
          <nav aria-label="Portal" className="-mb-px mt-5 flex gap-6">
            {TABS.map(({ value, label, icon: Icon }) => {
              const isCurrent = value === tab
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => switchTab(value)}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={`inline-flex items-center gap-2 border-b-2 pb-3 text-sm font-semibold transition ${
                    isCurrent
                      ? 'border-amber-400 text-teal-900'
                      : 'border-transparent text-stone-500 hover:border-stone-300 hover:text-stone-900'
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isCurrent ? 'text-teal-700' : ''}`} />
                  {label}
                </button>
              )
            })}
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {tab === 'applications' && selected && (
          <ApplicationDetail
            key={selected.id}
            application={selected}
            today={today}
            onBack={() => setSelectedId(null)}
            onViewJob={onViewJob}
            onOpenSubmittedCv={onOpenSubmittedCv}
            onWithdraw={(reason) => withdraw(selected.id, reason)}
          />
        )}

        {tab === 'applications' && !selected && (
          <ApplicationsTracker applications={applications} today={today} onOpen={openApplication} onBrowseJobs={onBrowseJobs} />
        )}

        {tab === 'profile' && (
          <ProfilePanel
            candidate={candidate}
            locationOptions={locationOptions}
            onSave={(input) => {
              setCandidate((current) => ({ ...current, ...input }))
              onUpdateProfile?.(input)
            }}
            onViewCv={onViewCv}
            onReplaceCv={(file) => {
              setCandidate((current) => ({ ...current, cv: { fileName: file.name, sizeBytes: file.size, uploadedAt: new Date().toISOString() } }))
              onReplaceCv?.(file)
            }}
            onRequestPasswordReset={onRequestPasswordReset}
          />
        )}
      </div>
    </div>
  )
}
