import cron from "node-cron";
import Post from "../models/Post.model.js";

export const cleanupJob = ()=>{
    cron.schedule("0 3 * * * *", async ()=>{
        console.log("cleaning old drafts...");

        await Post.deleteMany({
            isPublished:false,
            createdAt:{$lt: new Date(Date.now()-24*60*60*1000)}
        })
        console.log("Old drafts cleaned")
    })
}