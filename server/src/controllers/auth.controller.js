import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../config/jwt.js";
import { asyncHandler } from "../middleware/asyncHandler.js";

/**
 * @desc    Register new user
 * @route   POST /api/auth/register
 * @access  Public
 */

export const registerUser = asyncHandler(async(req,res)=>{
    const {username, email, password} = req.body;

    if(!username || !email || !password){
        res.status(400);
        throw new Error("All fields are required")
        
    }
    

    const existingUser  = await User.findOne({email});
    if(existingUser){
        res.status(400);
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        username,
        email,
        password:hashedPassword
    })

    res.status(201).json({
        success:true,
        token,
        user: {
            id: user._id,
            username: user.username,
            email: user.email,
            reputationScore: user.reputationScore,
            trustLevel: user.trustLevel,
        }
    })
})