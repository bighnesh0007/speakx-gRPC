"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

// Update the Question type to match the component's requirements
export type Question = {
  id: string
  title: string
  type: string
  blocks?: Array<{ text: string; showInOption: boolean; isAnswer: boolean }>
  solution?: string
  anagramType?: string
}

interface AnagramDisplayProps {
  question: Question
}

export function AnagramDisplay({ question }: AnagramDisplayProps) {
  const [userAnswer, setUserAnswer] = useState("")
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Provide default values to handle potential undefined properties
  const blocks = question.blocks || []
  const solution = question.solution || ""
  const anagramType = question.anagramType || "DEFAULT"

  const handleSubmit = () => {
    const isAnswerCorrect = userAnswer.toLowerCase().trim() === solution.toLowerCase()
    setIsCorrect(isAnswerCorrect)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {blocks.map((block, index) => (
          <div
            key={index}
            className={`px-3 py-2 text-sm font-medium ${
              anagramType === "SENTENCE"
                ? "bg-purple-100 text-purple-900 rounded-md"
                : "w-12 h-12 flex items-center justify-center bg-purple-100 text-purple-900 rounded-lg"
            }`}
          >
            {block.text}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Input
          type="text"
          value={userAnswer}
          onChange={(e) => setUserAnswer(e.target.value)}
          placeholder="Enter your answer..."
          className="flex-grow"
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        />
        <Button onClick={handleSubmit} className="bg-black text-white hover:bg-gray-800">
          Check
        </Button>
      </div>

      {isCorrect !== null && (
        <div className={`p-3 rounded-md ${isCorrect ? "bg-green-50" : "bg-red-50"}`}>
          <p className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>
            {isCorrect ? "✨ Correct!" : `❌ Incorrect. The answer is: ${solution}`}
          </p>
        </div>
      )}
    </div>
  )
}