import dotenv from 'dotenv';

dotenv.config();

const requiredEnv = [
    "PORT",
    "MONGO_URI",
    "JWT_SECRET",
]

requiredEnv.forEach((key)=>{
    if(!process.env[key]){
        throw new Error(`missing environment variable: ${key}`);

    }
});

export const ENV = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    JWT_SECRET:process.env.JWT_SECRET,
    CLIENT_URL:process.env.CLIENT_URL,
    // allow multiple client URLs via comma-separated env var CLIENT_URLS
    CLIENT_URLS: process.env.CLIENT_URLS
        ? process.env.CLIENT_URLS.split(',').map(s=>s.trim()).filter(Boolean)
        : (process.env.CLIENT_URL ? [process.env.CLIENT_URL] : []),
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    SUPABASE_PUBLISHABLE_KEY: process.env.SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_BUCKET: process.env.SUPABASE_BUCKET,

}