import { Brain, Zap, Shield, Cpu, Eye, Rocket, ArrowRight } from "lucide-react"

const Features = () => {
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

  return (
    <section id="features" className="py-24 px-6">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Powerful Features
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto animate-fade-in-up">
            Discover the cutting-edge capabilities that make Dark AI the ultimate choice for intelligent automation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative p-8 bg-gray-900/50 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-500 hover:transform hover:scale-105 animate-fade-in-up backdrop-blur-sm"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Glow Effect */}
              <div
                className={`absolute inset-0 bg-gradient-to-r ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-500`}
              ></div>

              {/* Icon */}
              <div
                className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                {feature.title}
              </h3>
              <p className="text-gray-400 leading-relaxed">{feature.description}</p>

              {/* Hover Arrow */}
              <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div
                  className={`w-8 h-8 rounded-full bg-gradient-to-r ${feature.gradient} flex items-center justify-center`}
                >
                  <ArrowRight className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Features
