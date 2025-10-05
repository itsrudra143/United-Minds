import { useState } from "react";
import {
  Users,
  MapPin,
  Briefcase,
  GraduationCap,
  Calendar,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Share2,
  Edit,
  Plus,
} from "lucide-react";

export default function ProfileSection() {
  const [activeTab, setActiveTab] = useState("profile");
  const [followers, setFollowers] = useState(5);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  const tabs = [
    { id: "profile", label: "Profile" },
    { id: "answers", label: "Answers", count: 0 },
    { id: "questions", label: "Questions", count: 0 },
    { id: "posts", label: "Posts", count: 0 },
    { id: "followers", label: "Followers", count: 5 },
    { id: "following", label: "Following", count: 0 },
    { id: "activity", label: "Activity" },
  ];

  const handleFollow = () => {
    if (isFollowing) {
      setFollowers(followers - 1);
    } else {
      setFollowers(followers + 1);
    }
    setIsFollowing(!isFollowing);
  };

  const [posts] = useState([
    {
      id: 1,
      type: "answer",
      question: "What are the best practices for React development?",
      content:
        "React development involves several best practices including component composition, proper state management, and understanding the React lifecycle. Always keep components small and focused, use hooks effectively, and implement proper error boundaries.",
      upvotes: 24,
      downvotes: 2,
      comments: 8,
      timestamp: "2 days ago",
    },
    {
      id: 2,
      type: "question",
      question:
        "How do I implement authentication in a MERN stack application?",
      answers: 12,
      followers: 5,
      timestamp: "5 days ago",
    },
  ]);

  const [postVotes, setPostVotes] = useState({});

  const handleVote = (postId, voteType) => {
    setPostVotes((prev) => {
      const currentVote = prev[postId];
      if (currentVote === voteType) {
        const { [postId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [postId]: voteType };
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-28">
          <div className="flex items-start gap-8">
            {/* Profile Image */}
            <div className="relative flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover ring-4 ring-gray-100"
              />
              <button className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                <Edit className="w-3.5 h-3.5 text-white" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    Rudrakshi
                  </h1>
                  <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3">
                    Add profile credential
                  </button>
                  <div className="flex items-center gap-3 text-sm">
                    <button className="flex items-center gap-1.5 text-gray-700 hover:text-gray-900 font-medium transition-colors">
                      <Users className="w-4 h-4" />
                      <span>{followers} followers</span>
                    </button>
                    <span className="text-gray-300">·</span>
                    <button className="text-gray-700 hover:text-gray-900 font-medium transition-colors">
                      {following} following
                    </button>
                  </div>
                </div>
                <button
                  onClick={handleFollow}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                    isFollowing
                      ? "bg-gray-100 hover:bg-gray-200 text-gray-800"
                      : "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              </div>

              <div className="mt-5">
                <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  Write a description about yourself
                </button>
              </div>
            </div>
          </div>

          {/* Credentials */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-base font-semibold text-gray-900 mb-4">
              Credentials & Highlights
            </h3>
            <div className="space-y-2.5">
              <button className="flex items-center gap-2.5 text-sm text-blue-600 hover:text-blue-700 transition-colors group">
                <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <Briefcase className="w-4 h-4" />
                </div>
                <span>Add employment credential</span>
              </button>
              <button className="flex items-center gap-2.5 text-sm text-blue-600 hover:text-blue-700 transition-colors group">
                <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <span>Add education credential</span>
              </button>
              <button className="flex items-center gap-2.5 text-sm text-blue-600 hover:text-blue-700 transition-colors group">
                <div className="p-1.5 rounded-lg bg-blue-50 group-hover:bg-blue-100 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Add location credential</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500 mt-5 pt-4 border-t border-gray-100">
              <Calendar className="w-3.5 h-3.5" />
              <span>Joined June 2021</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-6">
          <div className="flex gap-8 overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                  activeTab === tab.id
                    ? "text-red-600 border-red-600"
                    : "text-gray-600 hover:text-gray-900 border-transparent"
                }`}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className="ml-1.5 text-xs text-gray-500">
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="max-w-5xl mx-auto px-6 py-6">
        {activeTab === "profile" && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-5">
              <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                <MessageSquare className="w-10 h-10 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Start sharing your knowledge
            </h3>
            <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
              You haven't shared, answered or posted anything yet. Start
              contributing to the community.
            </p>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm">
              Answer questions
            </button>
          </div>
        )}

        {activeTab === "answers" && (
          <div className="space-y-4">
            {posts
              .filter((post) => post.type === "answer")
              .map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-3 leading-snug">
                    {post.question}
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed mb-4">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-600 pt-3 border-t border-gray-100">
                    <div className="flex items-center gap-1 mr-4">
                      <button
                        onClick={() => handleVote(post.id, "up")}
                        className={`p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          postVotes[post.id] === "up"
                            ? "text-blue-600 bg-blue-50"
                            : "text-gray-600"
                        }`}
                      >
                        <ThumbsUp className="w-4 h-4" />
                      </button>
                      <span className="font-medium text-gray-900 min-w-[2rem] text-center">
                        {post.upvotes +
                          (postVotes[post.id] === "up"
                            ? 1
                            : postVotes[post.id] === "down"
                            ? -1
                            : 0)}
                      </span>
                      <button
                        onClick={() => handleVote(post.id, "down")}
                        className={`p-2 rounded-lg hover:bg-gray-50 transition-colors ${
                          postVotes[post.id] === "down"
                            ? "text-red-600 bg-red-50"
                            : "text-gray-600"
                        }`}
                      >
                        <ThumbsDown className="w-4 h-4" />
                      </button>
                    </div>
                    <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors px-2 py-2 rounded-lg hover:bg-gray-50">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center gap-1.5 hover:text-gray-900 transition-colors px-2 py-2 rounded-lg hover:bg-gray-50">
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>
                    <span className="ml-auto text-xs text-gray-500">
                      {post.timestamp}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "questions" && (
          <div className="space-y-4">
            {posts
              .filter((post) => post.type === "question")
              .map((post) => (
                <div
                  key={post.id}
                  className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                >
                  <h3 className="text-base font-semibold text-gray-900 mb-4 leading-snug">
                    {post.question}
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="font-medium">{post.answers} answers</span>
                    <span className="text-gray-300">·</span>
                    <span>{post.followers} followers</span>
                    <span className="ml-auto text-xs text-gray-500">
                      {post.timestamp}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        )}

        {activeTab === "followers" && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <Users className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No followers yet
            </h3>
            <p className="text-sm text-gray-600">
              Your followers will appear here
            </p>
          </div>
        )}

        {(activeTab === "posts" ||
          activeTab === "following" ||
          activeTab === "activity") && (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nothing to show
            </h3>
            <p className="text-sm text-gray-600">
              Content will appear here once available
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
