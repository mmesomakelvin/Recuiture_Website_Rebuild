import data from '@/../product/sections/job-board/data.json'
import type { FilterOptions, Job } from '@/../product/sections/job-board/types'
import { JobBoard } from './components/JobBoard'

export default function JobListingsGuestPreview() {
  return (
    <JobBoard
      jobs={data.jobs as unknown as Job[]}
      currentUser={null}
      filterOptions={data.filterOptions as unknown as FilterOptions}
      onSearch={(keyword, location) => console.log('Search:', { keyword, location })}
      onSearchStateChange={(state) => console.log('Search state:', state)}
      onClearFilters={() => console.log('Clear filters')}
      onSelectJob={(id) => console.log('Select job:', id)}
      onShareJob={(id, channel) => console.log('Share job:', id, channel)}
      onSignIn={() => console.log('Sign in')}
      onCreateAccount={() => console.log('Create account')}
    />
  )
}
