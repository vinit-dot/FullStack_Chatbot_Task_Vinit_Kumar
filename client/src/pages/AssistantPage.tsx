import ChatWindow from '../components/ChatWindow'

export default function AssistantPage() {
  return (
    <div className="container section">
      <h1 style={{ fontSize: 'clamp(2.4rem, 5vw, 3.6rem)' }}>Chat assistant</h1>
      <div className="assistant-layout">
        <ChatWindow />
        <aside className="card side-note">
          <h3>What you can ask</h3>
          <ul>
            <li>Services and courses</li>
            <li>How to contact and register</li>
            <li>Talk to a person</li>
          </ul>
          <p>
            This is a rule-based assistant with ready-made answers. It does not use an external AI service, and its
            answers are sample content for this demo.
          </p>
        </aside>
      </div>
    </div>
  )
}
