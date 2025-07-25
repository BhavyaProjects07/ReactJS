"use client"

import { useState, useRef, useEffect } from "react"
import {
  Send, Bot, User, Sparkles, Brain, Copy, ThumbsUp, ThumbsDown, ArrowLeft
} from "lucide-react"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
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
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  

    const handleSendMessage = async (e) => {
      e.preventDefault();
      if (!inputMessage.trim()) return;

      const userMessage = {
        id: Date.now(),
        type: "user",
        content: inputMessage,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInputMessage("");
      setIsTyping(true);

      try {
        const BASE_URL = import.meta.env.VITE_API_BASE_URL;
        
        const endpoint = isImageMode
          ? `${BASE_URL}api/generate-image/`
          : `${BASE_URL}api/chat/`;
        console.log("Fetch endpoint:", endpoint);
        console.log("VITE_API_BASE_URL:", import.meta.env.VITE_API_BASE_URL);

        const requestBody = isImageMode
          ? { prompt: inputMessage }
          : { message: inputMessage };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });

        const data = await response.json();

        const botResponse = {
          id: Date.now() + 1,
          type: "bot",
          content: isImageMode
            ? `<img src="${BASE_URL}${data.file_name}" alt="Generated Image" class='rounded-xl' />`
            : data.bot_response,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, botResponse]);
      } catch (error) {
        console.error("Error fetching AI response:", error);
        const botResponse = {
          id: Date.now() + 1,
          type: "bot",
          content: "Sorry, I couldn't process your request. Please try again.",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botResponse]);
      } finally {
        setIsTyping(false);
      }
    };


  const formatTime = (timestamp) => timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })

  const copyMessage = (content) => navigator.clipboard.writeText(content)

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 flex flex-col h-screen">
        <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button onClick={() => onNavigate("home")} className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Brain className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Dark AI Assistant
                    </h1>
                    <p className="text-sm text-gray-400">Online • Advanced AI Model</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link to="/text-to-speech" className="text-purple-400 hover:underline">
                  <button className="hidden md:block px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 animate-glow">
                    TEXT TO SPEECH
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div className="container mx-auto max-w-4xl">
            {messages.map((message) => (
              <div key={message.id} className={`flex items-start space-x-4 animate-fade-in-up ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}>
                <div className="flex-shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${message.type === "bot" ? "bg-gradient-to-r from-purple-600 to-blue-600" : "bg-gradient-to-r from-gray-600 to-gray-700"}`}>
                    {message.type === "bot" ? <Bot className="w-6 h-6 text-white" /> : <User className="w-6 h-6 text-white" />}
                  </div>
                </div>

                <div className={`flex-1 max-w-3xl ${message.type === "user" ? "text-right" : ""}`}>
                  <div className={`group relative p-4 rounded-2xl ${message.type === "bot" ? "bg-gray-900/50 border border-gray-800 backdrop-blur-sm" : "bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30"}`}>
                    {message.content.includes('<img') ? (
                      <div className="text-gray-100 leading-relaxed" dangerouslySetInnerHTML={{ __html: message.content }} />
                    ) : (
                      <pre className="whitespace-pre-wrap text-white leading-relaxed">
                        {message.content}
                      </pre>
                    )}

                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      {message.type === "bot" && (
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={() => copyMessage(message.content)} className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-white transition-colors duration-200">
                            <Copy className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-green-400 transition-colors duration-200">
                            <ThumbsUp className="w-4 h-4" />
                          </button>
                          <button className="p-1 hover:bg-gray-700 rounded text-gray-400 hover:text-red-400 transition-colors duration-200">
                            <ThumbsDown className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-start space-x-4 animate-fade-in">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gray-900/50 border border-gray-800 backdrop-blur-sm p-4 rounded-2xl">
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

        <div className="border-t border-gray-800 bg-black/80 backdrop-blur-md">
          <div className="container mx-auto max-w-4xl px-6 py-4">
            <form onSubmit={handleSendMessage} className="relative">
              <div className="flex items-end space-x-4">
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
                    placeholder="Ask Dark AI anything..."
                    className="w-full bg-gray-900/50 border border-gray-700 rounded-2xl px-4 py-3 pr-12 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 resize-none backdrop-blur-sm"
                    rows="1"
                    style={{ minHeight: "48px", maxHeight: "120px" }}
                  />
                  <span
                    className="absolute right-10 top-1/2 transform -translate-y-1/2 text-sm text-purple-400 cursor-pointer"
                    onClick={() => setIsImageMode(!isImageMode)}
                  >
                    {isImageMode ? "Generate Image On" : "Generate Image Off"}
                  </span>
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <Sparkles className="w-5 h-5 text-purple-400 animate-pulse" />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={!inputMessage.trim() || isTyping}
                  className="p-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl text-white hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            <div className="flex flex-wrap gap-2 mt-4">
              {["Explain AI concepts", "Help with coding", "Business strategy", "Creative writing"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setInputMessage(suggestion)}
                  className="px-3 py-1 text-sm bg-gray-800/50 border border-gray-700 rounded-full text-gray-300 hover:text-white hover:border-purple-500 transition-all duration-200"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed top-1/4 right-8 space-y-4 pointer-events-none">
        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
        <div className="w-4 h-4 bg-purple-400/50 rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  )
}

export default Chat
