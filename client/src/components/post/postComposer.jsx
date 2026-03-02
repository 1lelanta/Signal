import React, { useState } from "react";
import { useAuth } from "../../features/auth/useAuth";
import Button from "../ui/Button";

const PostComposer = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview("");
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      await onSubmit({ content, imageFile });
      setContent("");
      clearImage();
    } catch (error) {
      console.error("Failed to create post", error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 sm:p-4 flex gap-2 sm:gap-4 items-start">
      <div className="flex-shrink-0">
        <img
          className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-slate-700"
          src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.username}`}
          alt={user.username}
        />
      </div>
      <form onSubmit={handleSubmit} className="flex-1 min-w-0">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening?"
          className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none resize-none text-base sm:text-lg"
          rows="3"
          disabled={loading}
        />
        {imagePreview && (
          <div className="mt-3 relative">
            <img
              src={imagePreview}
              alt="Selected preview"
              className="max-h-64 w-full object-cover rounded-lg border border-slate-700"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute top-2 right-2 text-xs bg-slate-900/80 hover:bg-slate-900 text-slate-100 px-2 py-1 rounded"
            >
              Remove
            </button>
          </div>
        )}
        <div className="flex justify-end mt-2">
          <label className="mr-2 inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition bg-slate-800 hover:bg-slate-700 text-slate-200 cursor-pointer">
            Add Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              disabled={loading}
            />
          </label>
          <Button type="submit" disabled={loading || !content.trim()}>
            {loading ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default PostComposer;