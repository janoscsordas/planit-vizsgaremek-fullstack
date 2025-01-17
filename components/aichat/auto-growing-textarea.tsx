"use client"

import { Textarea } from "@/components/ui/textarea"
import { ChangeEvent, useRef } from "react"

export default function AGTextarea({
  isLoading,
  message,
  setMessage,
}: {
  isLoading: boolean
  message: string
  setMessage: (e: string) => void
}) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const defaultRows = 1
  const maxRows = undefined

  const handleInput = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = "auto"

    const style = window.getComputedStyle(textarea)
    const borderHeight =
      parseInt(style.borderTopWidth) + parseInt(style.borderBottomWidth)
    const paddingHeight =
      parseInt(style.paddingTop) + parseInt(style.paddingBottom)

    const lineHeight = parseInt(style.lineHeight)
    const maxHeight = maxRows
      ? lineHeight * maxRows + borderHeight + paddingHeight
      : Infinity

    const newHeight = Math.min(textarea.scrollHeight + borderHeight, maxHeight)

    textarea.style.height = `${newHeight}px`
  }

  return (
    <Textarea
      name="message"
      id="message"
      placeholder="Írj egy üzenetet... (Planie még csak angolul ért!)"
      className="min-h-[none] resize-none focus-visible:ring-0 no-scrollbar max-h-[10rem] py-2"
      required
      disabled={isLoading}
      ref={textareaRef}
      rows={defaultRows}
      value={message}
      onChange={(e) => {
        setMessage(e.target.value)
        handleInput(e)
      }}
      maxLength={1536}
      autoFocus={true}
    />
  )
}
