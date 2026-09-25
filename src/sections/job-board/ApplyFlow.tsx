import data from '@/../product/sections/job-board/data.json'
import type { CurrentUser, Job } from '@/../product/sections/job-board/types'
import { ApplyFlow } from './components/ApplyFlow'

// Data Analyst at Paystream: has two screening questions, so all four steps show.
const job = (data.jobs as unknown as Job[]).find((item) => item.id === 'job-001')!

export default function ApplyFlowPreview() {
  return (
    <ApplyFlow
      job={job}
      currentUser={data.currentUser as unknown as CurrentUser}
      onSubmit={(submission) => console.log('Submit application:', submission)}
      onCancel={() => console.log('Cancel application')}
      onViewApplications={() => console.log('View my applications')}
      onKeepBrowsing={() => console.log('Keep browsing')}
    />
  )
}
