import data from '@/../product/sections/job-board/data.json'
import type { CurrentUser, Job } from '@/../product/sections/job-board/types'
import { ApplyFlow } from './components/ApplyFlow'

// Customer Success Intern at Paystream: no screening questions, so the Questions step is skipped.
const job = (data.jobs as unknown as Job[]).find((item) => item.id === 'job-005')!

export default function ApplyFlowNoQuestionsPreview() {
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
