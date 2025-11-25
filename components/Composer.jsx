"use client"

import { useRef, useState, forwardRef, useImperativeHandle, useEffect } from "react"
import { Send, Loader2, CirclePlus } from "lucide-react"
import ComposerActionsPopover from "./ComposerActionsPopover"
import { cls } from "./utils"

const Composer = forwardRef(function Composer({ onSend, busy }, ref) {
  const [value, setValue] = useState("")
  const [sending, setSending] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [lineCount, setLineCount] = useState(1)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef.current) {
      const textarea = inputRef.current
      const lineHeight = 20 // Approximate line height in pixels
      const minHeight = 40

      // Reset height to calculate scroll height
      textarea.style.height = "auto"
      const scrollHeight = textarea.scrollHeight
      const calculatedLines = Math.max(1, Math.floor((scrollHeight - 16) / lineHeight)) // 16px for padding

      setLineCount(calculatedLines)

      if (calculatedLines <= 12) {
        // Auto-expand for 1-12 lines
        textarea.style.height = `${Math.max(minHeight, scrollHeight)}px`
        textarea.style.overflowY = "hidden"
      } else {
        // Fixed height with scroll for 12+ lines
        textarea.style.height = `${minHeight + 11 * lineHeight}px` // 12 lines total
        textarea.style.overflowY = "auto"
      }
    }
  }, [value])

  useImperativeHandle(
    ref,
    () => ({
      insertTemplate: (templateContent) => {
        setValue((prev) => {
          const newValue = prev ? `${prev}\n\n${templateContent}` : templateContent
          setTimeout(() => {
            inputRef.current?.focus()
            const length = newValue.length
            inputRef.current?.setSelectionRange(length, length)
          }, 0)
          return newValue
        })
      },
      focus: () => {
        inputRef.current?.focus()
      },
    }),
    [],
  )

  async function handleSend() {
    if (!value.trim() || sending) return
    setSending(true)
    try {
      await onSend?.(value)
      setValue("")
      inputRef.current?.focus()
    } finally {
      setSending(false)
    }
  }

  return (
    <footer className="relative flex-shrink-0 bg-[#f0f0f0]/90 dark:bg-[#1a1a1a]/90 backdrop-blur-sm border-t-2 border-black dark:border-white/20 p-3 z-10 pb-safe">
      <div className="flex items-end space-x-3 max-w-4xl mx-auto w-full">
        <ComposerActionsPopover>
          <button className="text-black dark:text-white p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors mb-1">
            <CirclePlus className="h-7 w-7 stroke-[1.5]" />
          </button>
        </ComposerActionsPopover>

        <div className="flex-1 relative">
          <textarea
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Measure in love..."
            rows={1}
            className={cls(
              "w-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/50 rounded-[24px] py-3 px-5 focus:ring-2 focus:ring-[#ffde00] focus:border-[#ffde00] text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500 resize-none outline-none font-sans transition-all",
              "min-h-[48px] flex items-center text-base",
            )}
            style={{
              height: "auto",
              overflowY: lineCount > 12 ? "auto" : "hidden",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>

        <button
          onClick={handleSend}
          disabled={sending || busy || !value.trim()}
          className="bg-[#ffde00] text-black p-3 rounded-full border-2 border-black transform hover:scale-105 active:scale-95 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-sm mb-1"
        >
          {sending || busy ? <Loader2 className="h-6 w-6 animate-spin" /> : <Send className="h-6 w-6 fill-current" />}
        </button>
      </div>
    </footer>
  )
})

export default Composer
