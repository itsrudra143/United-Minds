import React from "react";

export default function ErrorAlert({ message }) {
  if (!message) return null;

  return (
    <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
      {message}
    </div>
  );
}
