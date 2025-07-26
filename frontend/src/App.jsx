"use client"

import { useState, useEffect } from "react"
import { ArrowRight, Sparkles, Brain, Cpu, Zap, Eye, Rocket, Shield, Code, Database, Settings } from "lucide-react"
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import Chat from "./pages/Chat.jsx"

function App() {
  const [currentPage, setCurrentPage] = useState("home")
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Hero component state
  const [text, setText] = useState("")
  const fullText = "The DARK AI made by BHAVYA"

  // Stats component state
  const [counters, setCounters] = useState([0, 0, 0, 0])
  const targets = [150, 99, 24, 500]
  const labels = ["AI Models Deployed", "Accuracy Rate", "Hours Uptime", "Enterprise Clients"]
  const suffixes = ["+", ".9%", "/7", "+"]

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  // Hero typewriter effect
  useEffect(() => {
    let index = 0
    const timer = setInterval(() => {
      setText(fullText.slice(0, index))
      index++
      if (index > fullText.length) {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [])

  // Stats counter animation
  useEffect(() => {
    const timers = targets.map((target, index) => {
      const increment = target / 100
      let current = 0

      return setInterval(() => {
        current += increment
        if (current >= target) {
          current = target
          clearInterval(timers[index])
        }
        setCounters((prev) => {
          const newCounters = [...prev]
          newCounters[index] = Math.floor(current)
          return newCounters
        })
      }, 20)
    })

    return () => timers.forEach((timer) => clearInterval(timer))
  }, [])

  if (currentPage === "chat") {
    return <Chat onNavigate={setCurrentPage} />
  }

  // Features data
  const features = [
    {
      icon: Brain,
      title: "Neural Processing",
      description: "Advanced neural networks that learn and adapt to your specific needs in real-time.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "Process millions of data points in milliseconds with our optimized AI algorithms.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Shield,
      title: "Secure & Private",
      description: "Enterprise-grade security with end-to-end encryption and privacy protection.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: Cpu,
      title: "Smart Automation",
      description: "Automate complex workflows with intelligent decision-making capabilities.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: Eye,
      title: "Predictive Analytics",
      description: "Forecast trends and patterns with unprecedented accuracy and insight.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Rocket,
      title: "Scalable Solutions",
      description: "Scale from startup to enterprise with our flexible AI infrastructure.",
      gradient: "from-pink-500 to-rose-500",
    },
  ]

  // Services data
  const services = [
    {
      icon: Code,
      title: "AI Development",
      description: "Custom AI solutions tailored to your business needs with cutting-edge technology.",
      features: ["Machine Learning Models", "Neural Networks", "Deep Learning"],
      gradient: "from-purple-500 to-blue-500",
    },
    {
      icon: Database,
      title: "Data Analytics",
      description: "Transform your data into actionable insights with advanced analytics and AI.",
      features: ["Predictive Analytics", "Data Mining", "Business Intelligence"],
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Cpu,
      title: "AI Integration",
      description: "Seamlessly integrate AI capabilities into your existing systems and workflows.",
      features: ["API Integration", "System Optimization", "Performance Tuning"],
      gradient: "from-green-500 to-teal-500",
    },
    {
      icon: Settings,
      title: "AI Consulting",
      description: "Strategic guidance to implement AI solutions that drive business growth.",
      features: ["Strategy Planning", "Technology Assessment", "Implementation Support"],
      gradient: "from-orange-500 to-red-500",
    },
  ]

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* Animated Background - Responsive */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
        <div className="absolute inset-0 bg-gradient-radial from-purple-900/20 via-transparent to-transparent"></div>

        {/* Floating Particles - Responsive */}
        <div className="particles-container">
          {[...Array(window.innerWidth < 768 ? 15 : 30)].map((_, i) => (
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

        {/* Mouse Follower Glow - Hidden on mobile */}
        <div
          className="pointer-events-none fixed w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 blur-3xl transition-all duration-300 ease-out z-0 hidden sm:block"
          style={{
            left: mousePosition.x - (window.innerWidth < 640 ? 128 : 192),
            top: mousePosition.y - (window.innerWidth < 640 ? 128 : 192),
          }}
        />

        {/* Background Orbs - Responsive */}
        <div className="absolute top-1/4 left-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 sm:w-96 sm:h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
      </div>

      <div className="relative z-10">
        <Header onNavigate={setCurrentPage} />

        {/* Hero Section - Responsive */}
        <section id="home" className="min-h-screen flex items-center justify-center pt-16 sm:pt-20 px-4 sm:px-6">
          <div className="container mx-auto text-center relative max-w-7xl">
            {/* Floating Icons - Responsive */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none hidden sm:block">
              <Brain className="absolute top-1/4 left-1/4 w-6 h-6 sm:w-8 sm:h-8 text-purple-400/30 animate-float" />
              <Cpu className="absolute top-1/3 right-1/4 w-5 h-5 sm:w-6 sm:h-6 text-blue-400/30 animate-float-delayed" />
              <Sparkles className="absolute bottom-1/3 left-1/3 w-8 h-8 sm:w-10 sm:h-10 text-purple-400/20 animate-float" />
              <Zap className="absolute top-1/2 right-1/3 w-6 h-6 sm:w-7 sm:h-7 text-blue-400/25 animate-float" />
            </div>

            {/* Main Content - Responsive */}
            <div className="relative z-10">
              <div className="mb-6 sm:mb-8 animate-fade-in">
                <span className="inline-block px-3 py-1.5 sm:px-4 sm:py-2 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full text-xs sm:text-sm font-medium text-purple-300 border border-purple-500/30">
                  ✨ Next Generation AI Platform
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight animate-fade-in-up">
                <span className="bg-gradient-to-r from-white via-purple-200 to-blue-200 bg-clip-text text-transparent">
                  Dark AI
                </span>
                <br />
                <span className="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-normal text-gray-400 typewriter">
                  {text}
                  <span className="animate-pulse">|</span>
                </span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 mb-8 sm:mb-12 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto leading-relaxed animate-fade-in-up px-4 sm:px-0">
                Harness the power of advanced artificial intelligence to transform your business. Experience
                cutting-edge technology that adapts, learns, and evolves with your needs.
              </p>

              {/* CTA Buttons - Responsive */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12 sm:mb-16 animate-fade-in-up px-4 sm:px-0">
                <button
                  onClick={() => setCurrentPage("chat")}
                  className="group w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full text-white font-semibold hover:shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2"
                >
                  <span>Start Your Journey</span>
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </button>
                <button className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 border border-gray-600 rounded-full text-white font-semibold hover:border-purple-400 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-300 transform hover:scale-105">
                  Watch Demo
                </button>
              </div>

              {/* Stats - Responsive */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-xs sm:max-w-4xl mx-auto px-4 sm:px-0">
                {[
                  { number: "99.9%", label: "Accuracy Rate" },
                  { number: "10M+", label: "Data Points" },
                  { number: "24/7", label: "AI Monitoring" },
                ].map((stat, index) => (
                  <div
                    key={index}
                    className="text-center animate-fade-in-up"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-1 sm:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Features Section - Responsive */}
        <section id="features" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Powerful Features
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto animate-fade-in-up px-4 sm:px-0">
                Discover the cutting-edge capabilities that make Dark AI the ultimate choice for intelligent automation
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group relative p-6 sm:p-8 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in-up backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {/* Glow Effect */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
                  ></div>

                  {/* Icon */}
                  <div
                    className={`inline-flex p-2.5 sm:p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed text-sm sm:text-base">{feature.description}</p>

                  {/* Hover Arrow */}
                  <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}
                    >
                      <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section - Responsive */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="relative">
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-blue-600/10 to-purple-600/10 rounded-2xl sm:rounded-3xl blur-3xl"></div>

              <div className="relative bg-gray-900/30 rounded-2xl sm:rounded-3xl border border-gray-800 p-6 sm:p-8 md:p-12 backdrop-blur-sm">
                <div className="text-center mb-8 sm:mb-12">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 animate-fade-in">
                    <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                      Trusted by Industry Leaders
                    </span>
                  </h2>
                  <p className="text-base sm:text-lg text-gray-400 animate-fade-in-up">
                    Join thousands of companies already using Dark AI
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                  {counters.map((count, index) => (
                    <div
                      key={index}
                      className="text-center animate-fade-in-up"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-1 sm:mb-2">
                        <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                          {count}
                          {suffixes[index]}
                        </span>
                      </div>
                      <div className="text-gray-400 text-xs sm:text-sm uppercase tracking-wider px-1">
                        {labels[index]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section - Responsive */}
        <section id="services" className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-12 sm:mb-16">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 animate-fade-in">
                <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                  Our Services
                </span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-xs sm:max-w-2xl md:max-w-3xl mx-auto animate-fade-in-up px-4 sm:px-0">
                Comprehensive AI solutions designed to transform your business operations
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className="group bg-gray-900/40 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 sm:p-8 hover:border-gray-700 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex p-3 sm:p-4 rounded-xl bg-gradient-to-r ${service.gradient} mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <service.icon className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 mb-4 sm:mb-6 leading-relaxed text-sm sm:text-base">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 sm:mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-300 text-sm sm:text-base">
                        <div
                          className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-r ${service.gradient} mr-2 sm:mr-3 flex-shrink-0`}
                        ></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button className="group/btn flex items-center space-x-2 text-white font-semibold hover:text-purple-400 transition-all duration-300 text-sm sm:text-base">
                    <span>Learn More</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover/btn:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </div>
  )
}

export default App
