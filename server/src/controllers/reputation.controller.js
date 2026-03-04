import Reputation from "../models/Reputation.model.js";
import User from "../models/User.model.js"
import { calculateReputation } from "../utils/calculateReputation.js";


export const updateReputation = async(userId, points, reason,sourceType,sourceId )=>{
    
    await Reputation.create({
        user:userId,
        points,
        reason,
        sourceType,
        sourceId
    })

    const user = await User.findById(userId);
    if(!user) throw new Error("User not found");

    const calculation = await calculateReputation(user._id);
    user.reputationScore = calculation.score;

    if (user.reputationScore > 1000) {
        user.trustLevel = "Expert";
    } else if (user.reputationScore > 500) {
        user.trustLevel = "trusted";
    } else {
        user.trustLevel = "newbie";
    }

    await user.save();

    return {
        score: calculation.score,
        eventsCount: calculation.eventsCount,
        breakdown: calculation.breakdown,
        trustLevel: user.trustLevel,
    };
}

export const getReputation = async (userId) => {
    const user = await User.findById(userId).select("reputationScore trustLevel");
    if(!user) throw new Error("User not found");

    const calculation = await calculateReputation(user._id);

    if (user.reputationScore !== calculation.score) {
        user.reputationScore = calculation.score;

        if (user.reputationScore > 1000) {
            user.trustLevel = "Expert";
        } else if (user.reputationScore > 500) {
            user.trustLevel = "trusted";
        } else {
            user.trustLevel = "newbie";
        }

        await user.save();
    }

    return {
        score: calculation.score,
        eventsCount: calculation.eventsCount,
        breakdown: calculation.breakdown,
        trustLevel: user.trustLevel,
    };
}