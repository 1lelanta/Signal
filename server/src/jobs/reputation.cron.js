import cron from "node-cron"
import User from "../models/User.model.js"

export const reputationJob = ()=>{
    cron.schedule("0 * * * *", async()=>{
        console.log("Running reputation recalculation...")

        const users = await User.find();

        for(let user of users){
            if(user.reputationScore>1000){
                user.trustLevel = "Expert";

            }
            else if(user.reputationScore>500){
                user.trustLevel = "trusted";
            }
            else{
                user.trustLevel = "newbie"
            }

            await user.save();
        }
        console.log("Reputation updated")
    })
}