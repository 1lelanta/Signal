import { useState } from "react";
import { Link } from "react-router-dom";
import DepthScoreBadge from "./DepthScoreBadge";
import Button from "../ui/Button";
import api from "../../services/axios";
import { useAuth } from "../../features/auth/useAuth";

const PostCard = ({post})=>{
    const { user } = useAuth();
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [commentMessage, setCommentMessage] = useState("");

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const content = commentText.trim();
        if (!content) return;

        try {
            setIsSubmitting(true);
            setCommentMessage("");
            await api.post(`/comments/${post._id}`, {
                content,
                type: "expansion",
            });
            setCommentText("");
            setCommentMessage("Comment posted");
        } catch (err) {
            setCommentMessage(err?.response?.data?.message || "Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    return(
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-purple-600/40 transition duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-3">
                <Link to={`/profile/${post.author._id}`} 
                className="text-sm font-medium text-slate-300 hover:text-purple-400 break-all">
                    {post.author.username}
                </Link>
                <p className="text-xs text-slate-500 sm:text-right">
                    Reputation {post.author.reputationScore}
                </p>
            </div>
            <DepthScoreBadge score={post.depthScore}/>

            {/* content */}

            <Link to={`/post/${post._id}`}>
            <p className="text-slate-200 leading-relaxed text-sm mb-4 break-words">
                {post.content}
            </p>
            {post.imageUrl && (
                <img
                    src={post.imageUrl}
                    alt="Post"
                    className="w-full max-h-96 object-cover rounded-lg border border-slate-700 mb-4"
                />
            )}
            </Link>

            <div className="mt-3 border-t border-slate-800 pt-3">
                {user ? (
                    <form onSubmit={handleCommentSubmit} className="space-y-2">
                        <input
                            type="text"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <div className="flex items-center justify-between gap-2">
                            <span className="text-xs text-slate-400">Share your thoughts on this post</span>
                            <Button type="submit" disabled={isSubmitting || !commentText.trim()} className="!bg-blue-600 hover:!bg-blue-700 !text-white border-0">
                                {isSubmitting ? "Posting..." : "Comment"}
                            </Button>
                        </div>
                    </form>
                ) : (
                    <p className="text-xs text-slate-400">Log in to comment on this post.</p>
                )}
                {commentMessage && <p className="text-xs text-slate-300 mt-2">{commentMessage}</p>}
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-slate-500">
                <span>{post.commentCount} discussions</span>
                <span>{post.uniqueParticipant} thinkers</span>

            </div>

        </div>
    )
}

export default PostCard