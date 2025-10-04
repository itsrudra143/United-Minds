import React from "react";
import { MessageSquare, User, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-6xl w-full overflow-hidden">
        {/* Header */}
        <header className="px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-8 h-8 text-gray-900" />
            <span className="text-xl font-bold text-gray-900">
              United Minds
            </span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Features
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Communities
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Events
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              About Us
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-gray-900 font-medium text-sm"
            >
              Login
            </a>
            <button className="bg-gray-900 text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors font-medium text-sm flex items-center gap-1">
              Join for Free <ArrowRight className="w-4 h-4" />
            </button>
          </nav>
        </header>

        {/* Hero Section */}
        <main className="relative px-8 pt-12 pb-0">
          <div className="text-center mb-8 relative z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Find Your Tribe,
              <br />
              Build Your Network.
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Connect with like-minded students for fun,
              <br />
              friendships, and future opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button className="bg-gray-900 text-white px-6 py-3 rounded-full hover:bg-gray-800 transition-colors font-medium flex items-center gap-2">
                Join for Free <ArrowRight className="w-4 h-4" />
              </button>
              <button className="bg-white text-gray-700 px-6 py-3 rounded-full hover:bg-gray-50 transition-colors font-medium flex items-center gap-2 border border-gray-200">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                Explore Communities
              </button>
            </div>
          </div>

          {/* Community Image */}
          <div className="relative mt-8">
            <img
              src="/assets/image.jpg"
              alt="United Minds Community"
              className="w-full h-auto rounded-t-lg"
              onError={(e) => {
                const parent = e.target.parentElement;
                parent.innerHTML = `
                  <div style="width: 100%; height: 400px; background: linear-gradient(135deg, #fef3c7 0%, #fce7f3 50%, #e9d5ff 100%); border-radius: 0.5rem 0.5rem 0 0; display: flex; align-items: center; justify-content: center;">
                    <div style="text-align: center;">
                      <div style="font-size: 5rem; margin-bottom: 1rem;">👥</div>
                      <p style="color: #4b5563; font-size: 1.25rem; font-weight: 500;">Our Amazing Community</p>
                    </div>
                  </div>
                `;
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}
