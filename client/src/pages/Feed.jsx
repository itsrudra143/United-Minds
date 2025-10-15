import React, { useState, useEffect } from "react";
import { threadAPI, voteAPI } from "../utils/api";

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts from API
  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await threadAPI.getAll();
      setPosts(response.data.threads || response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts. Please try again later.");
      // Keep sample data for now if API fails
      setPosts([
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
      ]);
    } finally {
      setLoading(false);
    }
  };

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

  // Action handlers with API calls
  const handleUpvote = async (postId) => {
    try {
      await voteAPI.upvote({ threadId: postId });
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
        )
      );
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      await voteAPI.downvote({ threadId: postId });
      setPosts(
        posts.map((post) =>
          post.id === postId ? { ...post, downvotes: post.downvotes + 1 } : post
        )
      );
    } catch (err) {
      console.error("Error downvoting:", err);
    }
  };

  const handleComment = (postId) => {
    console.log("Comment on post:", postId);
    // Navigate to thread detail page
  };

  const handleRepost = (postId) => {
    console.log("Repost:", postId);
  };

  const handleCreateThread = () => {
    console.log("Create new thread");
    // Navigate to create thread page
  };

  const handleSearch = () => {
    console.log("Search clicked");
  };

  // const handleHome = () => {
  //   console.log("Home clicked");
  // };

  const handleProfile = () => {
    console.log("Profile clicked");
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 pt-24 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 pt-24">
      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

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
                        {post.author?.charAt(0) || "U"}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {post.author || "Anonymous"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Post Caption */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer">
                    {post.caption || post.title}
                  </h3>

                  {/* Categories */}
                  {post.categories && post.categories.length > 0 && (
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
                  )}

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
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
                  )}

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
                        {post.upvotes || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleDownvote(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      <span className="text-lg">▼</span>
                      <span>Downvote</span>
                      <span className="bg-red-200 px-2 py-0.5 rounded-full text-xs">
                        {post.downvotes || 0}
                      </span>
                    </button>

                    <button
                      onClick={() => handleComment(post.id)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <span>💬</span>
                      <span>Comment</span>
                      <span className="bg-blue-200 px-2 py-0.5 rounded-full text-xs">
                        {post.comments || 0}
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
