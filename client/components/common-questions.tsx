import React from "react"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export type Question = {
  id: string
  title: string
  type: string
}

const hardcodedQuestions: Question[] = [
  {
    id: "1",
    title: "Rearrange the letters to form a word",
    type: "ANAGRAM",
  },
  {
    id: "2",
    title: 'Rearrange the words to form a sentence',
    type: "ANAGRAM",
  },
  {
    id: "3",
    title: "In my previous job, I often had to complete tasks ______ tight deadlines.",
    type: "MCQ",
  },
  {
    id: "4",
    title: "Which word is a synonym for 'Limit' in the context of setting boundaries or restrictions?",
    type: "MCQ",
  },
  {
    id: "5",
    title: "Purple always brightens my day.",
    type: "READ_ALONG",
  },
]

interface CommonQuestionsProps {
  onClick: (title: string) => void
}

export function CommonQuestions({ onClick }: CommonQuestionsProps) {
  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Common Questions</h2>
      <div className="grid gap-4">
        {hardcodedQuestions.map((question) => (
          <motion.div
            key={question.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => onClick(question.title)}
          >
            <Card className="bg-white/80 backdrop-blur-sm hover:shadow-md transition-all duration-300 border border-gray-200/50 cursor-pointer">
              <CardHeader>
                <CardTitle className="text-lg text-gray-800 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-purple-500" />
                  {question.title}
                </CardTitle>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

