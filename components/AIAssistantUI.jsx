"use client"

import React, { useEffect, useMemo, useRef, useState } from "react"
import Sidebar from "./Sidebar"
import ChatPane from "./ChatPane"
import { INITIAL_CONVERSATIONS, INITIAL_TEMPLATES, INITIAL_FOLDERS } from "./mockData"
import { getPersonaById } from "../lib/personas"

export default function AIAssistantUI({ initialPersonaId, onBack }) {
  const [theme, setTheme] = useState("light")
  const [user, setUser] = useState(null)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  useEffect(() => {
    const savedConversations = localStorage.getItem("conversations")
    if (savedConversations) {
      try {
        setConversations(JSON.parse(savedConversations))
      } catch (e) {
        console.error("Failed to load conversations:", e)
        setConversations(INITIAL_CONVERSATIONS)
      }
    }
  }, [])

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme) {
      setTheme(savedTheme)
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark")
    }

    const rawCollapsed = localStorage.getItem("sidebar-collapsed")
    if (rawCollapsed) {
      setCollapsed(JSON.parse(rawCollapsed))
    }

    const savedSidebarState = localStorage.getItem("sidebar-collapsed-state")
    if (savedSidebarState) {
      setSidebarCollapsed(JSON.parse(savedSidebarState))
    }

    const savedPersona = localStorage.getItem("selected-persona")
    if (savedPersona) {
      setSelectedPersonaId(savedPersona)
    }

    const media = window.matchMedia("(prefers-color-scheme: dark)")
    const listener = (e) => {
      if (!localStorage.getItem("theme")) {
        setTheme(e.matches ? "dark" : "light")
      }
    }
    media.addEventListener("change", listener)
    return () => media.removeEventListener("change", listener)
  }, [])

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark")
    else document.documentElement.classList.remove("dark")
    document.documentElement.setAttribute("data-theme", theme)
    document.documentElement.style.colorScheme = theme
    localStorage.setItem("theme", theme)
  }, [theme])

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState({
    pinned: true,
    recent: false,
    folders: true,
    templates: true,
  })
  useEffect(() => {
    localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed))
  }, [collapsed])

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  useEffect(() => {
    localStorage.setItem("sidebar-collapsed-state", JSON.stringify(sidebarCollapsed))
  }, [sidebarCollapsed])

  const [selectedPersonaId, setSelectedPersonaId] = useState(initialPersonaId || "default")

  useEffect(() => {
    if (initialPersonaId) {
      setSelectedPersonaId(initialPersonaId)
    }
  }, [initialPersonaId])

  useEffect(() => {
    localStorage.setItem("selected-persona", selectedPersonaId)
  }, [selectedPersonaId])

  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS)
  const [selectedId, setSelectedId] = useState(null)
  const [templates, setTemplates] = useState(INITIAL_TEMPLATES)
  const [folders, setFolders] = useState(INITIAL_FOLDERS)

  useEffect(() => {
    localStorage.setItem("conversations", JSON.stringify(conversations))
  }, [conversations])

  useEffect(() => {
    localStorage.setItem("folders", JSON.stringify(folders))
  }, [folders])

  const [query, setQuery] = useState("")
  const searchRef = useRef(null)

  const [isThinking, setIsThinking] = useState(false)
  const [thinkingConvId, setThinkingConvId] = useState(null)

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "n") {
        e.preventDefault()
        createNewChat()
      }
      if (!e.metaKey && !e.ctrlKey && e.key === "/") {
        const tag = document.activeElement?.tagName?.toLowerCase()
        if (tag !== "input" && tag !== "textarea") {
          e.preventDefault()
          searchRef.current?.focus()
        }
      }
      if (e.key === "Escape" && sidebarOpen) setSidebarOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [sidebarOpen, conversations])

  useEffect(() => {
    if (!selectedId && conversations.length > 0) {
      createNewChat()
    }
  }, [])

  const filtered = useMemo(() => {
    if (!query.trim()) return conversations
    const q = query.toLowerCase()
    return conversations.filter((c) => c.title.toLowerCase().includes(q) || c.preview.toLowerCase().includes(q))
  }, [conversations, query])

  const pinned = filtered.filter((c) => c.pinned).sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))

  const recent = filtered
    .filter((c) => !c.pinned)
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))
    .slice(0, 10)
    .map((c) => {
      const persona = getPersonaById(c.personaId || selectedPersonaId)
      return {
        ...c,
        personaName: persona.name,
      }
    })

  const folderCounts = React.useMemo(() => {
    const map = Object.fromEntries(folders.map((f) => [f.name, 0]))
    for (const c of conversations) if (map[c.folder] != null) map[c.folder] += 1
    return map
  }, [conversations, folders])

  function togglePin(id) {
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c)))
  }

  function createFolder(folderName) {
    const id = Math.random().toString(36).slice(2)
    const newFolder = { id, name: folderName }
    setFolders((prev) => [...prev, newFolder])
  }

  function createNewChat() {
    const id = Math.random().toString(36).slice(2)
    const item = {
      id,
      title: "New Chat",
      updatedAt: new Date().toISOString(),
      messageCount: 0,
      preview: "Say hello to start...",
      pinned: false,
      folder: "Work Projects",
      messages: [],
      personaId: selectedPersonaId,
    }
    setConversations((prev) => [item, ...prev])
    setSelectedId(id)
    setSidebarOpen(false)
  }

  function sendMessage(convId, content) {
    if (!content.trim()) return
    const now = new Date().toISOString()
    const userMsg = { id: Math.random().toString(36).slice(2), role: "user", content, createdAt: now }

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = [...(c.messages || []), userMsg]
        const updated = {
          ...c,
          messages: msgs,
          updatedAt: now,
          messageCount: msgs.length,
          preview: content.slice(0, 80),
        }

        return updated
      }),
    )

    setIsThinking(true)
    setThinkingConvId(convId)

    const currentConvId = convId
    const conv = conversations.find((c) => c.id === convId)
    const personaId = conv?.personaId || selectedPersonaId
    const persona = getPersonaById(personaId)

    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [...(conv?.messages || []), userMsg].map((m) => ({
          role: m.role,
          content: m.content,
        })),
        personaId: persona.id,
      }),
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Failed to get AI response")

        const reader = response.body?.getReader()
        const decoder = new TextDecoder()
        let accumulatedContent = ""
        const assistantMsgId = Math.random().toString(36).slice(2)

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c
            const asstMsg = {
              id: assistantMsgId,
              role: "assistant",
              content: "",
              createdAt: new Date().toISOString(),
              personaId: persona.id,
            }
            const msgs = [...(c.messages || []), asstMsg]
            return {
              ...c,
              messages: msgs,
              updatedAt: new Date().toISOString(),
              messageCount: msgs.length,
            }
          }),
        )

        while (reader) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split("\n")

          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const content = JSON.parse(line.slice(2))
                accumulatedContent += content

                setConversations((prev) =>
                  prev.map((c) => {
                    if (c.id !== currentConvId) return c
                    const msgs = (c.messages || []).map((m) =>
                      m.id === assistantMsgId ? { ...m, content: accumulatedContent } : m,
                    )
                    const updated = {
                      ...c,
                      messages: msgs,
                      preview: accumulatedContent.slice(0, 80),
                    }

                    return updated
                  }),
                )
              } catch (e) {
                console.error("Failed to parse stream chunk:", e)
              }
            }
          }
        }

        setIsThinking(false)
        setThinkingConvId(null)
      })
      .catch((error) => {
        console.error("Error generating AI response:", error)
        setIsThinking(false)
        setThinkingConvId(null)

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== currentConvId) return c
            const errorMsg = {
              id: Math.random().toString(36).slice(2),
              role: "assistant",
              content: "죄송합니다. 응답을 생성하는 중 오류가 발생했습니다. 다시 시도해 주세요.",
              createdAt: new Date().toISOString(),
              personaId: persona.id,
            }
            const msgs = [...(c.messages || []), errorMsg]
            return {
              ...c,
              messages: msgs,
              updatedAt: new Date().toISOString(),
              messageCount: msgs.length,
            }
          }),
        )
      })
  }

  function handlePersonaChange(newPersonaId) {
    setSelectedPersonaId(newPersonaId)
    if (selectedId) {
      setConversations((prev) => prev.map((c) => (c.id === selectedId ? { ...c, personaId: newPersonaId } : c)))
    }
  }

  function editMessage(convId, messageId, newContent) {
    const now = new Date().toISOString()
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== convId) return c
        const msgs = (c.messages || []).map((m) =>
          m.id === messageId ? { ...m, content: newContent, editedAt: now } : m,
        )
        return {
          ...c,
          messages: msgs,
          preview: msgs[msgs.length - 1]?.content?.slice(0, 80) || c.preview,
        }
      }),
    )
  }

  function resendMessage(convId, messageId) {
    const conv = conversations.find((c) => c.id === convId)
    const msg = conv?.messages?.find((m) => m.id === messageId)
    if (!msg) return
    sendMessage(convId, msg.content)
  }

  function pauseThinking() {
    setIsThinking(false)
    setThinkingConvId(null)
  }

  function handleUseTemplate(template) {
    if (composerRef.current) {
      composerRef.current.insertTemplate(template.content)
    }
  }

  const composerRef = useRef(null)

  const selected = conversations.find((c) => c.id === selectedId) || null

  return (
    <div className="h-screen w-full bg-background text-foreground overflow-hidden flex flex-col">
      <div className="mx-auto flex h-full w-full max-w-[1400px] relative">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          theme={theme}
          setTheme={setTheme}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          sidebarCollapsed={sidebarCollapsed}
          setSidebarCollapsed={setSidebarCollapsed}
          conversations={conversations}
          pinned={pinned}
          recent={recent}
          folders={folders}
          folderCounts={folderCounts}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id)
            if (window.innerWidth < 768) {
              setSidebarOpen(false)
            }
          }}
          togglePin={togglePin}
          query={query}
          setQuery={setQuery}
          searchRef={searchRef}
          createFolder={createFolder}
          createNewChat={createNewChat}
          templates={templates}
          setTemplates={setTemplates}
          onUseTemplate={handleUseTemplate}
          selectedPersonaId={selectedPersonaId}
          onPersonaChange={handlePersonaChange}
        />

        <main className="relative flex min-w-0 flex-1 flex-col h-full">
          <ChatPane
            ref={composerRef}
            conversation={selected}
            onSend={(content) => selected && sendMessage(selected.id, content)}
            onEditMessage={(messageId, newContent) => selected && editMessage(selected.id, messageId, newContent)}
            onResendMessage={(messageId) => selected && resendMessage(selected.id, messageId)}
            isThinking={isThinking && thinkingConvId === selected?.id}
            onPauseThinking={pauseThinking}
            currentPersonaId={selected?.personaId || selectedPersonaId}
          />
        </main>
      </div>
    </div>
  )
}
