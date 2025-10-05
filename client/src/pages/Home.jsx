import React from "react";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Sparkles,
  ArrowRight,
  Zap,
} from "lucide-react";
import heroImage from "../assets/image.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
      {/* Hero Section with Floating Elements */}
      <main className="relative pt-24 overflow-hidden">
        {/* Animated Background Elements - Only in Hero */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>

          {/* Floating Emojis - Only in Hero */}
          <div
            className="absolute top-[20%] left-[15%] text-5xl opacity-50 animate-bounce"
            style={{ animationDuration: "3s", animationDelay: "0s" }}
          >
            📱
          </div>
          <div
            className="absolute top-[32%] right-[10%] text-5xl opacity-50 animate-bounce"
            style={{ animationDuration: "4s", animationDelay: "0.5s" }}
          >
            💻
          </div>
          <div
            className="absolute top-[15%] right-[50%] text-5xl opacity-50 animate-bounce"
            style={{ animationDuration: "4.5s", animationDelay: "1.5s" }}
          >
            ⌨️
          </div>
          <div
            className="absolute top-[45%] left-[8%] text-5xl opacity-50 animate-bounce"
            style={{ animationDuration: "3s", animationDelay: "2s" }}
          >
            📕
          </div>
          <div
            className="absolute top-[38%] right-[15%] text-5xl opacity-75 animate-bounce"
            style={{ animationDuration: "3.5s", animationDelay: "0.3s" }}
          >
            🧾
          </div>
          <div
            className="absolute top-[15%] right-[25%] text-5xl opacity-50 animate-bounce"
            style={{ animationDuration: "4.5s", animationDelay: "1.8s" }}
          >
            📈
          </div>
          <div
            className="absolute top-[28%] left-[5%] text-6xl opacity-50 animate-bounce"
            style={{ animationDuration: "3s", animationDelay: "2.2s" }}
          >
            📊
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Centered Content */}
          <div className="text-center max-w-4xl mx-auto mb-20 relative z-10">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border-2 border-blue-300/50 rounded-full px-5 py-2.5 mb-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer">
              <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
              <span className="text-sm font-bold bg-gradient-to-r from-blue-700 to-purple-700 bg-clip-text text-transparent">
                Join 10,000+ Students Already Connected
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 mb-8 leading-tight tracking-tight">
              Find Your Tribe, <br className="hidden sm:block" />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Build Your Network
                </span>
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  height="12"
                  viewBox="0 0 300 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 5 100 2 150 5C200 8 250 10 298 7"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <defs>
                    <linearGradient
                      id="gradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#3B82F6" />
                      <stop offset="50%" stopColor="#9333EA" />
                      <stop offset="100%" stopColor="#EC4899" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto font-medium">
              Connect with like-minded students through meaningful discussions.
              Share ideas, collaborate on projects, and build lasting
              friendships.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-16 justify-center">
              <button className="group bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white px-10 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 relative overflow-hidden">
                <span className="relative z-10 flex items-center gap-3">
                  <Zap className="w-5 h-5" />
                  Join for Free
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>

              <button className="bg-white text-gray-900 px-10 py-5 rounded-2xl font-bold text-lg border-2 border-gray-300 hover:border-gray-900 transition-all duration-300 shadow-lg hover:shadow-2xl flex items-center justify-center gap-3 hover:scale-105 group">
                <Users className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore Communities
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {[
                {
                  number: "500+",
                  label: "Active Communities",
                  icon: Users,
                  color: "from-blue-500 to-cyan-500",
                },
                {
                  number: "50K+",
                  label: "Discussions",
                  icon: MessageCircle,
                  color: "from-purple-500 to-pink-500",
                },
                {
                  number: "24/7",
                  label: "Active Members",
                  icon: TrendingUp,
                  color: "from-orange-500 to-red-500",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white/60 rounded-2xl p-6 border border-gray-200/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 group cursor-pointer"
                >
                  <div
                    className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center mb-3 mx-auto group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-4xl font-black text-gray-900 mb-1">
                    {stat.number}
                  </div>
                  <div className="text-sm font-semibold text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* Hero Image Section - No Floating Elements */}
      <div className="relative bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
          <div className="relative w-full flex justify-center">
            {/* Decorative Background - Subtle */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full blur-3xl animate-pulse"></div>
            <div
              className="absolute -bottom-20 -right-20 w-48 h-48 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded-full blur-3xl animate-pulse"
              style={{ animationDelay: "1s" }}
            ></div>

            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-2 border-white/50 bg-gradient-to-br from-white via-gray-50 to-blue-50 p-3">
              <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                <div className="w-full h-full bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 flex items-center justify-center">
                  <img
                    src={heroImage}
                    alt="Community Interaction"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
