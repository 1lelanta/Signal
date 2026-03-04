import Comment from "../models/Comment.model.js";
import Post from "../models/Post.model.js";

export const addComment = async(req,res)=>{
    try {
        const {content, type, parentCommentId} = req.body;

        const safeContent = String(content || "").trim();
        if (!safeContent) {
            return res.status(400).json({ message: "Comment content is required" });
        }

        let parentComment = null;
        if (parentCommentId) {
            parentComment = await Comment.findById(parentCommentId).select("_id post");
            if (!parentComment) {
                return res.status(404).json({ message: "Parent comment not found" });
            }

            if (String(parentComment.post) !== String(req.params.postId)) {
                return res.status(400).json({ message: "Parent comment must belong to same post" });
            }
        }

        const comment  = await Comment.create({
            post:req.params.postId,
            author:req.user.id,
            parentComment: parentComment?._id || null,
            content: safeContent,
            type: type || "expansion",
        })

        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "username");

        res.status(201).json(populatedComment);

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}

export const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: 1 })
            .populate("author", "username");

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};