import { useState } from 'react'
import type { InfoPage, InfoPagesProps } from '@/../product/sections/info-pages/types'
import { ContactPage } from './ContactPage'
import { FaqPage } from './FaqPage'
import { ForEmployersPage } from './ForEmployersPage'
import { INFO_STYLES } from './styles'

/**
 * The three public info pages. Shows the page named by `page`, and follows
 * links between them (for example FAQ to Contact) while reporting each move
 * through onNavigate for the host app to route.
 */
export function InfoPages({
  contactDetails,
  forEmployers,
  faqGroups,
  faqs,
  formOptions,
  page = 'for-employers',
  onSubmitHiringEnquiry,
  onSubmitContactMessage,
  onOpenWhatsApp,
  onNavigate,
}: InfoPagesProps) {
  const [current, setCurrent] = useState<InfoPage>(page)
  const [lastPage, setLastPage] = useState<InfoPage>(page)

  // Follow the page prop when the host changes it
  if (page !== lastPage) {
    setLastPage(page)
    setCurrent(page)
  }

  const navigate = (next: InfoPage) => {
    setCurrent(next)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    onNavigate?.(next)
  }

  return (
    <div className="min-h-full bg-white">
      <style>{INFO_STYLES}</style>
      {current === 'for-employers' && (
        <ForEmployersPage content={forEmployers} faqs={faqs} contactDetails={contactDetails} formOptions={formOptions} onSubmitHiringEnquiry={onSubmitHiringEnquiry} />
      )}
      {current === 'contact' && (
        <ContactPage contactDetails={contactDetails} formOptions={formOptions} onSubmit={onSubmitContactMessage} onOpenWhatsApp={onOpenWhatsApp} />
      )}
      {current === 'faq' && <FaqPage groups={faqGroups} faqs={faqs} onNavigate={navigate} />}
    </div>
  )
}
