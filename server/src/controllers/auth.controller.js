import bcrypt from "bcryptjs";
import User from "../models/User.model.js";
import { generateToken } from "../config/jwt.js";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { registerService } from "../services/auth.service.js";

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
    const data = await registerService({username,email, password});

    res.status(201).json({
        success:true,
        ...data,
    })
})

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */

export const loginUser = asyncHandler(async (req,res)=>{
    const {email, password} = req.body;

    if(!email || !password){
        res.status(400);
        throw new Error("email and password are required");
    }

    const user  = await User.findOne({email})

    if(!user){
        res.status(401);
        throw new Error("Invalid credentials")
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch){
        res.status(401);
        throw new Error("Invalid credentials");
    }

    const token = generateToken({id:user._id});

    res.json({
        success:true,
        token,
        user:{
            id:user._id,
            username:user.username,
            email:user.email,
            reputationScore:user.reputationScore,
            trustLevel:user.trustLevel
        }
    })
})

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */

export const getMe = asyncHandler(async (req,res)=>{
    const user = await User.findById(req.user.id).select("-password");
    if(!user){
        res.status(404);
        throw new Error("User not found");
    }

    res.json({
        success:true,
        user
    })
})