"use client"

import { useState } from "react"
import { Menu, X, Zap } from "lucide-react"
import { Link } from "react-router-dom"
const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const username = localStorage.getItem("username");

  const navItems = ["Home", "Features", "Services", "About", "Contact"]

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Zap className="w-8 h-8 text-purple-400 animate-pulse" />
              <div className="absolute inset-0 w-8 h-8 bg-purple-400/20 rounded-full blur-md"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Dark AI
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              item === "Contact" ? (
                <Link
                  key={item}
                  to="/contact"
                  className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              ) : (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-all duration-300 relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-blue-400 transition-all duration-300 group-hover:w-full"></span>
                </a>
              )
            ))}

          </nav>

           {username ? (
              <p className="text-white">Welcome, {username}</p>
            ) : (

            
              <Link to="/text-to-speech" className="hidden md:block">
                <button className="hidden md:block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 animate-glow">
                  TEXT TO SPEECH
                </button>
              </Link>
            )}
          {/* Mobile Menu Button */}
          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-800 animate-fade-in">
            <nav className="flex flex-col space-y-4 mt-4">
              {navItems.map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
            <Link to="/signup" className="text-gray-300 hover:text-white transition-colors duration-300">
              <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold w-fit">
                SIGN UP
                </button>
            </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
