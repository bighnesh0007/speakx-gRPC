export interface Block {
  text: string
  showInOption: boolean
  isAnswer: boolean
}

export interface Option {
  text: string
  isCorrectAnswer: boolean
}

export interface Question {
  id: string
  type: "MCQ" | "ANAGRAM" | "READ_ALONG"
  anagramType?: string
  blocks?: Block[]
  options?: Option[]
  siblingId?: string
  solution?: string
  title: string
}

export interface SearchResponse {
  questions: Question[]
  totalCount: number
  totalPages: number
}
