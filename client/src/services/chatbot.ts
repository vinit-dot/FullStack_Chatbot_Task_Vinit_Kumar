import type { BotReply } from '../types'
import { COURSES, SERVICES } from '../data/content'

// The 7 questions required by the assignment (shown as suggestion buttons).
export const SUGGESTED_QUESTIONS = [
  'What services does DroneTV provide?',
  'What courses or training are available?',
  'How can I contact DroneTV?',
  'How can I register?',
  'I am interested in a service.',
  'I am a student.',
  'I want to speak with someone.',
]

interface Intent {
  name: string
  keywords: string[]
  reply: () => BotReply
}

const serviceList = SERVICES.map((s) => `• ${s.title}`).join('\n')
const courseList = COURSES.map((c) => `• ${c.title} (${c.level})`).join('\n')

// Rule-based chatbot: each intent has keywords. The intent with most keyword matches wins.
const INTENTS: Intent[] = [
  {
    name: 'greeting',
    keywords: ['hi', 'hello', 'hey', 'namaste'],
    reply: () => ({
      text: 'Hello! I am the DroneTV assistant for this demo. Ask me about services, courses or how to get in touch.',
      suggestions: SUGGESTED_QUESTIONS.slice(0, 3),
    }),
  },
  {
    name: 'services',
    keywords: ['service', 'services', 'provide', 'offer', 'do you do', 'work'],
    reply: () => ({
      text: `Here are the sample services shown in this demo:\n${serviceList}\n\n(Sample content, not official. See dronetv.in for real details.)`,
      suggestions: ['I am interested in a service.', 'How can I contact DroneTV?'],
    }),
  },
  {
    name: 'courses',
    keywords: ['course', 'courses', 'training', 'learn', 'class', 'program', 'programme', 'syllabus'],
    reply: () => ({
      text: `These sample courses are listed in this demo:\n${courseList}\n\n(Sample content, not official.)`,
      suggestions: ['How can I register?', 'I am a student.'],
    }),
  },
  {
    name: 'contact',
    keywords: ['contact', 'phone', 'call', 'email', 'address', 'reach', 'location', 'whatsapp'],
    reply: () => ({
      text: 'The easiest way is to leave an enquiry here. Our team can follow up with you. For official phone numbers, email and address, please visit dronetv.in.',
      offerEnquiry: true,
      suggestions: ['I want to speak with someone.'],
    }),
  },
  {
    name: 'register',
    keywords: ['register', 'registration', 'enroll', 'enrol', 'admission', 'join', 'sign up', 'signup', 'apply'],
    reply: () => ({
      text: 'To register your interest, submit the short enquiry form: choose the course you want and share your contact details. The team will get back to you with the next steps.',
      offerEnquiry: true,
      prefill: { userType: 'Student' },
    }),
  },
  {
    name: 'interested',
    keywords: ['interested', 'interest', 'quote', 'price', 'pricing', 'cost', 'hire', 'book', 'booking', 'need a drone'],
    reply: () => ({
      text: 'Great! Tell me which service you need and I will pass your details on. You can pick one below or send an enquiry directly.',
      suggestions: SERVICES.slice(0, 4).map((s) => `Tell me about ${s.title.toLowerCase()}`),
      offerEnquiry: true,
      prefill: { userType: 'Customer' },
    }),
  },
  {
    name: 'student',
    keywords: ['student', 'college', 'school', 'beginner', 'career', 'pilot'],
    reply: () => ({
      text: `Welcome, student! The sample beginner-friendly courses are:\n${courseList}\n\nWant to be contacted about a course? Send an enquiry and the team will reply.`,
      offerEnquiry: true,
      prefill: { userType: 'Student' },
      suggestions: ['How can I register?'],
    }),
  },
  {
    name: 'human',
    keywords: ['speak', 'talk', 'human', 'person', 'someone', 'agent', 'representative', 'callback', 'call back'],
    reply: () => ({
      text: 'Sure, I will connect you with the team. Please share your details in the form below and someone will contact you.',
      offerEnquiry: true,
    }),
  },
  {
    name: 'thanks',
    keywords: ['thanks', 'thank', 'thank you', 'bye', 'goodbye'],
    reply: () => ({ text: 'You are welcome! If you need anything else, just ask.', suggestions: SUGGESTED_QUESTIONS.slice(0, 2) }),
  },
]

// Specific service/course names typed or clicked by the user.
function matchTopic(text: string): BotReply | null {
  const t = text.toLowerCase()
  const service = SERVICES.find((s) => t.includes(s.title.toLowerCase()))
  if (service) {
    return {
      text: `${service.title}: ${service.summary}\n\nWould you like the team to contact you about this?`,
      offerEnquiry: true,
      prefill: { interest: `Service: ${service.title}`, userType: 'Customer' },
    }
  }
  const course = COURSES.find((c) => t.includes(c.title.toLowerCase()))
  if (course) {
    return {
      text: `${course.title} (${course.level}, ${course.duration}). ${course.summary}\nTopics: ${course.topics.join(', ')}.`,
      offerEnquiry: true,
      prefill: { interest: `Course: ${course.title}`, userType: 'Student' },
    }
  }
  return null
}

export const FALLBACK: BotReply = {
  text: "Sorry, I did not understand that. I can help with services, courses, contact details and registration. You can also send an enquiry and a person will reply.",
  suggestions: SUGGESTED_QUESTIONS.slice(0, 4),
  offerEnquiry: true,
}

export const WELCOME: BotReply = {
  text: 'Hi! I am the DroneTV assistant (demo). Pick a question below or type your own.',
  suggestions: SUGGESTED_QUESTIONS,
}

export function getBotReply(input: string): BotReply {
  const text = input.trim().toLowerCase()
  if (!text) return FALLBACK

  const topic = matchTopic(text)
  if (topic) return topic

  // exact suggested-question match first
  const idx = SUGGESTED_QUESTIONS.findIndex((q) => q.toLowerCase() === text)
  const order = ['services', 'courses', 'contact', 'register', 'interested', 'student', 'human']
  if (idx >= 0) return INTENTS.find((i) => i.name === order[idx])!.reply()

  const words = text.replace(/[^a-z0-9\s]/g, ' ')
  let best: Intent | null = null
  let bestScore = 0
  for (const intent of INTENTS) {
    const score = intent.keywords.reduce((sum, k) => {
      const hit = k.includes(' ') ? words.includes(k) : new RegExp(`\\b${k}\\b`).test(words)
      return sum + (hit ? 1 : 0)
    }, 0)
    if (score > bestScore) {
      best = intent
      bestScore = score
    }
  }
  return best ? best.reply() : FALLBACK
}
