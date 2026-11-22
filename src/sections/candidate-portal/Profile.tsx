import { CandidatePortal } from './components/CandidatePortal'
import { portalProps } from './preview-props'

export default function ProfilePreview() {
  return <CandidatePortal {...portalProps} activeTab="profile" />
}
