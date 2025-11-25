"use client"
import { Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import AIAssistantUI from "../../components/AIAssistantUI"

function ChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const personaId = searchParams.get("persona")

  return <AIAssistantUI initialPersonaId={personaId} onBack={() => router.push("/characters")} />
}

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
          <div className="animate-pulse">Loading chat...</div>
        </div>
      }
    >
      <ChatContent />
    </Suspense>
  )
}
