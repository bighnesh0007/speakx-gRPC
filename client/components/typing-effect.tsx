"use client"

import React, { useState, useEffect, useCallback } from 'react'

interface TypingEffectProps {
  text: string
  delay?: number
  eraseDelay?: number
  typingSpeed?: number
  erasingSpeed?: number
}

export const TypingEffect: React.FC<TypingEffectProps> = ({
  text,
  delay = 2000,
  eraseDelay = 5000,
  typingSpeed = 50,
  erasingSpeed = 30,
}) => {
  const [displayText, setDisplayText] = useState('')
  const [isTyping, setIsTyping] = useState(true)

  const typeText = useCallback(() => {
    let i = 0
    setIsTyping(true)
    const timer = setInterval(() => {
      if (i < text.length) {
        setDisplayText((prev) => prev + text.charAt(i))
        i++
      } else {
        clearInterval(timer)
        setIsTyping(false)
        setTimeout(eraseText, eraseDelay)
      }
    }, typingSpeed + Math.random() * 50) // Add randomness to typing speed

    return () => clearInterval(timer)
  }, [text, eraseDelay, typingSpeed])

  const eraseText = useCallback(() => {
    let i = text.length
    setIsTyping(true)
    const timer = setInterval(() => {
      if (i > 0) {
        setDisplayText((prev) => prev.slice(0, -1))
        i--
      } else {
        clearInterval(timer)
        setIsTyping(false)
        setTimeout(typeText, delay)
      }
    }, erasingSpeed)

    return () => clearInterval(timer)
  }, [text, delay, erasingSpeed, typeText])

  useEffect(() => {
    const timer = setTimeout(typeText, delay)
    return () => clearTimeout(timer)
  }, [typeText, delay])

  return (
    <span className="inline-block">
      {displayText}
      {isTyping && (
        <span className="inline-block w-0.5 h-5 ml-0.5 bg-current animate-blink" />
      )}
    </span>
  )
}
