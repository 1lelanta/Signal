import Comment from "../models/Comment.model.js";
import path from "path";
import { ENV } from "../config/env.js";
import supabase, { ensureBucketExists } from "../config/supabase.js";

export const addComment = async(req,res)=>{
    try {
        const {content, type, parentCommentId, imageUrl} = req.body;

        const safeContent = String(content || "").trim();
        const safeImageUrl = String(imageUrl || "").trim();
        if (!safeContent && !safeImageUrl) {
            return res.status(400).json({ message: "Comment content or image is required" });
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
            content: safeContent || "",
            imageUrl: safeImageUrl || null,
            type: type || "expansion",
        })

        const populatedComment = await Comment.findById(comment._id)
            .populate("author", "username avatar");

        res.status(201).json(populatedComment);

    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}

export const getCommentsByPost = async (req, res) => {
    try {
        const comments = await Comment.find({ post: req.params.postId })
            .sort({ createdAt: 1 })
            .populate("author", "username avatar");

        res.json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadCommentImage = async (req, res) => {
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

        const filePath = `comments/${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;

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