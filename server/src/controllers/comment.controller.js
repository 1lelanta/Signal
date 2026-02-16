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

        res.status(201).json(comment);

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}