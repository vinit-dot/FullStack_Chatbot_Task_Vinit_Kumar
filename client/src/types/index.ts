export type UserType = 'Student' | 'Customer' | 'Other'
export type EnquiryStatus = 'New' | 'Contacted' | 'In Progress' | 'Closed'

export const USER_TYPES: UserType[] = ['Student', 'Customer', 'Other']
export const STATUSES: EnquiryStatus[] = ['New', 'Contacted', 'In Progress', 'Closed']

export interface EnquiryInput {
  name: string
  email: string
  phone: string
  userType: UserType | ''
  interest: string
  message: string
}

export interface Enquiry {
  _id: string
  name: string
  email: string
  phone: string
  userType: UserType
  interest: string
  message: string
  status: EnquiryStatus
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface EnquiryListResponse {
  success: boolean
  data: Enquiry[]
  pagination: Pagination
}

export interface ChatMessage {
  id: string
  sender: 'user' | 'bot'
  text: string
  time: string
}

export interface BotReply {
  text: string
  // extra buttons shown under the reply
  suggestions?: string[]
  // when set, the chat shows an "Submit an enquiry" button
  offerEnquiry?: boolean
  prefill?: Partial<EnquiryInput>
}

export interface ServiceItem {
  id: string
  title: string
  summary: string
  icon: 'camera' | 'map' | 'leaf' | 'inspect' | 'event' | 'cap'
}

export interface CourseItem {
  id: string
  title: string
  level: string
  duration: string
  summary: string
  topics: string[]
}
