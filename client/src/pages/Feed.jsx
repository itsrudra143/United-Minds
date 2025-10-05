import React, { useState } from "react";

const Feed = () => {
  // Sample posts data - replace with API call later
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: "John Doe",
      createdAt: "2025-10-05T14:30:00",
      caption: "Need help with React Hooks",
      categories: ["React", "JavaScript"],
      tags: ["hooks", "useEffect", "useState"],
      content:
        "I am trying to understand how useEffect works with dependency arrays. Can someone explain the lifecycle?",
      upvotes: 24,
      downvotes: 2,
      comments: 8,
    },
    {
      id: 2,
      author: "Jane Smith",
      createdAt: "2025-10-05T12:15:00",
      caption: "CSS Grid vs Flexbox",
      categories: ["CSS", "Web Development"],
      tags: ["css", "layout", "flexbox", "grid"],
      content:
        "When should I use CSS Grid over Flexbox? What are the main differences and use cases?",
      upvotes: 42,
      downvotes: 1,
      comments: 15,
    },
    {
      id: 3,
      author: "Mike Johnson",
      createdAt: "2025-10-04T18:45:00",
      caption: "MongoDB aggregation pipeline help",
      categories: ["Database", "MongoDB"],
      tags: ["mongodb", "aggregation", "database"],
      content:
        "How do I perform complex queries using MongoDB aggregation pipeline? Looking for examples.",
      upvotes: 18,
      downvotes: 0,
      comments: 5,
    },
  ]);

  // Format timestamp
  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString();
  };

  // Action handlers
  const handleUpvote = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
      )
    );
  };

  const handleDownvote = (postId) => {
    setPosts(
      posts.map((post) =>
        post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
      )
    );
  };

  const handleComment = (postId) => {
    console.log("Comment on post:", postId);
    // Implement comment functionality
  };

  const handleRepost = (postId) => {
    console.log("Repost:", postId);
    // Implement repost functionality
  };

  const handleCreateThread = () => {
    console.log("Create new thread");
    // Navigate to create thread page
  };

  const handleSearch = () => {
    console.log("Search clicked");
    // Implement search functionality
  };

  const handleHome = () => {
    console.log("Home clicked");
    // Navigate to home
  };

  const handleProfile = () => {
    console.log("Profile clicked");
    // Navigate to profile
  };

  return (
    <div className="w-full bg-gray-50 pt-24 ">
      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Center Panel - Posts Feed */}
          <main className="flex-1 w-full lg:max-w-3xl">
            <div className="space-y-4">
              {posts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
                >
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {post.author.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.author}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Caption */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                    {post.caption}
                  </h3>

                  {/* Categories */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {post.categories.map((category, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium hover:bg-blue-200 cursor-pointer transition-colors"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium hover:bg-gray-200 cursor-pointer transition-colors"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-gray-700 leading-relaxed">
                      {post.content}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleUpvote(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <span className="text-lg">▲</span>
                      <span>Upvote</span>
                      <span className="bg-green-200 px-2 py-0.5 rounded-full text-xs">
                        {post.upvotes}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDownvote(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <span className="text-lg">▼</span>
                      <span>Downvote</span>
                      <span className="bg-red-200 px-2 py-0.5 rounded-full text-xs">
                        {post.downvotes}
                      </span>
                    </button>

                    <button
                      onClick={() => handleComment(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span>💬</span>
                      <span>Comment</span>
                      <span className="bg-blue-200 px-2 py-0.5 rounded-full text-xs">
                        {post.comments}
                      </span>
                    </button>

                    <button
                      onClick={() => handleRepost(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-purple-50 text-purple-700 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <span>🔄</span>
                      <span>Repost</span>
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </main>

          {/* Right Sidebar Panel */}
          <aside className="w-full lg:w-80 lg:sticky lg:top-24 h-fit flex flex-col">
            <div className="max-w-7xl mx-auto px-1 sm:px-6 lg:px-8"></div>
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-left gap-4 py-4 mr-4 flex-col">
                <button
                  onClick={handleSearch}
                  className="px-16 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  🔍 Search
                </button>

                <button
                  onClick={handleProfile}
                  className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  👤 Profile
                </button>
              </div>

              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Quick Actions
              </h3>

              <div className="space-y-3">
                <button
                  onClick={handleCreateThread}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <span className="text-xl">➕</span>
                  <span>Create Thread</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <span className="text-xl">🏷️</span>
                  <span>Explore Tags</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <span className="text-xl">🔥</span>
                  <span>Top Discussions</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <span className="text-xl">📊</span>
                  <span>Trending Topics</span>
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-3 bg-gray-50 text-gray-700 rounded-lg font-medium hover:bg-gray-100 transition-colors text-left focus:outline-none focus:ring-2 focus:ring-gray-300">
                  <span className="text-xl">👥</span>
                  <span>Active Users</span>
                </button>
              </div>
            </div>

            {/* Additional Sidebar Widget */}
            <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-200 p-6">
              <h4 className="font-bold text-gray-900 mb-2">💡 Featured Tips</h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                Ask clear questions with proper tags to get better responses
                from the community.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Feed;
