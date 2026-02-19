import bcrypt from "bcryptjs"
import User from "../models/User.model.js";
import {generateToken} from "../config/jwt.js";

export const registerService = async ({username, email, password})=>{
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new Error("User already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
        username,
        email,
        password:hashedPassword
    });

    const token = generateToken({id:user._id});

    return{
        token,
        user:{
            id:user._id,
            username:user.username,
            email: user.email,
            reputationScore:user.reputationScore,
            trustLevel:user.trustLevel
        }
    }
}