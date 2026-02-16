import Post from "../models/Post.model.js";
import {calculateDepthScore} from "../utils/depthScore.js";

export const createPost = async (req, res)=>{
    try {
        const {title, content, tags} = req.body;


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

export const publishPost = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id);

        if(!post) return res.status(404).json({message: "Post not found"})
        
        if(Date.now()< post.reflectionExpiresAt){
            return res.status(400).json({message: "reflection time not finished"});
        }

        post.isPublished = true;
        post.depthScore = calculateDepthScore(post);
        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}