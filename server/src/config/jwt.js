import jwt from "jsonwebtoken";
import { ENV } from "./env";


export const generateToken = (payload)=>{
    return jwt.sign(payload, ENV.JWT_SECRET, {
        expiresIn: "7d",
    })
}

export const verifyToken = (token)=>{
    return jwt.verify(token, ENV,JWT_SECRET);
}