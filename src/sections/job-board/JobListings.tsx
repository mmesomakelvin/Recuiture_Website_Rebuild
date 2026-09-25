import data from '@/../product/sections/job-board/data.json'
import type { CurrentUser, FilterOptions, Job } from '@/../product/sections/job-board/types'
import { JobBoard } from './components/JobBoard'

export default function JobListingsPreview() {
  return (
    <JobBoard
      jobs={data.jobs as unknown as Job[]}
      currentUser={data.currentUser as unknown as CurrentUser}
      filterOptions={data.filterOptions as unknown as FilterOptions}
      onSearch={(keyword, location) => console.log('Search:', { keyword, location })}
      onSearchStateChange={(state) => console.log('Search state:', state)}
      onClearFilters={() => console.log('Clear filters')}
      onSelectJob={(id) => console.log('Select job:', id)}
      onSaveJob={(id) => console.log('Save job:', id)}
      onUnsaveJob={(id) => console.log('Unsave job:', id)}
      onShareJob={(id, channel) => console.log('Share job:', id, channel)}
      onApply={(id) => console.log('Apply to job:', id)}
      onSignIn={() => console.log('Sign in')}
      onCreateAccount={() => console.log('Create account')}
    />
  )
}
