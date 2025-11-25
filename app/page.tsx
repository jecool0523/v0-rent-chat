"use client"

import { useRef } from "react"
import { motion, useScroll, useSpring, useInView } from "framer-motion"
import { useRouter } from "next/navigation"
import { MoveRight, Music, Info, MessageCircle } from "lucide-react"

export default function LandingPage() {
  const router = useRouter()
  const containerRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  const smoothProgress = useSpring(scrollYProgress, { damping: 15, mass: 0.27, stiffness: 55 })

  return (
    <div ref={containerRef} className="relative bg-[#0a0e17] text-white overflow-x-hidden selection:bg-blue-500/30">
      <StarField />

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 to-purple-500 z-50 origin-left"
        style={{ scaleX: smoothProgress }}
      />

      {/* Hero Section - Ticket */}
      <section className="relative h-screen flex flex-col items-center justify-center p-6 overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 w-full max-w-4xl cursor-pointer group"
          onClick={() => router.push("/characters")}
        >
          <motion.div
            whileHover={{ scale: 1.02, rotate: 1 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-blue-500/20 blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <img
              src="/images/ticket-header.png"
              alt="RENT Ticket - Departure Any Time"
              className="w-full h-auto drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] rounded-lg relative z-10"
            />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="text-center mt-8 text-blue-200/60 font-mono tracking-[0.3em] text-sm animate-pulse"
          >
            CLICK TICKET TO ENTER
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll to Explore</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
        </motion.div>
      </section>

      {/* Musical Overview Section */}
      <Section className="bg-gradient-to-b from-[#0a0e17] to-zinc-950">
        <div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          <div className="space-y-6">
            <div className="flex items-center gap-3 text-blue-400 mb-2">
              <Music className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-widest">The Musical</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              NO DAY BUT <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">TODAY</span>
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              RENT is a rock musical with music, lyrics.........
              뭐 렌트 뮤지컬 소개 쓰는 칸
            </p>
          </div>
          <div className="relative h-[400px] md:h-[500px] rounded-lg overflow-hidden border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 z-10 group-hover:opacity-0 transition-opacity duration-500" />
            <img
              src="/images/background.png"
              alt="RENT Atmosphere"
              className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000"
            />
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 to-transparent z-20">
              <p className="font-mono text-xs text-white/60">EAST VILLAGE, NEW YORK</p>
            </div>
          </div>
        </div>
      </Section>

      {/* Plot Summary Section */}
      <Section className="bg-zinc-950">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/5 mb-4">
            <Info className="w-6 h-6 text-purple-400" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">A Story of Life, Love & Loss<br />뭐 줄거리 쓰는 칸</h2>
          <p className="text-xl text-zinc-400 leading-relaxed font-light">"Measure your life in love."</p>
          <div className="grid md:grid-cols-3 gap-6 text-left mt-12">
            <PlotCard
              title="The Struggle"
              desc="Young artists fighting to pay rent while pursuing their dreams in a cold city."
            />
            <PlotCard
              title="The Connection"
              desc="Finding community and family in the unlikeliest of places among outcasts."
            />
            <PlotCard
              title="The Hope"
              desc="Facing the future with courage and embracing the moment—no day but today."
            />
          </div>
        </div>
      </Section>

      {/* Website Intro Section */}
      <Section className="bg-gradient-to-b from-zinc-950 to-[#0a0e17]">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="absolute -inset-4 bg-blue-500/10 blur-xl rounded-full" />
            <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-2xl">
              <p className="text-2xl font-serif italic leading-relaxed text-blue-100/90 text-center">
                "이곳은 모든 것이 꾸며진 거짓의 공간이지만, <br />
                누구나 꿈꾸는 완벽한 공간이지요."
              </p>
              <p className="text-xs text-center mt-6 text-white/40 font-mono tracking-widest uppercase">
                made by siwon
              </p>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <div className="flex items-center gap-3 text-green-400 mb-2">
              <MessageCircle className="w-6 h-6" />
              <span className="text-sm font-bold uppercase tracking-widest">The Experience</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter">
              CHAT WITH <br />
              THE CHARACTERS <br />
              이 사이트 설명 쓰는 칸!
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed">
              Dive into the world of RENT like never before. Engage in deep conversations with Mark, Mimi, Roger, and
              the entire cast. Discover their secrets, share your thoughts, and become part of their story.
            </p>
            <button
              onClick={() => router.push("/characters")}
              className="group relative inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold text-lg uppercase tracking-widest hover:bg-blue-50 transition-all duration-300 rounded-sm mt-4"
            >
              Start Your Journey
              <MoveRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              <div className="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 pointer-events-none" />
            </button>
          </div>
        </div>
      </Section>

      {/* Footer */}
      <footer className="py-12 text-center text-zinc-600 text-sm border-t border-white/5 bg-[#0a0e17]">
        <p className="font-mono">© 2025 RENT CHAT EXPERIENCE. ALL RIGHTS RESERVED.</p>
      </footer>
    </div>
  )
}

function Section({ children, className }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  return (
    <section ref={ref} className={`min-h-screen flex items-center justify-center p-6 py-24 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full"
      >
        {children}
      </motion.div>
    </section>
  )
}

function PlotCard({ title, desc }) {
  return (
    <div className="p-6 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-zinc-400 leading-relaxed">{desc}</p>
    </div>
  )
}

function StarField() {
  // Generate static stars to avoid hydration mismatch, or use CSS
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {[...Array(50)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.5 + 0.1,
            animationDuration: `${Math.random() * 3 + 2}s`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  )
}
