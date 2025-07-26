"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Sparkles, Brain, Copy, ThumbsUp, ThumbsDown, ArrowLeft, MoreVertical } from "lucide-react"
import { Link } from "react-router-dom"

const Chat = ({ onNavigate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "Hello! I'm Dark AI, your advanced artificial intelligence assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isImageMode, setIsImageMode] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const chatContainerRef = useRef(null)
  const initialViewportHeight = useRef(0)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Comprehensive mobile keyboard handling
  useEffect(() => {
    // Store initial viewport height
    initialViewportHeight.current = window.innerHeight

    const updateViewportHeight = () => {
      const currentHeight = window.visualViewport ? window.visualViewport.height : window.innerHeight
      const heightDifference = initialViewportHeight.current - currentHeight

      setViewportHeight(currentHeight)
      setIsKeyboardOpen(heightDifference > 150) // Keyboard is open if height difference > 150px

      // Force scroll to bottom when keyboard opens
      if (heightDifference > 150) {
        setTimeout(() => {
          scrollToBottom()
          // Also scroll the input into view
          if (inputRef.current) {
            inputRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" })
          }
        }, 100)
      }
    }

    // Initial setup
    updateViewportHeight()

    // Multiple event listeners for better compatibility
    const handleResize = () => {
      updateViewportHeight()
    }

    const handleVisualViewportChange = () => {
      updateViewportHeight()
    }

    const handleFocus = () => {
      setTimeout(() => {
        updateViewportHeight()
        setIsKeyboardOpen(true)
        scrollToBottom()
      }, 300)
    }

    const handleBlur = () => {
      setTimeout(() => {
        updateViewportHeight()
      }, 300)
    }

    // Add event listeners
    window.addEventListener("resize", handleResize)

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleVisualViewportChange)
    }

    if (inputRef.current) {
      inputRef.current.addEventListener("focus", handleFocus)
      inputRef.current.addEventListener("blur", handleBlur)
    }

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)

      if (window.visualViewport) {
        window.visualViewport.removeEventListener("resize", handleVisualViewportChange)
      }

      if (inputRef.current) {
        inputRef.current.removeEventListener("focus", handleFocus)
        inputRef.current.removeEventListener("blur", handleBlur)
      }
    }
  }, [])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: "user",
      content: inputMessage,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsTyping(true)

    try {
      const BASE_URL = import.meta.env.VITE_API_BASE_URL
      const endpoint = isImageMode ? `${BASE_URL}api/generate-image/` : `${BASE_URL}api/chat/`

      console.log("VITE_API_BASE_URL:", BASE_URL)

      const requestBody = isImageMode ? { prompt: inputMessage } : { message: inputMessage }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      console.log("Fetch endpoint ye hai :", endpoint)
      const data = await response.json()
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: isImageMode
          ? `<img src="${data.file_name}" alt="Generated Image" class='rounded-xl max-w-full h-auto' />`
          : data.bot_response,
        timestamp: new Date(),
      }
      console.log("The image url :", data.file_name)

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error fetching AI response:", error)
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: "Sorry, I couldn't process your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (timestamp) => timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  const copyMessage = (content) => navigator.clipboard.writeText(content)

  // Calculate dynamic heights
  const containerHeight = viewportHeight > 0 ? `${viewportHeight}px` : "100vh"
  const headerHeight = 80 // Approximate header height
  const inputAreaHeight = 140 // Approximate input area height
  const messagesHeight =
    viewportHeight > 0
      ? `${viewportHeight - headerHeight - inputAreaHeight}px`
      : `calc(100vh - ${headerHeight + inputAreaHeight}px)`

  return (
    <div
      className="bg-black text-white"
      style={{ height: containerHeight, maxHeight: containerHeight, overflow: "hidden" }}
    >
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col" style={{ height: containerHeight }}>
        {/* Header - Fixed height */}
        <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md flex-shrink-0">
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
              {/* Left Section */}
              <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
                <button
                  onClick={() => onNavigate("home")}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200 flex-shrink-0"
                >
                  <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </button>
                <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Brain className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                  </div>
                  <div className="min-w-0">
                    <h1 className="text-sm sm:text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent truncate">
                      Dark AI Assistant
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">Online • Advanced AI Model</p>
                  </div>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center space-x-2">
                {/* Desktop Text-to-Speech Button */}
                <Link to="/text-to-speech" className="hidden lg:block">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                    TEXT TO SPEECH
                  </button>
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="lg:hidden mt-4 pt-4 border-t border-gray-800 animate-fade-in">
                <Link to="/text-to-speech" className="block">
                  <button
                    onClick={() => setShowMobileMenu(false)}
                    className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                  >
                    TEXT TO SPEECH
                  </button>
                </Link>
              </div>
            )}
          </div>
        </header>

        {/* Messages Area - Scrollable with fixed height */}
        <div
          ref={chatContainerRef}
          className="overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6 flex-1"
          style={{
            height: messagesHeight,
            maxHeight: messagesHeight,
            minHeight: 0,
          }}
        >
          <div className="w-full max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 sm:space-x-4 animate-fade-in-up ${
                  message.type === "user" ? "flex-row-reverse space-x-reverse" : ""
                }`}
              >
                {/* Avatar */}
                <div className="flex-shrink-0">
                  <div
                    className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center ${
                      message.type === "bot"
                        ? "bg-gradient-to-r from-purple-600 to-blue-600"
                        : "bg-gradient-to-r from-gray-600 to-gray-700"
                    }`}
                  >
                    {message.type === "bot" ? (
                      <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    ) : (
                      <User className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                    )}
                  </div>
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-[85%] sm:max-w-3xl ${message.type === "user" ? "text-right" : ""}`}>
                  <div
                    className={`group relative p-3 sm:p-4 rounded-2xl ${
                      message.type === "bot"
                        ? "bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
                        : "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30"
                    }`}
                  >
                    {/* Message Text */}
                    {message.content.includes("<img") ? (
                      <div
                        className="text-gray-100 leading-relaxed text-sm sm:text-base"
                        dangerouslySetInnerHTML={{ __html: message.content }}
                      />
                    ) : (
                      <pre className="whitespace-pre-wrap text-white leading-relaxed text-sm sm:text-base font-sans">
                        {message.content}
                      </pre>
                    )}

                    {/* Message Footer */}
                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      {message.type === "bot" && (
                        <div className="flex items-center space-x-1 sm:space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => copyMessage(message.content)}
                            className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors duration-200"
                          >
                            <Copy className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400 transition-colors duration-200">
                            <ThumbsUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors duration-200">
                            <ThumbsDown className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-start space-x-2 sm:space-x-4 animate-fade-in">
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm p-3 sm:p-4 rounded-2xl">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area - Fixed at bottom, always visible */}
        <div className="border-t border-gray-800 bg-black/95 backdrop-blur-md flex-shrink-0">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            {/* Image Mode Toggle - Above Input */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-400">Mode:</span>
                <button
                  onClick={() => setIsImageMode(!isImageMode)}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isImageMode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                  }`}
                >
                  {isImageMode ? "IMG ON" : "IMG OFF"}
                </button>
              </div>
              {!isKeyboardOpen && (
                <div className="text-xs text-gray-500 hidden sm:block">
                  {isImageMode ? "Generate images from text" : "Chat with AI assistant"}
                </div>
              )}
            </div>

            <form onSubmit={handleSendMessage} className="relative">
              <div className="flex items-end space-x-2 sm:space-x-4">
                <div className="flex-1 relative">
                  <textarea
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage(e)
                      }
                    }}
                    placeholder={isImageMode ? "Describe the image..." : "Ask Dark AI anything..."}
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-12 sm:pr-16 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none backdrop-blur-sm text-sm sm:text-base"
                    rows="1"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                  />

                  {/* Sparkles Icon */}
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
                  </div>
                </div>

                {/* Send Button */}
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>

            {/* Quick Actions - Hide on mobile when keyboard is open */}
            {!isKeyboardOpen && (
              <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
                {isImageMode
                  ? ["Realistic portrait", "Abstract art", "Landscape scene", "Digital artwork"].map(
                      (suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-purple-500 transition-all duration-200 whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">{suggestion}</span>
                          <span className="sm:hidden">
                            {suggestion === "Realistic portrait" && "Portrait"}
                            {suggestion === "Abstract art" && "Abstract"}
                            {suggestion === "Landscape scene" && "Landscape"}
                            {suggestion === "Digital artwork" && "Digital"}
                          </span>
                        </button>
                      ),
                    )
                  : ["Explain AI concepts", "Help with coding", "Business strategy", "Creative writing"].map(
                      (suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => setInputMessage(suggestion)}
                          className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-purple-500 transition-all duration-200 whitespace-nowrap"
                        >
                          <span className="hidden sm:inline">{suggestion}</span>
                          <span className="sm:hidden">
                            {suggestion === "Explain AI concepts" && "AI"}
                            {suggestion === "Help with coding" && "Code"}
                            {suggestion === "Business strategy" && "Business"}
                            {suggestion === "Creative writing" && "Creative"}
                          </span>
                        </button>
                      ),
                    )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating AI Indicators - Responsive */}
      <div className="fixed top-1/4 right-2 sm:right-8 space-y-2 sm:space-y-4 pointer-events-none">
        <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
        <div className="w-3 h-3 sm:w-4 sm:h-4 bg-purple-400/50 rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  )
}

export default Chat
