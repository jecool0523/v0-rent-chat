"use client"

import { useState, forwardRef, useImperativeHandle, useRef, useEffect } from "react"
import { ChevronLeft, Phone, MoreVertical } from "lucide-react"
import Message from "./Message"
import Composer from "./Composer"
import { cls } from "./utils"
import { getPersonaById } from "../lib/personas"
import { useRouter } from "next/navigation"

function ThinkingMessage({ onPause }) {
  return (
    <div className="flex items-end max-w-[85%] mb-4 animate-pulse">
      <div className="flex-shrink-0 mr-4">
        <div className="h-12 w-12 rounded-full border-2 border-black dark:border-[#ffde00] overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <div className="h-2 w-2 bg-zinc-500 rounded-full"></div>
        </div>
      </div>
      <div className="message-bubble incoming bg-white dark:bg-zinc-800 border-2 border-black dark:border-white text-black dark:text-white p-4 rounded-xl rounded-bl-none shadow-[4px_4px_0px_0px_rgba(59,130,246,1)]">
        <div className="flex items-center gap-1">
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.3s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400 [animation-delay:-0.15s]"></div>
          <div className="h-2 w-2 animate-bounce rounded-full bg-zinc-400"></div>
        </div>
      </div>
    </div>
  )
}

const ChatPane = forwardRef(function ChatPane(
  { conversation, onSend, onEditMessage, onResendMessage, isThinking, onPauseThinking, currentPersonaId },
  ref,
) {
  const [editingId, setEditingId] = useState(null)
  const [draft, setDraft] = useState("")
  const [busy, setBusy] = useState(false)
  const composerRef = useRef(null)
  const scrollRef = useRef(null)
  const router = useRouter()

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        composerRef.current?.insertTemplate(templateContent)
      },
    }),
    [],
  )

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [conversation?.messages, isThinking])

  if (!conversation) return null

  const persona = getPersonaById(currentPersonaId || "default")

  const messages = Array.isArray(conversation.messages) ? conversation.messages : []
  const count = messages.length || conversation.messageCount || 0

  function startEdit(m) {
    setEditingId(m.id)
    setDraft(m.content)
  }
  function cancelEdit() {
    setEditingId(null)
    setDraft("")
  }
  function saveEdit() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    cancelEdit()
  }
  function saveAndResend() {
    if (!editingId) return
    onEditMessage?.(editingId, draft)
    onResendMessage?.(editingId)
    cancelEdit()
  }

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col relative overflow-hidden bg-background">
      <div className="absolute inset-0 background-graphic transition-opacity duration-300 pointer-events-none"></div>

      {/* Header */}
      <header className="relative flex-shrink-0 bg-[#f0f0f0]/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm border-b-2 border-black dark:border-white/20 p-4 flex items-center justify-between z-10 h-[72px]">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.push("/characters")}
            className="text-black dark:text-white hover:opacity-70 transition-opacity"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-10 w-10 rounded-full border-2 border-black dark:border-[#ffde00] overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center">
                {persona.image ? (
                  <img
                    src={persona.image || "/placeholder.svg"}
                    alt={persona.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-lg">{persona.icon}</div>
                )}
              </div>
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 border-2 border-black"></span>
            </div>
            <div>
              <h1
                style={{ fontFamily: "var(--font-anton)" }}
                className="text-xl tracking-wide text-black dark:text-white uppercase font-bold leading-none"
              >
                {persona.name}
              </h1>
              <p className="text-xs text-green-600 dark:text-green-400 font-bold mt-0.5">Online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-4 text-black dark:text-white">
          <button className="hover:text-primary transition-colors">
            <Phone className="h-5 w-5" />
          </button>
          <button className="hover:text-primary transition-colors">
            <MoreVertical className="h-5 w-5" />
          </button>
        </div>
      </header>

      {/* Message List */}
      <div ref={scrollRef} className="flex-1 flex flex-col space-y-6 overflow-y-auto p-4 relative z-0">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full opacity-50">
            <div className="p-6 rounded-xl border-2 border-dashed border-zinc-400 dark:border-zinc-600 text-center max-w-xs">
              <p style={{ fontFamily: "var(--font-anton)" }} className="text-xl mb-2 text-black dark:text-white">
                NO MESSAGES
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Start the conversation with {persona.name}</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <div key={m.id} className="w-full">
                {editingId === m.id ? (
                  <div
                    className={cls(
                      "rounded-xl border-2 p-3 bg-white dark:bg-zinc-900 shadow-lg mb-4",
                      "border-black dark:border-[#ffde00]",
                    )}
                  >
                    <textarea
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className="w-full resize-y rounded-lg bg-transparent p-2 text-sm outline-none font-sans"
                      rows={3}
                    />
                    <div className="mt-3 flex flex-wrap items-center gap-2 justify-end">
                      <button
                        onClick={cancelEdit}
                        className="inline-flex items-center gap-1 rounded-full px-4 py-1.5 text-xs font-bold border-2 border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={saveEdit}
                        className="inline-flex items-center gap-1 rounded-full bg-black px-4 py-1.5 text-xs font-bold text-white border-2 border-black hover:bg-zinc-800 dark:bg-[#ffde00] dark:text-black dark:border-[#ffde00] dark:hover:bg-[#e6c800] transition-colors uppercase"
                      >
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <Message role={m.role} personaId={m.role === "assistant" ? m.personaId || currentPersonaId : null}>
                    <div className="whitespace-pre-wrap break-words">{m.content}</div>
                    {m.role === "user" && (
                      <div className="mt-1 flex gap-3 text-[10px] text-zinc-500 dark:text-zinc-400 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="hover:text-black dark:hover:text-white uppercase font-bold"
                          onClick={() => startEdit(m)}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </Message>
                )}
              </div>
            ))}
            {isThinking && <ThinkingMessage onPause={onPauseThinking} />}
          </>
        )}
      </div>

      <Composer
        ref={composerRef}
        onSend={async (text) => {
          if (!text.trim()) return
          setBusy(true)
          await onSend?.(text)
          setBusy(false)
        }}
        busy={busy}
      />
    </div>
  )
})

export default ChatPane
