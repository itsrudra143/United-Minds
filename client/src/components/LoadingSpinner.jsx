import React from "react";

export default function LoadingSpinner({ message = "Loading..." }) {
  return (
    <div className="flex items-center justify-center py-6">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}
