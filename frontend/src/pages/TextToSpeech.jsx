"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Volume2, Download, Play, Pause, Mic, Sparkles, Zap, Globe, Settings } from 'lucide-react'
import axios from "axios"
import { Link } from "react-router-dom"
const TextToSpeech = ({ onNavigate }) => {
  const [text, setText] = useState("")
  const [language, setLanguage] = useState("en") // Default to English
  const [audioUrl, setAudioUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  
  const audioRef = useRef(null)
  const textareaRef = useRef(null)

  // Mouse tracking for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Audio event handlers
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => {
      setCurrentTime(audio.currentTime)
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    const updateDuration = () => {
      setDuration(audio.duration)
    }

    const handleEnded = () => {
      setIsPlaying(false)
      setProgress(0)
      setCurrentTime(0)
    }

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [audioUrl])

  const handleGenerateSpeech = async () => {
  if (!text.trim()) {
    alert("Please enter some text to generate speech")
    return
  }

  setIsGenerating(true)
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL}api/text-to-speech/`,
      {
        text,
        lang: language,
      }
    )
    setAudioUrl(res.data.audio_url)
  } catch (err) {
    console.error("Failed to generate speech:", err)
    alert("Failed to generate speech")
  } finally {
    setIsGenerating(false)
  }
}

  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const formatTime = (time) => {
    if (isNaN(time)) return "0:00"
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const languages = [
    { code: "en", name: "English", flag: "🇺🇸" },
    { code: "es", name: "Spanish", flag: "🇪🇸" },
    { code: "hi", name: "Hindi", flag: "🇮🇳" },
    { code: "fr", name: "French", flag: "🇫🇷" },
    { code: "de", name: "German", flag: "🇩🇪" },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-1000"></div>

        {/* Floating Particles */}
        <div className="particles-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 20}s`,
                animationDuration: `${20 + Math.random() * 20}s`,
              }}
            />
          ))}
        </div>

        {/* Mouse Follower Glow */}
        <div
          className="pointer-events-none fixed w-96 h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl transition-all duration-300 ease-out z-0"
          style={{
            left: mousePosition.x - 192,
            top: mousePosition.y - 192,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-gray-800 bg-black/80 backdrop-blur-md">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">

              <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300">                  
                <button
                  
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                                  </button>
              </Link>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Volume2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Text to Speech
                    </h1>
                    <p className="text-sm text-gray-400">AI Voice Generator</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Powered by Dark AI</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8 max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Text Input Section */}
            <div className="lg:col-span-2 space-y-6">
              {/* Text Input */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-fade-in-up">
                <div className="flex items-center space-x-2 mb-4">
                  <Mic className="w-5 h-5 text-purple-400" />
                  <h2 className="text-lg font-semibold text-white">Enter Your Text</h2>
                </div>
                <div className="relative">
                  <textarea
                    ref={textareaRef}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here to convert it to speech..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none"
                    rows={8}
                  />
                  <div className="absolute bottom-3 right-3 text-xs text-gray-500">
                    {text.length} characters
                  </div>
                </div>
              </div>

              {/* Language Selection */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-fade-in-up">
                <div className="flex items-center space-x-2 mb-4">
                  <Globe className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">Select Language</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setLanguage(lang.code)}
                      className={`p-3 rounded-xl border transition-all duration-200 flex items-center space-x-2 ${
                        language === lang.code
                          ? "border-purple-500 bg-purple-500/20 text-white"
                          : "border-gray-700 bg-gray-800/50 text-gray-300 hover:border-gray-600 hover:bg-gray-700/50"
                      }`}
                    >
                      <span className="text-lg">{lang.flag}</span>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerateSpeech}
                disabled={isGenerating || !text.trim()}
                className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl py-4 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isGenerating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating Speech...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-5 h-5" />
                    <span>Generate Speech</span>
                  </>
                )}
              </button>
            </div>

            {/* Audio Player Section */}
            <div className="space-y-6">
              {/* Audio Player */}
              {audioUrl && (
                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-fade-in-up">
                  <div className="flex items-center space-x-2 mb-4">
                    <Volume2 className="w-5 h-5 text-green-400" />
                    <h2 className="text-lg font-semibold text-white">Audio Player</h2>
                  </div>

                  {/* Waveform Visualization */}
                  <div className="mb-6">
                    <div className="flex items-center justify-center h-20 bg-gray-800/50 rounded-xl border border-gray-700">
                      <div className="flex items-end space-x-1">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-1 bg-gradient-to-t from-purple-500 to-blue-500 rounded-full transition-all duration-200 ${
                              isPlaying ? "animate-pulse" : ""
                            }`}
                            style={{
                              height: `${Math.random() * 40 + 10}px`,
                              animationDelay: `${i * 100}ms`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <button
                        onClick={togglePlayPause}
                        className="w-12 h-12 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-200 transform hover:scale-105"
                      >
                        {isPlaying ? (
                          <Pause className="w-6 h-6 text-white" />
                        ) : (
                          <Play className="w-6 h-6 text-white ml-1" />
                        )}
                      </button>
                      <div className="text-sm text-gray-400">
                        {formatTime(currentTime)} / {formatTime(duration)}
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-200"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    {/* Download Button */}
                    <a
                      href={`${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}${audioUrl}`}
                      download
                      className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-gray-300 hover:text-white hover:border-gray-600 hover:bg-gray-700/50 transition-all duration-200"
                    >
                      <Download className="w-5 h-5" />
                      <span>Download Audio</span>
                    </a>
                  </div>

                  {/* Hidden Audio Element */}
                  <audio
                    ref={audioRef}
                    src={`${import.meta.env.VITE_API_BASE_URL.replace(/\/$/, "")}${audioUrl}`}

                    className="hidden"
                  />
                </div>
              )}

              {/* Features */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-fade-in-up">
                <div className="flex items-center space-x-2 mb-4">
                  <Settings className="w-5 h-5 text-yellow-400" />
                  <h2 className="text-lg font-semibold text-white">Features</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-sm">High-quality AI voices</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">Multiple languages</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm">Instant generation</span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-300">
                    <div className="w-2 h-2 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm">Download & share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating AI Indicators */}
      <div className="fixed top-1/4 right-8 space-y-4 pointer-events-none">
        <div className="w-3 h-3 bg-purple-400 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse delay-300"></div>
        <div className="w-4 h-4 bg-purple-400/50 rounded-full animate-pulse delay-700"></div>
      </div>
    </div>
  )
}

export default TextToSpeech
