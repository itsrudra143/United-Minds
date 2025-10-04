import React from "react";
import { MessageCircle, Users, TrendingUp, Sparkles } from "lucide-react";
// Import the image at the top
import heroImage from "../assets/image.png";
import "../index.css";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-900">
              United Minds
            </span>
          </div>
          <div className="flex items-center gap-6">
            <button className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
              Sign In
            </button>
            <button className="bg-gray-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-all">
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        {/* Content Container */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          {/* Centered Content */}
          <div className="text-center max-w-4xl mx-auto mb-16">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">
                Join 10,000+ Students Already Connected
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              Find Your Tribe,{" "}
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Build Your Network
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
              Connect with like-minded students through meaningful discussions.
              Share ideas, collaborate on projects, and build lasting
              friendships.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12 justify-center">
              <button className="group bg-gray-900 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                Join for Free
                <svg
                  className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <button className="bg-white text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-200 hover:border-gray-900 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                <Users className="w-5 h-5" />
                Explore Communities
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  500+
                </div>
                <div className="text-sm text-gray-600">Active Communities</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  50K+
                </div>
                <div className="text-sm text-gray-600">Discussions</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  24/7
                </div>
                <div className="text-sm text-gray-600">Active Members</div>
              </div>
            </div>
          </div>

          {/* Hero Image Section */}
          <div className="relative w-full flex justify-center">
            {/* Decorative Background Elements */}
            <div className="absolute -top-10 -left-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"></div>

            {/* Main Image Container */}
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-gray-200/50 bg-gradient-to-br from-gray-50 to-gray-100 p-2">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src={heroImage}
                  alt="Diverse group of happy students connecting and networking"
                  className="w-[1200px] h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
