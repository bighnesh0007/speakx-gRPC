import React from 'react'
import { motion } from 'framer-motion'
import { Github, Twitter, Linkedin } from 'lucide-react'

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white/80 backdrop-blur-md py-8 border-t border-gray-200/50"
    >
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-xl font-bold text-gray-800">QuestSearch</h3>
            <p className="text-sm text-gray-600">Discover your next adventure</p>
          </div>
          <div className="flex space-x-4">
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Github className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Twitter className="w-6 h-6" />
            </a>
            <a href="#" className="text-gray-600 hover:text-purple-600 transition-colors">
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </div>
        <div className="mt-4 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} QuestSearch. All rights reserved.
        </div>
      </div>
    </motion.footer>
  )
}

export default Footer
