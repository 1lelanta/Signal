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

}