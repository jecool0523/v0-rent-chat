"use client"
import { MessageSquare, User, Home, Users } from "lucide-react"
import { PERSONAS } from "../lib/personas"

const CHARACTER_IMAGES = {
  mark_cohen_rent: "/images/mark.png",
  mimi_marquez_rent: "/images/mimi.png",
  maureen_johnson_rent: "/images/maureen.png",
  angel_schunard_rent: "/images/angel.png",
  joanne_jefferson_rent: "/images/joanne.png",
  roger_davis_rent: "/images/roger.png",
  tom_collins_rent: "/images/collins.png",
  benny_coffin_iii_rent: "/images/benny.png",
}

export default function IntroPage({ onStartChat }) {
  // Filter to show only specific characters if needed, or all.
  // The design shows Mark and Mimi. We'll show all from PERSONAS that match the "Rent" theme.
  const characters = PERSONAS.filter((p) => p.source === "뮤지컬 렌트")

  return (
    <div className="flex flex-col h-screen bg-zinc-950 text-white overflow-hidden font-sans relative">
      {/* Background Image */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url('/images/background.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "brightness(0.6)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-center py-4 animate-in slide-in-from-top-4 fade-in duration-700">
        <img src="/images/logo.png" alt="RENT CHAT" className="h-20 object-contain drop-shadow-2xl" />
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 overflow-y-auto px-4 pb-24 space-y-6 scrollbar-hide mx-5">
        <div className="text-center mb-2 animate-in zoom-in-95 fade-in duration-700 delay-100">
          <h2 className="text-2xl font-black uppercase tracking-tighter text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)] italic transform -rotate-2">
            The Chat Experience
          </h2>
        </div>

        <div className="flex flex-col gap-8 max-w-sm mx-auto">
          {characters.map((char, index) => (
            <div
              key={char.id}
              className="relative group perspective-1000 animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-backwards"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div
                className="relative transform transition-transform duration-300 hover:scale-[1.02] hover:rotate-0"
                style={{
                  transform: `rotate(${index % 2 === 0 ? "-1deg" : "1deg"})`,
                  filter: "drop-shadow(0 10px 8px rgba(0,0,0,0.5))", // Better drop shadow for irregular shape
                }}
              >
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-8 bg-white/20 backdrop-blur-sm rotate-1 z-20 shadow-sm border border-white/10"
                  style={{ clipPath: "polygon(0% 5%, 5% 0%, 95% 0%, 100% 5%, 100% 95%, 95% 100%, 5% 100%, 0% 95%)" }}
                ></div>

                {/* Rough White Torn Edge Border with Texture */}
                <div
                  className="absolute -inset-1.5 bg-[#f0f0f0]"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 5% 1%, 10% 0%, 15% 2%, 20% 0%, 25% 1%, 30% 0%, 35% 2%, 40% 0%, 45% 1%, 50% 0%, 55% 2%, 60% 0%, 65% 1%, 70% 0%, 75% 2%, 80% 0%, 85% 1%, 90% 0%, 95% 2%, 100% 0%, 100% 100%, 95% 99%, 90% 100%, 85% 98%, 80% 100%, 75% 99%, 70% 100%, 65% 98%, 60% 100%, 55% 99%, 50% 100%, 45% 98%, 40% 100%, 35% 99%, 30% 100%, 25% 98%, 20% 100%, 15% 99%, 10% 100%, 5% 98%, 0% 100%)",
                    zIndex: -1,
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.15'/%3E%3C/svg%3E\")",
                  }}
                />

                <div
                  className="absolute -inset-1 bg-zinc-800"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 5% 1%, 10% 0%, 15% 2%, 20% 0%, 25% 1%, 30% 0%, 35% 2%, 40% 0%, 45% 1%, 50% 0%, 55% 2%, 60% 0%, 65% 1%, 70% 0%, 75% 2%, 80% 0%, 85% 1%, 90% 0%, 95% 2%, 100% 0%, 100% 100%, 95% 99%, 90% 100%, 85% 98%, 80% 100%, 75% 99%, 70% 100%, 65% 98%, 60% 100%, 55% 99%, 50% 100%, 45% 98%, 40% 100%, 35% 99%, 30% 100%, 25% 98%, 20% 100%, 15% 99%, 10% 100%, 5% 98%, 0% 100%)",
                    zIndex: -1,
                    transform: "scale(0.99)",
                  }}
                />

                {/* Card Content */}
                <div className="relative bg-zinc-900 overflow-hidden">
                  <div className="h-62 w-full bg-zinc-800 relative overflow-hidden group-hover:brightness-110 transition-all">
                    <img
                      src={CHARACTER_IMAGES[char.id] || "/placeholder.svg"}
                      alt={char.name}
                      className="w-full h-full object-cover object-top transform group-hover:scale-105 transition-transform duration-700"
                    />

                    {/* Overlay Gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-transparent to-transparent opacity-90" />
                  </div>

                  <div className="p-5 relative -mt-16">
                    <h3 className="text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg leading-none mb-1">
                      {char.name.split(" ")[0]}
                    </h3>
                    <p
                      className="text-base font-bold uppercase tracking-wide mb-2 drop-shadow-md"
                      style={{ color: getRoleColor(char.id) }}
                    >
                      {char.description.split(",")[0]}
                    </p>
                    <p className="text-zinc-300 text-xs leading-relaxed mb-4 line-clamp-3 font-medium border-l-2 border-zinc-700 pl-3">
                      {char.description}
                    </p>

                    <button
                      onClick={() => onStartChat(char.id)}
                      className="w-full py-2.5 px-4 font-black uppercase tracking-widest text-white text-lg shadow-lg transform transition-all active:scale-95 hover:brightness-110 flex items-center justify-center gap-2"
                      style={{
                        backgroundColor: getButtonColor(char.id),
                        clipPath: "polygon(2% 0%, 98% 1%, 100% 90%, 98% 100%, 2% 99%, 0% 10%)",
                      }}
                    >
                      <MessageSquare className="w-5 h-5 fill-current" />
                      Chat
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Navigation */}
      <nav className="relative z-20 bg-black/90 backdrop-blur-md border-t border-zinc-800 px-6 py-4 flex justify-between items-center">
        <NavButton icon={<Home className="w-6 h-6" />} label="Home" active />
        <NavButton icon={<MessageSquare className="w-6 h-6" />} label="Chat" onClick={() => onStartChat(null)} />
        <NavButton icon={<Users className="w-6 h-6" />} label="Characters" />
        <NavButton icon={<User className="w-6 h-6" />} label="Profile" />
      </nav>
    </div>
  )
}

function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 ${active ? "text-white" : "text-zinc-500 hover:text-zinc-300"}`}
    >
      {icon}
      <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
    </button>
  )
}

function getRoleColor(id) {
  if (id.includes("mark")) return "#ef4444" // Red
  if (id.includes("mimi")) return "#22c55e" // Green
  if (id.includes("roger")) return "#3b82f6" // Blue
  if (id.includes("angel")) return "#f472b6" // Pink
  if (id.includes("collins")) return "#eab308" // Yellow
  return "#a1a1aa"
}

function getButtonColor(id) {
  if (id.includes("mark")) return "#3b82f6" // Blue button for Mark
  if (id.includes("mimi")) return "#22c55e" // Green button for Mimi
  if (id.includes("roger")) return "#ef4444" // Red button for Roger
  return "#6366f1" // Default Indigo
}
