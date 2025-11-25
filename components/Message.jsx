import { PERSONAS } from "../lib/personas"

export default function Message({ role, children, personaId }) {
  const isUser = role === "user"
  const persona = PERSONAS.find((p) => p.id === personaId) || PERSONAS[0]

  // Format time (just mocking current time for UI purposes as real msg time logic is complex)
  // In a real app, we'd pass the message timestamp
  const time = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  if (isUser) {
    return (
      <div className="flex items-end justify-end mb-full group w-full">
        <div className="max-w-full">
          <div className="message-bubble outgoing bg-[#ffde00] border-2 border-black text-black rounded-3xl rounded-br-none shadow-[6px_6px_0px_0px_rgba(255,105,180,0.4)] relative overflow-hidden max-w-[85%] ml-auto">
            <div className="p-5 space-y-2">
              <div className="text-base font-bold leading-relaxed break-words">{children}</div>
              <div className="flex justify-end">
                <span className="text-[11px] text-black/60 font-semibold">{time}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-end max-w-[90%] mb-4 group w-full">
      <div className="flex-shrink-0 mr-4 relative">
        <div className="h-12 w-12 rounded-full border-2 border-black dark:border-[#ffde00] overflow-hidden bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] dark:shadow-[2px_2px_0px_0px_rgba(255,255,0,0.5)]">
          {persona.image ? (
            <img src={persona.image || "/placeholder.svg"} alt={persona.name} className="h-full w-full object-cover" />
          ) : (
            <div className="text-lg">{persona.icon}</div>
          )}
        </div>
      </div>
      <div className="message-bubble incoming bg-white dark:bg-zinc-800 border-2 border-black dark:border-white text-black dark:text-white p-4 rounded-xl rounded-bl-none shadow-[4px_4px_0px_0px_rgba(59,130,246,1)] relative">
        <div className="text-base font-medium leading-relaxed">{children}</div>
        <span className="text-[10px] text-zinc-400 dark:text-zinc-500 float-right mt-1 ml-2 font-bold opacity-70">
          {time}
        </span>
      </div>
    </div>
  )
}
