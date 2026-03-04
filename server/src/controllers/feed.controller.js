import Post from "../models/Post.model.js";

export const getFeed = async(req, res)=>{
    try {
        const posts = await Post.find({isPublished:true})
        .sort({depthScore:-1})
        .populate("author", "username reputationScore avatar");

        res.json(posts);

    } catch (error) {
        res.status(500).json({message:error.message})
    }
}