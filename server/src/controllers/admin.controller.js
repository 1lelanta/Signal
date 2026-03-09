import User from "../models/User.model.js";
import Post from "../models/Post.model.js";

export const listUsers = async (req, res) => {
    try{
        const users = await User.find({}).select("_id username email trustLevel createdAt").sort({createdAt:-1}).lean();
        return res.json({ success:true, users });
    }catch(err){
        return res.status(500).json({ success:false, message: err.message });
    }
}

export const updateUserTrust = async (req, res) => {
    try{
        const { userId } = req.params;
        const { trustLevel } = req.body;
        if(!trustLevel) return res.status(400).json({ success:false, message: "trustLevel required" });

        const allowed = ["newbie","trusted","Expert","moderator"];
        if(!allowed.includes(trustLevel)) return res.status(400).json({ success:false, message: "invalid trustLevel" });

        const user = await User.findByIdAndUpdate(userId, { trustLevel }, { new:true }).select("_id username email trustLevel createdAt");
        if(!user) return res.status(404).json({ success:false, message: "user not found" });
        return res.json({ success:true, user });
    }catch(err){
        return res.status(500).json({ success:false, message: err.message });
    }
}

export const listPosts = async (req, res) => {
    try{
        const posts = await Post.find({}).populate("author", "_id username avatar").sort({createdAt:-1}).lean();
        return res.json({ success:true, posts });
    }catch(err){
        return res.status(500).json({ success:false, message: err.message });
    }
}

export const deletePost = async (req, res) => {
    try{
        const { postId } = req.params;
        const post = await Post.findByIdAndDelete(postId);
        if(!post) return res.status(404).json({ success:false, message: "post not found" });
        return res.json({ success:true, message: "post deleted" });
    }catch(err){
        return res.status(500).json({ success:false, message: err.message });
    }
}
