export const authorizeRoles = (...roles)=>{
    return (req, res,next)=>{
        if(!roles.includes(req.user.trustLevel)){
            return res.status(403).json({
                message: "access denied: insufficient permissions"
            })
        }
        next();
    }
}