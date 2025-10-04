import { useEffect, useMemo, useState } from 'react'
import { marked } from 'marked'
import './App.css'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
}

const STORAGE_KEY = 'mf_chat_conversations_v1'

function makeId() {
  return Math.random().toString(36).slice(2, 9)
}

function stripHeadings(markdown: string) {
  // Remove markdown headings (##, ###, etc.)
  return markdown.replace(/^#+\s.*$/gm, '').trim();
}

function App() {
  const [conversations, setConversations] = useState<Conversation[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })

  const [activeId, setActiveId] = useState<string | null>(() => {
    return conversations[0]?.id ?? null
  })
  const active = useMemo(() => conversations.find(c => c.id === activeId) ?? null, [conversations, activeId])

  const [input, setInput] = useState('')

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations))
    } catch {
      // ignore
    }
  }, [conversations])

  useEffect(() => {
    if (!active && conversations.length) setActiveId(conversations[0].id)
  }, [conversations, active])

  const createConversation = () => {
    const id = makeId()
    const conv: Conversation = { id, title: 'New conversation', messages: [] }
    setConversations(prev => [conv, ...prev])
    setActiveId(id)
  }

  const deleteConversation = (id: string) => {
    setConversations(prev => prev.filter(c => c.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const updateActive = (updater: (m: Message[]) => Message[]) => {
    if (!active) return
    setConversations(prev => prev.map(c => c.id === active.id ? { ...c, messages: updater(c.messages) } : c))
  }

  const sendMessage = async () => {
    if (!input.trim() || !active) return

    const userMessage: Message = { role: 'user', content: input }
    updateActive(prev => [...prev, userMessage])
    const currentInput = input
    setInput('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      })
      const data = await response.json()
      const assistantMessage: Message = { role: 'assistant', content: data.message }
      updateActive(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = { role: 'assistant', content: 'Sorry, there was an error processing your message.' }
      updateActive(prev => [...prev, errorMessage])
    }
  }


  return (
    <div className="app-root">
      <aside className="sidebar">
        <div className="sidebar-top">
          <h2>Conversations</h2>
          <button className="new-btn" onClick={createConversation}>New</button>
        </div>
        <div className="conversations-list">
          {conversations.length === 0 && (
            <div className="empty-list">No conversations yet — create one.</div>
          )}
          {conversations.map(conv => (
            <div
              key={conv.id}
              className={`conv-item ${conv.id === activeId ? 'active' : ''}`}
              onClick={() => setActiveId(conv.id)}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0' }}
            >
              <div className="conv-title" style={{ flex: 1 }}>{conv.title || 'Conversation'}</div>
              <div className="conv-meta" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge">{conv.messages.length}</span>
                <button className="del" onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id) }} aria-label="Delete">×</button>
              </div>
            </div>
          ))}
        </div>
      </aside>

      <div className="main-area">
        <main className="chat-panel">
          {!active ? (
            <div className="no-active">Select or create a conversation to start chatting.</div>
          ) : (
            <>
              <div className="chat-messages">
                {active.messages.map((msg, index) => {
                  const cleaned = stripHeadings(msg.content);
                  const html = marked.parse(cleaned);
                  return (
                    <div key={index} className={`message ${msg.role}`}>
                      <div className="message-content" dangerouslySetInnerHTML={{ __html: html }} />
                    </div>
                  );
                })}
              </div>

              <div className="chat-input">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder="Type your message..."
                />
                <button onClick={sendMessage}>Send</button>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
