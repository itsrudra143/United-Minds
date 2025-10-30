import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  authAPI,
  threadAPI,
  repostAPI,
  voteAPI,
  followAPI,
} from "../utils/api";
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
  Loader,
  UserCircle,
  Repeat,
} from "lucide-react";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";
import RepostBanner from "../components/RepostBanner";

export default function ProfileSection() {
  const params = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("posts");
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // logged in user
  const [profileUser, setProfileUser] = useState(null); // displayed profile (could be another user)
  const [userThreads, setUserThreads] = useState([]);
  const [userReposts, setUserReposts] = useState([]);
  const [userReplies, setUserReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const getTabs = () => [
    { id: "posts", label: "Posts", count: userThreads.length },
    { id: "reposts", label: "Reposts", count: userReposts.length },
    { id: "replies", label: "Replies", count: userReplies.length },
    { id: "followers", label: "Followers", count: followers },
    { id: "following", label: "Following", count: following },
    { id: "activity", label: "Activity" },
  ];

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);

        // Get current user first (logged in user)
        let currentUserData = null;
        try {
          const meRes = await authAPI.getCurrentUser();
          currentUserData = meRes.data;
          setCurrentUser(currentUserData);
        } catch (authErr) {
          // If not logged in, we'll just show the profile as a visitor
          console.log("Not logged in or error fetching current user", authErr);
        }

        // Determine which profile to load
        const targetUserId = params.userId || currentUserData?.id;

        if (!targetUserId) {
          // Not logged in and no user ID in params
          navigate("/login");
          return;
        }

        // Check if viewing own profile
        const isOwnProfileView = currentUserData?.id === Number(targetUserId);
        setIsOwnProfile(isOwnProfileView);

        // If not own profile, fetch the profile user's data
        if (!isOwnProfileView && params.userId) {
          try {
            // In a real app, you'd have a getUserById API call
            // For now, we'll set some placeholder data
            setProfileUser({
              id: Number(params.userId),
              name: `User ${params.userId}`,
              email: `user${params.userId}@example.com`,
              createdAt: new Date().toISOString(),
            });
          } catch (profileErr) {
            console.error("Error fetching profile:", profileErr);
            setError("Failed to load user profile");
          }
        } else {
          // Using own profile data but making sure createdAt exists
          const enrichedUserData = {
            ...currentUserData,
            createdAt: currentUserData?.createdAt || new Date().toISOString(),
          };
          setProfileUser(enrichedUserData);
        }

        // Fetch threads (posts)
        const threadsRes = await threadAPI.getAll();
        const allThreads = threadsRes.data.threads || threadsRes.data || [];
        const userThreads = allThreads.filter(
          (t) => t.author?.id === Number(targetUserId)
        );
        setUserThreads(userThreads);

        // Fetch reposts for this user
        try {
          const repostsRes = await repostAPI.getByUserId(targetUserId);
          setUserReposts(repostsRes.data.reposts || []);
        } catch (repostErr) {
          console.warn("Error fetching reposts:", repostErr);
          setUserReposts([]);
        }

        // Fetch follower information and follow status
        try {
          if (currentUserData && targetUserId !== currentUserData.id) {
            // Check if current user is following the profile user
            const followStatusRes = await followAPI.checkFollowing(
              targetUserId
            );
            setIsFollowing(followStatusRes.data.isFollowing);
            setFollowers(followStatusRes.data.followerCount);
            setFollowing(followStatusRes.data.followingCount);
          } else {
            // If viewing own profile, just get follower and following counts
            const [followerRes, followingRes] = await Promise.all([
              followAPI.getFollowers(targetUserId),
              followAPI.getFollowing(targetUserId),
            ]);
            setFollowers(followerRes.data.total);
            setFollowing(followingRes.data.total);
          }
        } catch (followErr) {
          console.warn("Error fetching follow data:", followErr);
          // Default to 0 if we can't fetch the data
          setFollowers(0);
          setFollowing(0);
        }

        setError(null);
      } catch (err) {
        // 401 redirects to /login via interceptor
        if (err?.response?.status !== 401) {
          setError(
            err?.response?.data?.error ||
              err?.message ||
              "Failed to load profile"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [params.userId, navigate]);

  // Follow or unfollow a user
  const handleFollow = async () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow the user
        const res = await followAPI.unfollowUser(profileUser.id);
        setFollowers(res.data.followerCount);
        setIsFollowing(false);
      } else {
        // Follow the user
        const res = await followAPI.followUser(profileUser.id);
        setFollowers(res.data.followerCount);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error("Error following/unfollowing:", err);
    }
  };

  const handleUpvote = async (threadId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await voteAPI.upvoteThread(threadId);
      // Update the thread in our local state
      setUserThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                score: res.data.score,
                upvotes: res.data.upvotes,
                downvotes: res.data.downvotes,
              }
            : thread
        )
      );
    } catch (err) {
      console.error("Error upvoting:", err);
    }
  };

  const handleDownvote = async (threadId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      const res = await voteAPI.downvoteThread(threadId);
      // Update the thread in our local state
      setUserThreads((prev) =>
        prev.map((thread) =>
          thread.id === threadId
            ? {
                ...thread,
                score: res.data.score,
                upvotes: res.data.upvotes,
                downvotes: res.data.downvotes,
              }
            : thread
        )
      );
    } catch (err) {
      console.error("Error downvoting:", err);
    }
  };

  const handleRepost = async (threadId) => {
    if (!currentUser) {
      navigate("/login");
      return;
    }

    try {
      await repostAPI.create({ threadId });
      // Refresh the data to show the new repost
      const repostsRes = await repostAPI.getByUserId(currentUser.id);
      setUserReposts(repostsRes.data.reposts || []);
    } catch (err) {
      console.error("Error reposting:", err);
    }
  };

  const handleDeleteRepost = async (repostId) => {
    if (!currentUser) return;

    try {
      await repostAPI.delete(repostId);
      // Remove from local state
      setUserReposts((prev) => prev.filter((repost) => repost.id !== repostId));
    } catch (err) {
      console.error("Error deleting repost:", err);
    }
  };

  const formatDate = (ts) => {
    if (!ts) return "";

    try {
      const date = new Date(ts);
      const now = new Date();
      const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

      if (diffInHours < 1) return "Just now";
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInHours < 48) return "Yesterday";

      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (_) {
      return "";
    }
  };

  const getJoinedDate = (timestamp) => {
    if (!timestamp) return "";

    try {
      const date = new Date(timestamp);

      // Check if the date is valid
      if (isNaN(date.getTime())) return "";

      // Format as "Month Year" (e.g., "October 2025")
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "long",
      });
    } catch (_) {
      return "";
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        {/* Loading State */}
        {loading && (
          <div className="w-full py-32 flex justify-center items-center">
            <LoadingSpinner message="Loading profile..." />
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="max-w-5xl mx-auto px-6 py-6">
            <ErrorAlert message={error} />
          </div>
        )}

        {/* Profile Content */}
        {!loading && !error && profileUser && (
          <>
            {/* Header Section */}
            <div className="bg-white shadow-sm">
              <div className="max-w-5xl mx-auto px-6 py-12 sm:py-16 md:pt-24 md:pb-4">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8">
                  {/* Profile Image */}
                  <div className="relative flex-shrink-0">
                    {profileUser.avatarUrl ? (
                      <img
                        src={profileUser.avatarUrl}
                        alt={`${profileUser.name}'s profile`}
                        className="w-24 sm:w-28 h-24 sm:h-28 rounded-full object-cover ring-4 ring-gray-100"
                      />
                    ) : (
                      <div className="w-24 sm:w-28 h-24 sm:h-28 bg-gray-100 rounded-full flex items-center justify-center ring-4 ring-gray-100">
                        <UserCircle className="w-16 h-16 text-gray-400" />
                      </div>
                    )}
                    {isOwnProfile && (
                      <button className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full hover:bg-blue-700 transition-colors shadow-lg">
                        <Edit className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}
                  </div>

                  {/* Profile Info */}
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <h1 className="text-2xl font-bold text-gray-900 mb-1">
                          {profileUser.name}
                        </h1>
                        {isOwnProfile ? (
                          <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors mb-3">
                            Add profile credential
                          </button>
                        ) : (
                          <div className="text-sm text-gray-500 mb-3">
                            {profileUser.email}
                          </div>
                        )}
                        <div className="flex justify-center sm:justify-start items-center gap-3 text-sm">
                          <div className="flex items-center gap-1.5 text-gray-700 font-medium">
                            <Users className="w-4 h-4" />
                            <span>{followers} followers</span>
                          </div>
                          <span className="text-gray-300">·</span>
                          <div className="text-gray-700 font-medium">
                            {following} following
                          </div>
                        </div>
                      </div>

                      {!isOwnProfile && (
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
                      )}
                    </div>

                    {isOwnProfile && (
                      <div className="mt-5">
                        <button className="text-sm text-gray-500 hover:text-gray-700 transition-colors">
                          Write a description about yourself
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Joined Date */}
                <div className="flex items-center gap-2 text-xs text-gray-500 mt-5 pt-4 border-t border-gray-100">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>
                    Joined:{" "}
                    {getJoinedDate(profileUser.createdAt) || "Unknown date"}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
              <div className="max-w-5xl mx-auto px-6">
                <div className="flex gap-8 overflow-x-auto scrollbar-hide">
                  {getTabs().map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 ${
                        activeTab === tab.id
                          ? "text-blue-600 border-blue-600"
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
              {/* Posts Tab */}
              {activeTab === "posts" && (
                <div className="space-y-4">
                  {userThreads.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                      <div className="flex justify-center mb-5">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <MessageSquare className="w-9 h-9 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No posts yet
                      </h3>
                      <p className="text-sm text-gray-600 mb-6 max-w-md mx-auto">
                        {isOwnProfile
                          ? "You haven't created any threads yet. Start contributing to the community."
                          : "This user hasn't created any threads yet."}
                      </p>
                      {isOwnProfile && (
                        <button
                          onClick={() => navigate("/create-thread")}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-colors shadow-sm"
                        >
                          Create Thread
                        </button>
                      )}
                    </div>
                  ) : (
                    userThreads.map((thread) => (
                      <div
                        key={thread.id}
                        className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-sm transition-shadow"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {thread.author?.avatarUrl ? (
                              <img
                                src={thread.author.avatarUrl}
                                alt={thread.author.name}
                                className="w-8 h-8 rounded-full"
                              />
                            ) : (
                              <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <UserCircle className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-800">
                                {thread.author?.name || "Anonymous"}
                              </div>
                              <div className="text-xs text-gray-500">
                                {formatDate(thread.createdAt)}
                              </div>
                            </div>
                          </div>
                        </div>

                        <h3
                          onClick={() => navigate(`/thread/${thread.id}`)}
                          className="text-base font-semibold text-gray-900 mb-2 leading-snug cursor-pointer hover:text-blue-600"
                        >
                          {thread.title}
                        </h3>

                        <p className="text-sm text-gray-700 leading-relaxed mb-3">
                          {thread.content.length > 150
                            ? `${thread.content.substring(0, 150)}...`
                            : thread.content}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {thread.category?.name && (
                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                              {thread.category.name}
                            </span>
                          )}

                          {thread.threadTags?.map((tt) => (
                            <span
                              key={tt.id}
                              className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                            >
                              #{tt.tag?.name}
                            </span>
                          ))}
                        </div>

                        {/* Post Actions */}
                        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-gray-100">
                          <button
                            onClick={() => handleUpvote(thread.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs hover:bg-green-100"
                          >
                            <ThumbsUp className="w-3.5 h-3.5" />
                            <span>{thread.upvotes || 0}</span>
                          </button>

                          <button
                            onClick={() => handleDownvote(thread.id)}
                            className="flex items-center gap-1 px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs hover:bg-red-100"
                          >
                            <ThumbsDown className="w-3.5 h-3.5" />
                            <span>{thread.downvotes || 0}</span>
                          </button>

                          <button
                            onClick={() => navigate(`/thread/${thread.id}`)}
                            className="flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-xs hover:bg-blue-100"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>{thread._count?.replies || 0}</span>
                          </button>

                          <div className="ml-auto text-xs text-gray-600">
                            <span
                              className={`font-semibold ${
                                thread.score > 0
                                  ? "text-green-600"
                                  : thread.score < 0
                                  ? "text-red-600"
                                  : ""
                              }`}
                            >
                              Score: {thread.score || 0}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Reposts Tab */}
              {activeTab === "reposts" && (
                <div className="space-y-4">
                  {userReposts.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                      <div className="flex justify-center mb-5">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
                          <Repeat className="w-9 h-9 text-gray-400" />
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        No reposts yet
                      </h3>
                      <p className="text-sm text-gray-600 max-w-md mx-auto">
                        {isOwnProfile
                          ? "You haven't reposted any threads yet."
                          : "This user hasn't reposted any threads yet."}
                      </p>
                    </div>
                  ) : (
                    userReposts.map((repost) => (
                      <div key={repost.id} className="mb-4">
                        <RepostBanner repost={repost} />
                        <div className="bg-white rounded-b-xl border border-t-0 border-gray-200 p-6 hover:shadow-sm transition-shadow">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {repost.thread.author?.avatarUrl ? (
                                <img
                                  src={repost.thread.author.avatarUrl}
                                  alt={repost.thread.author.name}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                  <UserCircle className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-800">
                                  {repost.thread.author?.name || "Anonymous"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {formatDate(repost.thread.createdAt)}
                                </div>
                              </div>
                            </div>
                            {isOwnProfile && (
                              <button
                                onClick={() => handleDeleteRepost(repost.id)}
                                className="text-xs text-gray-500 hover:text-red-600"
                              >
                                Remove repost
                              </button>
                            )}
                          </div>
                          <h3
                            onClick={() =>
                              navigate(`/thread/${repost.thread.id}`)
                            }
                            className="text-base font-semibold text-gray-900 mb-2 leading-snug cursor-pointer hover:text-blue-600"
                          >
                            {repost.thread.title}
                          </h3>
                          <p className="text-sm text-gray-700 leading-relaxed mb-3">
                            {repost.thread.content.length > 150
                              ? `${repost.thread.content.substring(0, 150)}...`
                              : repost.thread.content}
                          </p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {repost.thread.category?.name && (
                              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                                {repost.thread.category.name}
                              </span>
                            )}
                            {repost.thread.threadTags?.map((tt) => (
                              <span
                                key={tt.id}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium"
                              >
                                #{tt.tag?.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Replies Tab */}
              {activeTab === "replies" && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No replies yet
                  </h3>
                  <p className="text-sm text-gray-600">
                    {isOwnProfile
                      ? "You haven't replied to any threads yet."
                      : "This user hasn't replied to any threads yet."}
                  </p>
                </div>
              )}

              {/* Followers Tab */}
              {activeTab === "followers" && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {followers > 0
                      ? `${followers} Followers`
                      : "No followers yet"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {followers > 0
                      ? "Here are the people following this profile."
                      : `${
                          isOwnProfile ? "You don't" : "This user doesn't"
                        } have any followers yet.`}
                  </p>
                </div>
              )}

              {/* Following Tab */}
              {activeTab === "following" && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {following > 0
                      ? `Following ${following} users`
                      : "Not following anyone yet"}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {following > 0
                      ? "Here are the people this profile is following."
                      : `${
                          isOwnProfile ? "You're not" : "This user isn't"
                        } following anyone yet.`}
                  </p>
                </div>
              )}

              {/* Activity Tab */}
              {activeTab === "activity" && (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <div className="flex justify-center mb-4">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                      <Calendar className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Activity Feed
                  </h3>
                  <p className="text-sm text-gray-600">
                    Recent activity will appear here once available
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
