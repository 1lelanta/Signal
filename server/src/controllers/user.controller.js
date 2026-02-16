import User from "../models/User.model.js";

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
        res.status(500).json({message, error.message});

    }
}

export const updateUserProfile = async(req,res)=>{
    try {
        const {bio, avatar, skills } = req.body;
        

        const user = await User.findById(req.user.id);

        if(!user){
            return res.status(404).json({message: "User not found"});
        }

        if(bio) user.bio = bio;
        if(avatar) user.avatar = avatar;
        if(skills) user.skills = skills;

        await user.save();

        res.json(user);
    } catch (error) {
        res.status(500).json({message: error.message})
        
    }
}