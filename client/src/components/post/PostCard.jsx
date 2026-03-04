import { useState } from "react";
import { Link } from "react-router-dom";
import Button from "../ui/Button";
import api from "../../services/axios";
import { useAuth } from "../../features/auth/useAuth";

const getInitials = (name = "User") => {
    const parts = String(name).trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    return (parts[0] || "U").slice(0, 2).toUpperCase();
};

const PostCard = ({post})=>{
    const { user } = useAuth();
    const userId = user?._id || user?.id;
    const initialLikes = Array.isArray(post?.likes) ? post.likes : [];
    const initialReposts = Array.isArray(post?.reposts) ? post.reposts : [];
    const [liked, setLiked] = useState(
        !!userId && initialLikes.some((id) => String(id) === String(userId))
    );
    const [likesCount, setLikesCount] = useState(initialLikes.length);
    const [liking, setLiking] = useState(false);
    const [reposted, setReposted] = useState(
        !!userId && initialReposts.some((id) => String(id) === String(userId))
    );
    const [repostsCount, setRepostsCount] = useState(initialReposts.length);
    const [reposting, setReposting] = useState(false);
    const [showCommentInput, setShowCommentInput] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isReplySubmitting, setIsReplySubmitting] = useState(false);
    const [commentMessage, setCommentMessage] = useState("");
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(false);
    const [commentsLoaded, setCommentsLoaded] = useState(false);
    const [activeReplyId, setActiveReplyId] = useState(null);
    const [replyText, setReplyText] = useState("");

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const res = await api.get(`/comments/post/${post._id}`);
            setComments(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            setComments([]);
        } finally {
            setCommentsLoading(false);
            setCommentsLoaded(true);
        }
    };

    const toggleComments = async () => {
        const next = !showCommentInput;
        setShowCommentInput(next);
        if (next && !commentsLoaded) {
            await fetchComments();
        }
    };

    const handleLikeToggle = async () => {
        if (!userId) {
            setCommentMessage("Please log in to like posts.");
            return;
        }

        try {
            setLiking(true);
            const res = await api.post(`/posts/${post._id}/like`);
            setLiked(!!res.data?.liked);
            setLikesCount(Number(res.data?.likesCount || 0));
        } catch (err) {
            setCommentMessage(err?.response?.data?.message || "Failed to update like");
        } finally {
            setLiking(false);
        }
    };

    const handleRepostToggle = async () => {
        if (!userId) {
            setCommentMessage("Please log in to repost.");
            return;
        }

        try {
            setReposting(true);
            const res = await api.post(`/posts/${post._id}/repost`);
            setReposted(!!res.data?.reposted);
            setRepostsCount(Number(res.data?.repostsCount || 0));
        } catch (err) {
            setCommentMessage(err?.response?.data?.message || "Failed to repost");
        } finally {
            setReposting(false);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        const content = commentText.trim();
        if (!content) return;

        try {
            setIsSubmitting(true);
            setCommentMessage("");
            const res = await api.post(`/comments/${post._id}`, {
                content,
                type: "expansion",
            });
            setCommentText("");
            setCommentMessage("Comment posted");
            if (res?.data) {
                setComments((prev) => [res.data, ...prev]);
            }
        } catch (err) {
            setCommentMessage(err?.response?.data?.message || "Failed to post comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleReplySubmit = async (e, parentCommentId) => {
        e.preventDefault();
        const content = replyText.trim();
        if (!content) return;

        try {
            setIsReplySubmitting(true);
            setCommentMessage("");
            const res = await api.post(`/comments/${post._id}`, {
                content,
                type: "expansion",
                parentCommentId,
            });

            if (res?.data) {
                setComments((prev) => [...prev, res.data]);
            }
            setReplyText("");
            setActiveReplyId(null);
            setCommentMessage("Reply posted");
        } catch (err) {
            setCommentMessage(err?.response?.data?.message || "Failed to post reply");
        } finally {
            setIsReplySubmitting(false);
        }
    };

    const getReplies = (parentId) =>
        comments.filter((comment) => String(comment.parentComment || "") === String(parentId));

    const renderCommentItem = (comment, level = 0) => {
        const replies = getReplies(comment._id);

        return (
            <div key={comment._id} className="space-y-2" style={{ marginLeft: `${Math.min(level, 3) * 16}px` }}>
                <div className="bg-slate-800/70 border border-slate-700 rounded-md px-3 py-2">
                    <p className="text-xs text-slate-400">{comment.author?.username || "User"}</p>
                    <p className="text-sm text-slate-200 mt-1 break-words">{comment.content}</p>
                    <button
                        type="button"
                        onClick={() => {
                            if (activeReplyId === comment._id) {
                                setActiveReplyId(null);
                                setReplyText("");
                                return;
                            }
                            setActiveReplyId(comment._id);
                            setReplyText("");
                        }}
                        className="mt-2 text-xs text-purple-300 hover:text-purple-200"
                    >
                        Reply
                    </button>
                </div>

                {activeReplyId === comment._id && user && (
                    <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="relative">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write a reply..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 pr-20 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Button
                            type="submit"
                            disabled={isReplySubmitting || !replyText.trim()}
                            className="!bg-blue-600 hover:!bg-blue-700 !text-white border-0 !px-3 !py-1.5 absolute right-1 top-1/2 -translate-y-1/2"
                        >
                            {isReplySubmitting ? "..." : "Post"}
                        </Button>
                    </form>
                )}

                {replies.length > 0 && (
                    <div className="space-y-2">
                        {replies.map((reply) => renderCommentItem(reply, level + 1))}
                    </div>
                )}
            </div>
        );
    };

    const topLevelComments = comments.filter((comment) => !comment.parentComment);

    return(
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 sm:p-5 hover:border-purple-600/40 transition duration-300">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 mb-3">
                <Link to={`/profile/${post.author._id}`} className="inline-flex items-center gap-2 min-w-0">
                    {post.author?.avatar ? (
                        <img
                            src={post.author.avatar}
                            alt={post.author.username}
                            className="h-8 w-8 rounded-full object-cover border border-slate-700"
                        />
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-slate-700 border border-slate-600 text-xs text-slate-200 font-semibold flex items-center justify-center">
                            {getInitials(post.author?.username)}
                        </div>
                    )}
                    <span className="text-sm font-medium text-slate-300 hover:text-purple-400 break-all">
                        {post.author.username}
                    </span>
                </Link>
                <p className="text-xs text-slate-500 sm:text-right">
                    Reputation {post.author.reputationScore}
                </p>
            </div>
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
                <div className="flex items-center gap-6 sm:gap-8">
                    <button
                        type="button"
                        onClick={handleLikeToggle}
                        disabled={liking}
                        className={`text-sm font-medium transition ${liked ? "text-blue-400" : "text-slate-300 hover:text-blue-400"}`}
                        aria-label="Like post"
                        title="Like"
                    >
                        {liking ? "..." : "Like"} {likesCount}
                    </button>

                    <button
                        type="button"
                        onClick={handleRepostToggle}
                        disabled={reposting}
                        className={`text-sm font-medium transition ${reposted ? "text-green-400" : "text-slate-300 hover:text-green-400"}`}
                        aria-label="Repost"
                        title="Repost"
                    >
                        {reposting ? "..." : "Repost"} {repostsCount}
                    </button>

                    <button
                        type="button"
                        onClick={toggleComments}
                        className="text-sm text-slate-300 hover:text-purple-400 font-medium"
                        aria-label="Toggle comment input"
                        title="Comment"
                    >
                        Comment
                    </button>
                </div>

                {showCommentInput && (
                    user ? (
                        <form onSubmit={handleCommentSubmit} className="mt-2">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    placeholder="Write a comment..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 pr-20 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || !commentText.trim()}
                                    className="!bg-blue-600 hover:!bg-blue-700 !text-white border-0 !px-3 !py-1.5 absolute right-1 top-1/2 -translate-y-1/2"
                                    aria-label="Submit comment"
                                >
                                    {isSubmitting ? "..." : "Post"}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <p className="text-xs text-slate-400 mt-2">Log in to comment on this post.</p>
                    )
                )}
                {showCommentInput && (
                    <>
                        {commentMessage && <p className="text-xs text-slate-300 mt-2">{commentMessage}</p>}

                        <div className="mt-3 space-y-2">
                            {commentsLoading ? (
                                <p className="text-xs text-slate-400">Loading comments...</p>
                            ) : topLevelComments.length > 0 ? (
                                topLevelComments.map((comment) => renderCommentItem(comment))
                            ) : (
                                <p className="text-xs text-slate-400">No comments yet.</p>
                            )}
                        </div>
                    </>
                )}
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