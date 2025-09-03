"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send,
  Bot,
  User,
  Sparkles,
  Brain,
  Copy,
  ThumbsUp,
  ThumbsDown,
  ArrowLeft,
  MoreVertical,
} from "lucide-react"
import { Link } from "react-router-dom"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

const Chat = ({ onNavigate }) => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      content: "## 👋 Hello!\nI'm **Dark AI**, your advanced assistant.\n\nHow can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [inputMessage, setInputMessage] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [isImageMode, setIsImageMode] = useState(false)
  const [isCodeMode, setIsCodeMode] = useState(false)
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const [showStartupNotice, setShowStartupNotice] = useState(true)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
    const timer = setTimeout(() => {
      setShowStartupNotice(false)
    }, 20000)
    return () => clearTimeout(timer)
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
      const endpoint = isImageMode
        ? `${BASE_URL}api/generate-image/`
        : `${BASE_URL}api/chat/`

      const requestBody = isImageMode
        ? { prompt: inputMessage }
        : { message: inputMessage, code_mode: isCodeMode }

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      const data = await response.json()
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: isImageMode
          ? `![Generated Image](${data.file_name})`
          : data.bot_response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botResponse])
    } catch (error) {
      console.error("Error fetching AI response:", error)
      const botResponse = {
        id: Date.now() + 1,
        type: "bot",
        content: "**❌ Sorry**, I couldn’t process your request. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    } finally {
      setIsTyping(false)
    }
  }

  const formatTime = (timestamp) =>
    timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const copyMessage = (content) => navigator.clipboard.writeText(content)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
          <div className="w-full px-4 sm:px-6 py-3 sm:py-4">
            <div className="flex items-center justify-between">
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
                    <p className="text-xs sm:text-sm text-gray-400 hidden sm:block">
                      Online • Advanced AI Model
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link to="/text-to-speech" className="hidden lg:block">
                  <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white text-sm font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                    TEXT TO SPEECH
                  </button>
                </Link>
                <button
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                  className="lg:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <MoreVertical className="w-5 h-5 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-4 sm:py-6 space-y-4 sm:space-y-6">
          {showStartupNotice && (
            <div className="mb-4 p-3 rounded-xl bg-yellow-900/30 border border-yellow-600 text-yellow-300 text-sm text-center animate-pulse">
              ⚠️ Server is waking up... Response might take a few seconds only for the first request.
            </div>
          )}

          <div className="w-full max-w-4xl mx-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start space-x-2 sm:space-x-4 animate-fade-in-up ${
                  message.type === "user"
                    ? "flex-row-reverse space-x-reverse"
                    : ""
                }`}
              >
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
                <div
                  className={`flex-1 max-w-[85%] sm:max-w-3xl ${
                    message.type === "user" ? "text-right" : ""
                  }`}
                >
                  <div
                    className={`group relative p-3 sm:p-4 rounded-2xl ${
                      message.type === "bot"
                        ? "bg-gray-900/50 border border-gray-800 backdrop-blur-sm"
                        : "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30"
                    }`}
                  >
                    {message.type === "bot" ? (
                      <div className="prose prose-invert max-w-none">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({ children }) => (
                            <h1 className="text-4xl font-extrabold mt-10 mb-6 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                              {children}
                            </h1>
                          ),
                          h2: ({ children }) => (
                            <h2 className="text-3xl font-bold mt-8 mb-4 text-blue-300 border-b border-white/20 pb-2">
                              {children}
                            </h2>
                          ),
                          h3: ({ children }) => (
                            <h3 className="text-2xl font-semibold mt-6 mb-3 text-indigo-300">
                              {children}
                            </h3>
                          ),
                          p: ({ children }) => (
                            <p className="text-white/80 text-base leading-relaxed my-4 pl-1">
                              {children}
                            </p>
                          ),
                          ul: ({ children }) => (
                            <ul className="list-disc pl-6 space-y-2 marker:text-purple-400">
                              {children}
                            </ul>
                          ),
                          ol: ({ children }) => (
                            <ol className="list-decimal pl-6 space-y-2 marker:text-blue-400">
                              {children}
                            </ol>
                          ),
                          li: ({ children }) => (
                            <li className="leading-relaxed text-white/90">
                              {children}
                            </li>
                          ),
                          blockquote: ({ children }) => (
                            <blockquote className="bg-white/5 border-l-4 border-blue-400 pl-4 italic rounded-lg py-3 my-4 text-white/80">
                              {children}
                            </blockquote>
                          ),
                          strong: ({ children }) => (
                            <strong className="text-yellow-300 font-semibold">
                              {children}
                            </strong>
                          ),
                          code: ({ inline, children }) =>
                            inline ? (
                              <code className="bg-gray-800 px-1.5 py-0.5 rounded text-pink-400 font-mono text-sm">
                                {children}
                              </code>
                            ) : (
                              <pre className="bg-gray-900 p-4 rounded-xl overflow-x-auto my-4">
                                <code className="text-green-400 font-mono text-sm">{children}</code>
                              </pre>
                            ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
                    </div>

                    ) : (
                      <p className="text-white">{message.content}</p>
                    )}

                    <div className="flex items-center justify-between mt-2 sm:mt-3">
                      <span className="text-xs text-gray-500">
                        {formatTime(message.timestamp)}
                      </span>
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

        {/* Input Area */}
        <div className="border-t border-gray-800 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-4">
            {/* Mode Toggles */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <span className="text-xs sm:text-sm text-gray-400">Mode:</span>
                <button
                  onClick={() => {
                    setIsImageMode(!isImageMode)
                    if (!isImageMode) setIsCodeMode(false)
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isImageMode
                      ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25"
                      : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                  }`}
                >
                  {isImageMode ? "GENERATE IMG ON" : "GENERATE IMG OFF"}
                </button>
                <button
                  onClick={() => {
                    setIsCodeMode(!isCodeMode)
                    if (!isCodeMode) setIsImageMode(false)
                  }}
                  className={`px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 ${
                    isCodeMode
                      ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/25"
                      : "bg-gray-800/50 border border-gray-700 text-gray-300 hover:text-white hover:border-gray-600"
                  }`}
                >
                  {isCodeMode ? "GENERATE CODE ON" : "GENERATE CODE OFF"}
                </button>
              </div>
              <div className="text-xs text-gray-500">
                {isImageMode
                  ? "Generate images from text"
                  : isCodeMode
                  ? "Generate raw code responses"
                  : "Chat with AI assistant"}
              </div>
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
                    placeholder={
                      isImageMode
                        ? "Describe the image..."
                        : isCodeMode
                        ? "Ask for code..."
                        : "Ask Dark AI anything..."
                    }
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-3 sm:px-4 py-2 sm:py-3 pr-12 sm:pr-16 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none backdrop-blur-sm text-sm sm:text-base"
                    rows="1"
                    style={{ minHeight: "44px", maxHeight: "120px" }}
                  />
                  <div className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-purple-400 animate-pulse" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-2 sm:p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex-shrink-0"
                >
                  <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </form>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mt-3 sm:mt-4">
              {isImageMode
                ? ["Realistic portrait", "Abstract art", "Landscape scene", "Digital artwork"].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(s)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-purple-500 transition-all duration-200 whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))
                : isCodeMode
                ? ["Python function", "React component", "Django API", "SQL query"].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(s)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-purple-500 transition-all duration-200 whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))
                : ["Explain AI concepts", "Help with coding", "Business strategy", "Creative writing"].map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setInputMessage(s)}
                      className="px-2 sm:px-3 py-1 text-xs sm:text-sm bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-purple-500 transition-all duration-200 whitespace-nowrap"
                    >
                      {s}
                    </button>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Chat
