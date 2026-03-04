import Comment from "../models/Comment.model.js";
import Post from "../models/Post.model.js";

export const addComment = async(req,res)=>{
    try {
        const {content, type} = req.body;

        const comment  = await Comment.create({
            post:req.params.postId,
            author:req.user.id,
            content,
            type,
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
            .sort({ createdAt: -1 })
            .populate("author", "username");

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};