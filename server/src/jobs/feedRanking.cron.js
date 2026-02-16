import cron from "node-cron"
import Post from "../models/Post.model.js"

export const feedRankingJob = ()=>{
    cron.schedule("*/30 * * * *", async ()=>{
        console.log("Re-ranking feed");

        const posts = await Post.find({isPublished:true});

        for(let post of posts){
            const score = post.valueTags.insightful*5 +
            post.valueTags.wellResearched*4 + post.valueTags.practical*3+
            post.valueTags.practical*3+
            post.valueTags.challenging *4+
            post.valueTags.constructive*2;

            post.depthScore = score;

            await post.save();

        }
        console.log("Feed ranking updated")
    })
}