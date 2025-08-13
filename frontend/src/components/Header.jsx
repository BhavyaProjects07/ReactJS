"use client"

import { useState } from "react"
import { Menu, X, Zap, User } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const username = localStorage.getItem("username")
  const navigate = useNavigate()

  const navItems = ["Home", "Features", "Services", "About", "Contact"]

  const handleLogout = () => {
    localStorage.removeItem("username")
    localStorage.removeItem("token") // if you store JWT/session token
    navigate("/signin")
    window.location.reload()
  }

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
            {navItems.map((item) =>
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
            )}
          </nav>

          {/* Right Side */}
          {username ? (
            <div className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center space-x-2 text-white hover:text-purple-300 transition-colors"
              >
                <User className="w-6 h-6" />
                <span>{username}</span>
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-900 border border-gray-700 rounded-lg shadow-lg">
                  <div className="px-4 py-2 text-gray-300 border-b border-gray-700">{username}</div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/text-to-speech" className="hidden md:block">
              <button className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 animate-glow">
                TEXT TO SPEECH
              </button>
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
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
              {username ? (
                <button
                  onClick={handleLogout}
                  className="mt-4 px-6 py-2 bg-red-500 rounded-full text-white font-semibold"
                >
                  Logout
                </button>
              ) : (
                <Link to="/signup" className="text-gray-300 hover:text-white transition-colors duration-300">
                  <button className="mt-4 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold w-fit">
                    SIGN UP
                  </button>
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
