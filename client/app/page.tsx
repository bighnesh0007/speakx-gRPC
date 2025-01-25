"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Pagination,
 
} from "@/components/ui/pagination"
import { ChevronDown, Search, Loader2, CheckCircle2, XCircle, Sparkles, Sun, Moon, Star } from "lucide-react"
import type { Question, SearchResponse } from "@/types/question"
import { AnagramDisplay } from "@/components/anagram-display"
import { TypingEffect } from "@/components/typing-effect"
import { CommonQuestions } from "@/components/common-questions"
import FloatingNavBar from "@/components/FloatingNavBar"
import Footer from "@/components/Footer"


function BackgroundGradient() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let frame: number
    let gradient: CanvasGradient
    let hue = 0

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    const animate = () => {
      hue = (hue + 0.1) % 360
      gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      gradient.addColorStop(0, `hsla(${hue}, 70%, 80%, 0.3)`)
      gradient.addColorStop(1, `hsla(${hue + 60}, 70%, 80%, 0.3)`)

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      frame = requestAnimationFrame(animate)
    }

    resize()
    animate()
    window.addEventListener("resize", resize)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-screen w-screen opacity-30" aria-hidden="true" />
}

const MCQDisplay = ({ question }: { question: Question }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const handleOptionClick = (index: number) => {
    setSelectedOption(index)
  }

  const getOptionClassName = (index: number, isCorrectAnswer: boolean) => {
    if (selectedOption === null) {
      return "flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:bg-purple-50 cursor-pointer transition-all duration-200 bg-white/80 dark:bg-gray-800/80 dark:border-gray-700 dark:hover:bg-purple-700/20"
    }

    if (selectedOption === index) {
      return isCorrectAnswer
        ? "flex items-center gap-3 p-4 rounded-lg border-2 border-green-500 bg-green-50 cursor-pointer transition-all duration-200 dark:border-green-600 dark:bg-green-700/20"
        : "flex items-center gap-3 p-4 rounded-lg border-2 border-red-500 bg-red-50 cursor-pointer transition-all duration-200 dark:border-red-600 dark:bg-red-700/20"
    }

    if (isCorrectAnswer && selectedOption !== null) {
      return "flex items-center gap-3 p-4 rounded-lg border-2 border-green-500 bg-green-50 cursor-pointer transition-all duration-200 dark:border-green-600 dark:bg-green-700/20"
    }

    return "flex items-center gap-3 p-4 rounded-lg border border-gray-200 bg-white/80 opacity-50 cursor-pointer transition-all duration-200 dark:border-gray-700 dark:bg-gray-800/80"
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {question.options?.map((option, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            onClick={() => handleOptionClick(index)}
            className={getOptionClassName(index, option.isCorrectAnswer)}
          >
            <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-purple-100 text-purple-800 font-medium dark:bg-purple-900 dark:text-purple-200">
              {String.fromCharCode(65 + index)}
            </div>
            <span className="text-gray-700 dark:text-gray-300 flex-grow">{option.text}</span>
            {selectedOption !== null && (
              <div className="flex-shrink-0">
                {option.isCorrectAnswer ? (
                  <CheckCircle2 className="h-6 w-6 text-green-500 dark:text-green-400" />
                ) : selectedOption === index ? (
                  <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
                ) : null}
              </div>
            )}
          </motion.div>
        ))}
      </div>
      <AnimatePresence>
        {selectedOption !== null && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-4 p-4 rounded-lg bg-gray-50 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <p className="text-gray-700 dark:text-gray-300">
              {question.options && question.options[selectedOption].isCorrectAnswer
                ? "✨ Correct! Well done!"
                : `❌ Incorrect. The correct answer is: ${
                    question.options?.find((opt: any) => opt.isCorrectAnswer)?.text || "N/A"
                  }`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function QuestSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [title, setTitle] = useState(searchParams.get("title") || "")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<SearchResponse | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10
  const [darkMode, setDarkMode] = useState(false)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleFavorite = (questionId: string) => {
    setFavorites((prevFavorites) => {
      const newFavorites = new Set(prevFavorites)
      if (newFavorites.has(questionId)) {
        newFavorites.delete(questionId)
      } else {
        newFavorites.add(questionId)
      }
      return newFavorites
    })
  }

  const handleSearch = async (page = currentPage) => {
    setLoading(true)
    try {
      const response = await fetch(`/api/search?title=${encodeURIComponent(title)}&page=${page}&pageSize=${pageSize}`)
      const data = await response.json()
      if (response.ok) {
        setResults(data)
        setCurrentPage(page)
        router.push(`/?title=${encodeURIComponent(title)}&page=${page}&pageSize=${pageSize}`)
      } else {
        console.error("Error:", data.error)
        setResults(null)
        alert(`An error occurred: ${data.error}`)
      }
    } catch (error) {
      console.error("Error:", error)
      setResults(null)
      alert("An error occurred while searching. Please try again.")
    }
    setLoading(false)
  }

  const handleCommonQuestionClick = (questionTitle: string) => {
    setTitle(questionTitle)
    handleSearch(1)
  }

  const handlePageChange = (page: number) => {
    handleSearch(page)
  }

  return (
    <div className={`min-h-screen ${darkMode ? "dark" : ""}`}>
      <BackgroundGradient />
      <FloatingNavBar />
      <div className="py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200 mb-2 bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-500 dark:to-pink-500">
              <TypingEffect text="QuestSearch 🌟" delay={100} />
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              <TypingEffect text="Discover your next adventure...." delay={50} />
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-8 border border-gray-200/50 dark:bg-gray-800/80 dark:border-gray-700/50"
          >
            <div className="flex gap-3">
              <div className="relative flex-grow">
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Search question by title..."
                  className="pl-10 h-12 bg-white/90 border-gray-200 focus:border-purple-500 focus:ring-purple-500 dark:bg-gray-800/90 dark:border-gray-700 dark:focus:border-purple-400 dark:focus:ring-purple-400"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(1)}
                />
                <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-gray-500" />
              </div>
              <Button
                onClick={() => handleSearch(1)}
                disabled={loading}
                className="h-12 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-md transition-all duration-300 transform hover:scale-105 dark:from-purple-500 dark:to-pink-500 dark:hover:from-purple-400 dark:hover:to-pink-400"
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Search"}
              </Button>
            </div>
          </motion.div>

          <motion.button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md p-2 rounded-full shadow-lg"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
           
          </motion.button>

          {results && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {results.totalCount > 0 && (
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                  <p>Found {results.totalCount} results</p>
                  <p>
                    Page {currentPage} of {results.totalPages}
                  </p>
                </div>
              )}

              {results.questions.length > 0 ? (
                <div className="grid gap-6">
                  {results.questions.map((question: Question, index: number) => (
                    <motion.div
                      key={question.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm hover:shadow-xl transition-all duration-300 border border-gray-200/50 dark:border-gray-700/50 transform hover:scale-105 relative">
                        <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900 dark:to-pink-900 rounded-t-lg border-b border-gray-200/50 dark:border-gray-700/50">
                          <CardTitle className="text-xl text-gray-800 dark:text-gray-200 flex items-center">
                            <Sparkles className="w-5 h-5 mr-2 text-purple-500 dark:text-purple-400" />
                            {question.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4 dark:text-gray-300">
                          <div className="space-y-3">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">Type:</span>
                              <span className="text-sm bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 px-3 py-1 rounded-full dark:from-purple-900 dark:to-pink-900 dark:text-purple-200">
                                {question.type}
                              </span>
                            </div>

                            {question.anagramType && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                  Anagram Type:
                                </span>
                                <span className="text-sm bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 px-3 py-1 rounded-full dark:from-blue-900 dark:to-purple-900 dark:text-blue-200">
                                  {question.anagramType}
                                </span>
                              </div>
                            )}
                            
                            {question.type === "MCQ" ? (
                              <MCQDisplay question={question} />
                            ) : question.type === "ANAGRAM" ? (
                              <AnagramDisplay question={question} />
                            ) : question.type === "READ_ALONG" ? (
                              <div className="text-gray-700 dark:text-gray-300">{question.title}</div>
                            ) : (
                              <div className="text-gray-500 dark:text-gray-400">Unsupported question type</div>
                            )}
                          </div>
                        </CardContent>
                        
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg shadow-sm dark:bg-gray-800/80"
                >
                  <p className="text-gray-600 dark:text-gray-400">No results found.</p>
                </motion.div>
              )}

              {results.totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination
                    className="mt-4"
                    currentPage={currentPage}
                    totalPages={results.totalPages}
                    onPageChange={handlePageChange}
                  />
                </div>
              )}
            </motion.div>
          )}
          {!results && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <CommonQuestions onClick={handleCommonQuestionClick} />
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  )
}

