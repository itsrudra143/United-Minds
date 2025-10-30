import React from "react";

const RepostBanner = ({ repost }) => {
  if (!repost) return null;

  return (
    <div className="bg-purple-50 px-3 py-2 rounded-t-lg border-t border-l border-r border-purple-200">
      <div className="flex items-center gap-2">
        <span className="text-purple-600 text-lg">🔄</span>
        <span className="text-sm text-purple-700 font-medium">
          Reposted by {repost.user?.name || "Anonymous"}
        </span>
        {repost.comment && (
          <span className="text-sm text-gray-600 ml-2">"{repost.comment}"</span>
        )}
      </div>
    </div>
  );
};

export default RepostBanner;
