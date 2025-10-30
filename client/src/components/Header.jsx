import React, { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import logo from "../assets/logo.png";

export default function Header() {
  const [scrollY, setScrollY] = useState(0);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    try {
      const u = localStorage.getItem("user");
      if (u) setUser(JSON.parse(u));
    } catch (_) {}
  }, []);

  const signOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    window.location.href = "/";
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 20
          ? "bg-white/80 backdrop-blur-xl shadow-lg"
          : "bg-transparent"
      }`}>
      <nav className="w-full px-24 py-4 flex items-center justify-between">
        {/* Left side - Logo only */}
        <div
          className="flex items-center cursor-pointer group"
          onClick={() => (window.location.href = "/")}>
          <img
            src={logo}
            alt="United Minds Logo"
            className="h-[60px] w-auto transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* Right side - Auth-aware controls */}
        <div className="flex items-center gap-4">
          {!user ? (
            <>
              <button
                onClick={() => (window.location.href = "/login")}
                className="text-gray-600 hover:text-gray-900 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
                Sign In
              </button>
              <button
                onClick={() => (window.location.href = "/register")}
                className="group bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white px-5 py-2 rounded-2xl font-bold text-[14px] hover:shadow-2xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 relative overflow-hidden">
                Join Free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name?.charAt(0) ?? "U"}
              </div>
              <button
                onClick={() => (window.location.href = "/profile")}
                className="text-gray-800 font-semibold hidden sm:inline hover:underline">
                {user.name}
              </button>
              <button
                onClick={signOut}
                className="text-gray-600 hover:text-gray-900 font-semibold transition-colors px-4 py-2 rounded-lg hover:bg-gray-100">
                Sign Out
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
