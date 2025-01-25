import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Home, Search, Book, User } from 'lucide-react'

const FloatingNavBar = () => {
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault()
    window.location.href = '/' // Force full page reload
  }

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-6 left-3 transform -translate-x-1/2 -translate-y-1/2 bg-white/80 backdrop-blur-md rounded-full shadow-lg p-2 z-50"
    >
      <ul className="flex space-x-6">
        <li>
          <Link 
            href="/" 
            onClick={handleHomeClick}
            className="text-gray-600 hover:text-purple-600 transition-colors"
          >
            <Home className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link href="https://www.notion.so/gRPC-186147929e8a809d852ffe6ce4f4dda0?pvs=4" className="text-gray-600 hover:text-purple-600 transition-colors">
            <Search className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link href="https://grpc.io/docs/languages/node/quickstart/" className="text-gray-600 hover:text-purple-600 transition-colors">
            <Book className="w-6 h-6" />
          </Link>
        </li>
        <li>
          <Link href="https://github.com/bighnesh0007/" className="text-gray-600 hover:text-purple-600 transition-colors">
            <User className="w-6 h-6" />
          </Link>
        </li>
      </ul>
    </motion.nav>
  )
}

export default FloatingNavBar