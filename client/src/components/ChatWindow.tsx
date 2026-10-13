import { useEffect, useRef, useState } from 'react'
import type { FormEvent } from 'react'
import EnquiryForm from './EnquiryForm'
import { FALLBACK, WELCOME, getBotReply } from '../services/chatbot'
import type { BotReply, ChatMessage, EnquiryInput } from '../types'

const STORAGE_KEY = 'dronetv_chat_session'

interface Stored {
  messages: ChatMessage[]
  suggestions: string[]
  enquiry: { open: boolean; prefill?: Partial<EnquiryInput> }
}

const now = () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
const uid = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`

function initial(): Stored {
  // Conversation history is kept for the browser session (sessionStorage).
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as Stored
  } catch {
    /* ignore corrupted storage */
  }
  return {
    messages: [{ id: uid(), sender: 'bot', text: WELCOME.text, time: now() }],
    suggestions: WELCOME.suggestions ?? [],
    enquiry: { open: false },
  }
}

export default function ChatWindow() {
  const [state, setState] = useState<Stored>(initial)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [offer, setOffer] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    try { sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch { /* storage full or blocked */ }
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight })
  }, [state, typing])

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const send = (raw: string) => {
    const text = raw.trim().slice(0, 300)
    if (!text || typing) return
    const userMsg: ChatMessage = { id: uid(), sender: 'user', text, time: now() }
    setState((s) => ({ ...s, messages: [...s.messages, userMsg], suggestions: [] }))
    setInput('')
    setTyping(true)

    timer.current = window.setTimeout(() => {
      let reply: BotReply
      try {
        reply = getBotReply(text)
      } catch {
        reply = FALLBACK
      }
      const botMsg: ChatMessage = { id: uid(), sender: 'bot', text: reply.text, time: now() }
      setState((s) => ({
        messages: [...s.messages, botMsg],
        suggestions: reply.suggestions ?? [],
        enquiry: reply.offerEnquiry && !s.enquiry.open ? { open: false, prefill: reply.prefill } : s.enquiry,
      }))
      setOffer(!!reply.offerEnquiry)
      setTyping(false)
    }, 450)
  }

  const reset = () => {
    window.clearTimeout(timer.current)
    sessionStorage.removeItem(STORAGE_KEY)
    setTyping(false)
    setOffer(false)
    setInput('')
    setState({
      messages: [{ id: uid(), sender: 'bot', text: WELCOME.text, time: now() }],
      suggestions: WELCOME.suggestions ?? [],
      enquiry: { open: false },
    })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    send(input)
  }

  const openEnquiry = () => {
    setOffer(false)
    setState((s) => ({ ...s, enquiry: { ...s.enquiry, open: true } }))
  }

  return (
    <section className="chat" aria-label="DroneTV chat assistant">
      <div className="chat-head">
        <strong>DroneTV Assistant</strong>
        <button type="button" className="btn btn-ghost btn-small" onClick={reset}>Clear chat</button>
      </div>

      <div className="chat-body" ref={bodyRef} role="log" aria-live="polite" aria-label="Conversation">
        {state.messages.map((m) => (
          <div key={m.id} className={`msg ${m.sender}`}>
            <span className="sr-only">{m.sender === 'bot' ? 'Assistant: ' : 'You: '}</span>
            {m.text}
            <small>{m.time}</small>
          </div>
        ))}
        {typing && <div className="msg bot" aria-label="Assistant is typing">...</div>}

        {!typing && state.suggestions.length > 0 && (
          <div className="chips" aria-label="Suggested questions">
            {state.suggestions.map((q) => (
              <button key={q} type="button" className="chip" onClick={() => send(q)}>{q}</button>
            ))}
          </div>
        )}

        {!typing && !state.enquiry.open && (
          <div className="chips">
            <button type="button" className={`chip accent`} onClick={openEnquiry}>
              {offer ? 'Send an enquiry now' : 'Submit an enquiry'}
            </button>
          </div>
        )}

        {state.enquiry.open && (
          <div className="chat-enquiry">
            <strong>Send an enquiry</strong>
            <p style={{ color: 'var(--mute)', fontSize: '.9rem' }}>Fill in the details and our team will reply.</p>
            <EnquiryForm idPrefix="chat" prefill={state.enquiry.prefill} />
            <button type="button" className="btn btn-ghost btn-small" style={{ marginTop: '.8rem' }} onClick={() => setState((s) => ({ ...s, enquiry: { ...s.enquiry, open: false } }))}>
              Hide form
            </button>
          </div>
        )}
      </div>

      <form className="chat-form" onSubmit={onSubmit}>
        <label htmlFor="chat-input" className="sr-only">Type your question</label>
        <input id="chat-input" type="text" value={input} maxLength={300} placeholder="Type your question..." autoComplete="off" onChange={(e) => setInput(e.target.value)} />
        <button type="submit" className="btn btn-primary" disabled={typing || !input.trim()}>Send</button>
      </form>
    </section>
  )
}
