import { CandidatePortal } from './components/CandidatePortal'
import { portalProps } from './preview-props'

export default function MyApplicationsPreview() {
  return <CandidatePortal {...portalProps} activeTab="applications" />
}
