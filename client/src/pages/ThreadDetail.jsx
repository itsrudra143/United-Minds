import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { replyAPI, threadAPI, voteAPI } from "../utils/api";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorAlert from "../components/ErrorAlert";

export default function ThreadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [thread, setThread] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [replyText, setReplyText] = useState("");

  const requireAuth = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return false;
    }
    return true;
  };

  const load = async () => {
    try {
      setLoading(true);
      const [tRes, rRes] = await Promise.all([
        threadAPI.getById(id),
        replyAPI.getByThreadId(id),
      ]);
      setThread(tRes.data);
      setReplies(rRes.data.items || rRes.data);
      setError(null);
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to load thread."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  const handleUpvote = async () => {
    if (!requireAuth()) return;
    try {
      const res = await voteAPI.upvoteThread(id);
      setThread((prev) =>
        prev
          ? {
              ...prev,
              score: res.data.score,
              upvotes: res.data.upvotes,
              downvotes: res.data.downvotes,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvote = async () => {
    if (!requireAuth()) return;
    try {
      const res = await voteAPI.downvoteThread(id);
      setThread((prev) =>
        prev
          ? {
              ...prev,
              score: res.data.score,
              upvotes: res.data.upvotes,
              downvotes: res.data.downvotes,
            }
          : prev
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpvoteReply = async (replyId) => {
    if (!requireAuth()) return;
    try {
      const res = await voteAPI.upvoteReply(replyId);
      setReplies((prev) =>
        prev.map((reply) =>
          reply.id === replyId
            ? {
                ...reply,
                score: res.data.score,
                upvotes: res.data.upvotes,
                downvotes: res.data.downvotes,
              }
            : reply
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleDownvoteReply = async (replyId) => {
    if (!requireAuth()) return;
    try {
      const res = await voteAPI.downvoteReply(replyId);
      setReplies((prev) =>
        prev.map((reply) =>
          reply.id === replyId
            ? {
                ...reply,
                score: res.data.score,
                upvotes: res.data.upvotes,
                downvotes: res.data.downvotes,
              }
            : reply
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const submitReply = async () => {
    if (!requireAuth()) return;
    if (!replyText.trim()) return;
    try {
      await replyAPI.create({ thread_id: Number(id), content: replyText });
      setReplyText("");
      await load();
    } catch (err) {
      setError(
        err?.response?.data?.error || err?.message || "Failed to post reply."
      );
    }
  };

  if (loading) {
    return (
      <div className="w-full bg-gray-50 pt-24 min-h-screen flex items-center justify-center">
        <LoadingSpinner message="Loading thread..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full bg-gray-50 pt-24 min-h-screen flex items-center justify-center">
        <div className="max-w-lg w-full bg-white border border-gray-200 rounded-xl p-6">
          <ErrorAlert message={error} />
        </div>
      </div>
    );
  }

  if (!thread) return null;

  return (
    <div className="w-full bg-gray-50 pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <article className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <header className="mb-4">
            <h1 className="text-2xl font-bold text-gray-900">{thread.title}</h1>
            <div className="text-sm text-gray-600 mt-1">
              {thread.author?.name || "Anonymous"}
            </div>
          </header>

          <div className="prose max-w-none text-gray-800 mb-4">
            {thread.content}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {thread.category?.name && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
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

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
            <button
              onClick={handleUpvote}
              className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100"
            >
              <span className="text-lg">▲</span>
              <span>Upvote</span>
              <span className="bg-green-200 px-2 py-0.5 rounded-full text-xs">
                {thread.upvotes ?? 0}
              </span>
            </button>
            <button
              onClick={handleDownvote}
              className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-medium hover:bg-red-100"
            >
              <span className="text-lg">▼</span>
              <span>Downvote</span>
              <span className="bg-red-200 px-2 py-0.5 rounded-full text-xs">
                {thread.downvotes ?? 0}
              </span>
            </button>
            <div className="ml-auto flex items-center text-sm text-gray-700">
              <span className="font-medium">Score: </span>
              <span
                className={`ml-1 font-bold ${
                  thread.score > 0
                    ? "text-green-600"
                    : thread.score < 0
                    ? "text-red-600"
                    : ""
                }`}
              >
                {thread.score ?? 0}
              </span>
            </div>
          </div>
        </article>

        <section className="mt-6 bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Replies</h2>

          <div className="mb-4">
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={3}
              placeholder="Write a reply..."
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
            <div className="mt-2 flex justify-end">
              <button
                onClick={submitReply}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold"
              >
                Post Reply
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {replies.map((r) => (
              <div key={r.id} className="border border-gray-200 rounded-lg p-4">
                <div className="text-sm text-gray-600 mb-1">
                  {r.author?.name || "Anonymous"}
                </div>
                <div className="text-gray-800">{r.content}</div>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => handleUpvoteReply(r.id)}
                    className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded hover:bg-green-100"
                  >
                    ▲ Upvote
                    <span className="ml-1 bg-green-200 px-1.5 rounded-full">
                      {r.upvotes ?? 0}
                    </span>
                  </button>
                  <button
                    onClick={() => handleDownvoteReply(r.id)}
                    className="text-xs px-2 py-1 bg-red-50 text-red-700 rounded hover:bg-red-100"
                  >
                    ▼ Downvote
                    <span className="ml-1 bg-red-200 px-1.5 rounded-full">
                      {r.downvotes ?? 0}
                    </span>
                  </button>
                  <span
                    className={`text-xs ml-2 font-medium ${
                      r.score > 0
                        ? "text-green-600"
                        : r.score < 0
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    Score: {r.score ?? 0}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
