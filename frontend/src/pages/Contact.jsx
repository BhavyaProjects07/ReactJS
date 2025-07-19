"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Mail, Phone, MapPin, Send, User, MessageSquare, Sparkles, Brain, Clock, CheckCircle } from 'lucide-react'

const Contact = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  const formRef = useRef(null)

  // Mouse tracking for glow effect
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }
    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setIsSubmitting(true)
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      setFormData({ name: "", email: "", subject: "", message: "" })
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setIsSubmitted(false)
      }, 5000)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@darkai.com",
      description: "Send us an email anytime",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+1 (555) 123-4567",
      description: "Mon-Fri from 8am to 5pm",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      content: "San Francisco, CA",
      description: "Come say hello at our HQ",
      gradient: "from-green-500 to-emerald-500",
    },
  ]

  const faqs = [
    {
      question: "How does Dark AI work?",
      answer: "Dark AI uses advanced machine learning algorithms to process and analyze data, providing intelligent insights and automation capabilities.",
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we use enterprise-grade encryption and security measures to protect your data. Your privacy is our top priority.",
    },
    {
      question: "What pricing plans do you offer?",
      answer: "We offer flexible pricing plans for individuals, teams, and enterprises. Contact us for a custom quote based on your needs.",
    },
    {
      question: "Do you provide API access?",
      answer: "Yes, we provide comprehensive API access with detailed documentation to integrate Dark AI into your existing systems.",
    },
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
                <button
                  onClick={() => onNavigate("home")}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-5 h-5 text-gray-400" />
                </button>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
                      <Mail className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-black animate-pulse"></div>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                      Contact Us
                    </h1>
                    <p className="text-sm text-gray-400">Get in touch with our team</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="hidden md:flex items-center space-x-2 text-sm text-gray-400">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span>Response within 24h</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12 max-w-7xl">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-2 mb-6">
              <div className="relative">
                <Brain className="w-12 h-12 text-purple-400 animate-pulse" />
                <div className="absolute inset-0 w-12 h-12 bg-purple-400/20 rounded-full blur-md"></div>
              </div>
              <span className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                Dark AI
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent animate-fade-in-up">
              Let's Build the Future Together
            </h1>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto animate-fade-in-up">
              Have questions about Dark AI? Want to discuss a custom solution? Our team of AI experts is here to help you unlock the potential of artificial intelligence.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 animate-fade-in-up">
                <div className="flex items-center space-x-2 mb-6">
                  <MessageSquare className="w-6 h-6 text-purple-400" />
                  <h2 className="text-2xl font-bold text-white">Send us a message</h2>
                </div>

                {isSubmitted && (
                  <div className="mb-6 p-4 bg-green-500/20 border border-green-500/30 rounded-xl flex items-center space-x-2 animate-fade-in">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    <span className="text-green-300">Message sent successfully! We'll get back to you soon.</span>
                  </div>
                )}

                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name Field */}
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full bg-gray-800/50 border ${
                            errors.name ? "border-red-500" : "border-gray-700"
                          } rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.name && <p className="text-red-400 text-sm mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                        Email Address *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className={`w-full bg-gray-800/50 border ${
                            errors.email ? "border-red-500" : "border-gray-700"
                          } rounded-xl pl-12 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200`}
                          placeholder="Enter your email"
                        />
                      </div>
                      {errors.email && <p className="text-red-400 text-sm mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject Field */}
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      className={`w-full bg-gray-800/50 border ${
                        errors.subject ? "border-red-500" : "border-gray-700"
                      } rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200`}
                      placeholder="What's this about?"
                    />
                    {errors.subject && <p className="text-red-400 text-sm mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message Field */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={6}
                      className={`w-full bg-gray-800/50 border ${
                        errors.message ? "border-red-500" : "border-gray-700"
                      } rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-200 resize-none`}
                      placeholder="Tell us more about your project or question..."
                    />
                    <div className="flex justify-between items-center mt-2">
                      {errors.message && <p className="text-red-400 text-sm">{errors.message}</p>}
                      <div className="text-xs text-gray-500 ml-auto">{formData.message.length} characters</div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl py-4 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Sending Message...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Info & FAQ */}
            <div className="space-y-8">
              {/* Contact Information */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-fade-in-up">
                <h3 className="text-xl font-bold text-white mb-6 flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                  <span>Get in Touch</span>
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="group">
                      <div className="flex items-start space-x-4">
                        <div
                          className={`p-3 rounded-xl bg-gradient-to-r ${info.gradient} group-hover:scale-110 transition-transform duration-200`}
                        >
                          <info.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-white mb-1">{info.title}</h4>
                          <p className="text-purple-400 font-medium mb-1">{info.content}</p>
                          <p className="text-sm text-gray-400">{info.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ Section */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-6 animate-fade-in-up">
                <h3 className="text-xl font-bold text-white mb-6">Frequently Asked</h3>
                <div className="space-y-4">
                  {faqs.map((faq, index) => (
                    <details key={index} className="group">
                      <summary className="cursor-pointer text-white font-medium py-2 hover:text-purple-400 transition-colors duration-200">
                        {faq.question}
                      </summary>
                      <p className="text-gray-400 text-sm mt-2 pl-4 border-l-2 border-purple-500/30">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>

              {/* Response Time */}
              <div className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 rounded-2xl p-6 animate-fade-in-up">
                <div className="flex items-center space-x-2 mb-2">
                  <Clock className="w-5 h-5 text-green-400" />
                  <span className="font-semibold text-white">Quick Response</span>
                </div>
                <p className="text-sm text-gray-300">
                  We typically respond to all inquiries within 24 hours. For urgent matters, please call us directly.
                </p>
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

export default Contact
