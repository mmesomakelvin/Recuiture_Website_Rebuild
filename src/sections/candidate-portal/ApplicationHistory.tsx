import { CandidatePortal } from './components/CandidatePortal'
import { portalProps } from './preview-props'

export default function ApplicationHistoryPreview() {
  return <CandidatePortal {...portalProps} activeTab="applications" initialApplicationId="cap-03" />
}
