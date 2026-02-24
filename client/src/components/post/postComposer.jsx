import React, { useState } from "react";
import { useAuth } from "../../features/auth/useAuth";
import Button from "../ui/Button";

const PostComposer = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ content });
      setContent("");
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex space-x-4 items-start">
      <div className="flex-shrink-0">
        <img
          className="h-10 w-10 rounded-full bg-slate-700"
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
          alt={user.username}
        />
      </div>
      <form onSubmit={handleSubmit} className="flex-1">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none text-lg"
          rows="3"
          disabled={loading}
        />
        <div className="flex justify-end mt-2">
          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostComposer;