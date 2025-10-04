import React from "react";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 shadow-md">
      {/* Left side logo */}
      <h1 className="text-2xl font-bold text-purple-600">United Minds</h1>

      {/* Right side buttons */}
      <div className="space-x-4">
        <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">
          Login
        </button>
        <button className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300">
          Signup
        </button>
      </div>
    </header>
  );
}
