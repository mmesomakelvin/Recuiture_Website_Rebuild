# Info Pages Specification

## Overview
Three public pages that explain Recruiture and let people reach the EduBridge team: For Employers, Contact and FAQ. Employers learn how hiring through EduBridge works and send a detailed hiring enquiry; anyone can send a message from the Contact page or find answers in a searchable FAQ. Every enquiry lands in the Admin Portal inbox and also emails the team.

## User Flows
- Employer reads the For Employers page: how hiring with EduBridge works in four steps, why EduBridge-trained talent helps, a note on pricing and a short set of employer questions
- Employer fills in the hiring enquiry form: company name, contact name, job title, work email and phone; number of people needed, role titles and a short description; hoped-for start date and work location (state or remote); monthly salary range in naira, company size, industry and how they heard about EduBridge
- Employer sends the form, sees field-level errors for anything missing or invalid, and on success sees a thank-you panel with a reference number and when to expect a reply
- Visitor opens the Contact page, sees email, phone, WhatsApp, the office address with a map and opening hours, and sends a message choosing a topic: My application, My account, Hiring, Partnerships or Something else
- After sending a contact message, the visitor sees a thank-you panel with a reference number and the expected reply time, and can send another message
- Visitor opens the FAQ, searches questions as they type, browses groups (Job seekers, Employers, Accounts and privacy), and opens or closes each answer
- When a search finds nothing, the visitor sees a friendly empty state with a link to the Contact page
- From the FAQ, a visitor who still needs help follows a "Still have a question?" link to the Contact page

## UI Requirements
- All three pages sit inside the public site shell, on a white background, in Poppins, with EduBridge teal and gold
- For Employers: a hero with a short promise and a "Start a hiring enquiry" button that scrolls to the form; a four-step "How it works" row; a "Why EduBridge talent" block; a pricing note that says pricing depends on the roles and is shared after a short call; three to five employer FAQs as expanding items; the enquiry form in its own card
- The hiring form is grouped into labelled parts (About you, The roles, Timing and place, Budget and extras) with required fields marked and optional ones labelled "optional"
- Number of people needed is a small number input; work location is a state picker with a Remote option; salary range has min and max naira fields; company size and industry are dropdowns; "How did you hear about us" is a dropdown
- Contact: details card on one side (email, phone, WhatsApp button, address, opening hours, map) and the form on the other; on mobile the details come first, then the form
- Contact form fields: full name, email, phone (optional), topic dropdown, message with a character counter
- Both forms validate on submit, show the error under each field, keep what was typed, and disable the button while sending
- Thank-you panels show a short reference (for example EQ-1048) and "We reply within one working day"
- FAQ: a search box at the top, group chips to jump to a group, answers that expand and collapse with keyboard support, a count of matching questions while searching, and a "Still have a question?" card linking to Contact
- Contact details in the designs are clearly sample placeholders, to be replaced with EduBridge's real details before launch
- No em dashes and no emojis anywhere in the copy
- Out of scope: live chat, booking calls in a calendar, employer accounts or self-serve job posting, and editing FAQ content from the admin portal

## Configuration
- shell: true
