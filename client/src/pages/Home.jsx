import React from "react";
import Header from "../components/Header";
import groupImage from "../assets/image.png"; // rename your uploaded image to image.png and place inside src/assets/

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <main className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="text-center mb-12">
            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Tribe,
              <br />
              <span className="text-gray-800">Build Your Network.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Connect with like-minded students for fun, friendships, and future
              opportunities.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="bg-gray-900 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3">
                Join for Free
                <svg
                  className="w-5 h-5"
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

              <button className="bg-white text-gray-700 px-8 py-4 rounded-full font-semibold text-lg border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
                Explore Communities
              </button>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative flex justify-center">
            <div className="relative">
              <img
                src={groupImage}
                alt="Diverse group of happy students making peace signs and smiling - representing the community spirit of United Minds"
                className="w-full max-w-4xl h-auto rounded-3xl shadow-2xl transform hover:scale-105 transition-transform duration-500"
              />

              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-yellow-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-blue-400 rounded-full opacity-20 blur-xl"></div>
              <div className="absolute top-1/2 -left-8 w-16 h-16 bg-pink-400 rounded-full opacity-15 blur-lg"></div>
            </div>
          </div>
        </div>

        {/* Background decorative elements */}
        <div className="absolute top-20 left-10 w-2 h-2 bg-blue-400 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-20 w-3 h-3 bg-yellow-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-32 left-1/4 w-2 h-2 bg-pink-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-20 right-1/3 w-4 h-4 bg-green-400 rounded-full opacity-40"></div>
      </main>
    </div>
  );
}
