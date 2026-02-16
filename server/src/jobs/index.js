import { reputationJob } from "./reputation.cron.js";
import { feedRankingJob } from "./feedRanking.cron.js";
import { cleanupJob } from "./cleanup.cron.js";


export const initJobs = ()=>{
    reputationJob();
    feedRankingJob();
    cleanupJob();
}