import Post from "../models/Post.model.js";
import {calculateDepthScore} from "../utils/depthScore.js";
import path from "path";
import { ENV } from "../config/env.js";
import supabase, { ensureBucketExists } from "../config/supabase.js";

export const createPost = async (req, res)=>{
    try {
        const {title, content, tags, imageUrl} = req.body;

        const safeContent = (content || "").trim();
        const safeTitle = (title || safeContent.slice(0, 80) || "Image post").trim();


        const post = await Post.create({
            author: req.user.id,
            title: safeTitle,
            content: safeContent || "",
            imageUrl: imageUrl || null,
            tags,
            reflectionExpiresAt: new Date(Date.now()+2*60*1000)// 2min
        });
        res.status(201).json(post);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const uploadPostImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Image file is required" });
        }

        if (!ENV.SUPABASE_SERVICE_ROLE_KEY) {
            return res.status(500).json({
                message: "SUPABASE_SERVICE_ROLE_KEY is required for server-side uploads",
            });
        }

        if (!supabase || !ENV.SUPABASE_BUCKET) {
            return res.status(500).json({
                message: "Supabase storage is not configured",
            });
        }

        await ensureBucketExists(ENV.SUPABASE_BUCKET);

        const fileExt = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
        const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fileExt)
            ? fileExt
            : ".jpg";
        const filePath = `posts/${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;

        const { error: uploadError } = await supabase.storage
            .from(ENV.SUPABASE_BUCKET)
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false,
            });

        if (uploadError) {
            return res.status(500).json({
                message: `Supabase upload failed: ${uploadError.message}`,
            });
        }

        const { data: publicData } = supabase.storage
            .from(ENV.SUPABASE_BUCKET)
            .getPublicUrl(filePath);

        return res.status(201).json({ imageUrl: publicData.publicUrl });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

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

export const getSinglePost = async(req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        .populate("author", "username reputationScore avatar")
        .populate("comments")

        if(!post) return res.status(404).json({message: "Post not found"})

        res.json(post);
    } catch (error) {
        res.status(500).json({message:error.message});
        
    }
}

export const toggleLikePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const userId = String(req.user.id);
        const hasLiked = post.likes.some((id) => String(id) === userId);

        if (hasLiked) {
            post.likes = post.likes.filter((id) => String(id) !== userId);
        } else {
            post.likes.push(req.user.id);
        }

        await post.save();

        return res.json({
            success: true,
            liked: !hasLiked,
            likesCount: post.likes.length,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};