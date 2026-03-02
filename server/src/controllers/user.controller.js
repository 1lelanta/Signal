import User from "../models/User.model.js";
import path from "path";
import { ENV } from "../config/env.js";
import supabase, { ensureBucketExists } from "../config/supabase.js";

export const getUserProfile = async(req, res)=>{
    try {
        const user = await User.findById(req.params.id)
        .select("-password")
        .populate("skills")

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({message:error.message});

    }
}

export const updateUserProfile = async(req,res)=>{
    try {
        const { username, bio, avatar, skills } = req.body;
        

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if (username !== undefined) {
            const nextUsername = String(username).trim();
            if (!nextUsername) {
                return res.status(400).json({ message: "Username cannot be empty" });
            }

            const existing = await User.findOne({ username: nextUsername, _id: { $ne: user._id } });
            if (existing) {
                return res.status(400).json({ message: "Username already taken" });
            }
            user.username = nextUsername;
        }

        if (bio !== undefined) user.bio = String(bio || "").trim();
        if (avatar !== undefined) user.avatar = String(avatar || "").trim();

        if (skills !== undefined) {
            const normalizedSkills = Array.isArray(skills)
                ? skills
                    .map((entry) => {
                        if (typeof entry === "string") {
                            const skillName = entry.trim();
                            if (!skillName) return null;
                            return { skill: skillName, score: 0 };
                        }

                        if (entry && typeof entry === "object") {
                            const skillName = String(entry.skill || "").trim();
                            if (!skillName) return null;
                            return { skill: skillName, score: Number(entry.score || 0) };
                        }

                        return null;
                    })
                    .filter(Boolean)
                : [];

            user.skills = normalizedSkills;
        }

        await user.save();

        const safeUser = await User.findById(user._id).select("-password");
        res.json(safeUser);
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}

export const uploadUserAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Avatar image file is required" });
        }

        if (!ENV.SUPABASE_SERVICE_ROLE_KEY) {
            return res.status(500).json({
                message: "SUPABASE_SERVICE_ROLE_KEY is required for server-side uploads",
            });
        }

        if (!supabase || !ENV.SUPABASE_BUCKET) {
            return res.status(500).json({ message: "Supabase storage is not configured" });
        }

        await ensureBucketExists(ENV.SUPABASE_BUCKET);

        const fileExt = path.extname(req.file.originalname || "").toLowerCase() || ".jpg";
        const safeExt = [".jpg", ".jpeg", ".png", ".webp", ".gif"].includes(fileExt)
            ? fileExt
            : ".jpg";
        const filePath = `avatars/${req.user.id}/${Date.now()}-${Math.random().toString(36).slice(2)}${safeExt}`;

        const { error: uploadError } = await supabase.storage
            .from(ENV.SUPABASE_BUCKET)
            .upload(filePath, req.file.buffer, {
                contentType: req.file.mimetype,
                upsert: false,
            });

        if (uploadError) {
            return res.status(500).json({ message: `Supabase upload failed: ${uploadError.message}` });
        }

        const { data: publicData } = supabase.storage
            .from(ENV.SUPABASE_BUCKET)
            .getPublicUrl(filePath);

        return res.status(201).json({ avatarUrl: publicData.publicUrl });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};