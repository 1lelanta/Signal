import Post from "../models/Post.model.js";
import {calculateDepthScore} from "../utils/depthScore.js";

export const createPost = async (req, res)=>{
    try {
        const {title, content, tag} = req.body;


        const post = await Post.create({
            author: req.user.id,
            title,
            content,
            tags,
            reflectionExpiresAt: new Date(Date.now()+2*60*1000)// 2min
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}