import Reputation from "../models/Reputation.model.js";
import User from "../models/User.model.js"


export const updateReputation = async(userId, points, reason,sourceType,sourceId )=>{
    
    await Reputation.create({
        user:userId,
        points,
        reason,
        sourceType,
        sourceId
    })

    const user = await User.findById(userId);
    user.reputationScore +=points;
    await user.save();
}