import cors from 'cors'

import { ENV } from './env.js'

const allowedOriginsRaw = [
    // include any individual client URL set in ENV.CLIENT_URL
    ENV.CLIENT_URL,
    // include list of client URLs if provided via CLIENT_URLS
    ...(ENV.CLIENT_URLS || []),
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5174",
].filter(Boolean);

// Allow both http and https origins (Vercel and other https hosts)
const allowedOrigins = allowedOriginsRaw; // keep any provided origins

const corsOptions = {
    origin(origin, callback) {
        if (!origin) {
            return callback(null, true);
        }

        const isAllowed =
            allowedOrigins.includes(origin) ||
            /^https?:\/\/(localhost|127\.0\.0\.1):(5173|5174|5175)$/.test(origin);

        if (isAllowed) {
            return callback(null, true);
        }

        return callback(new Error("Not allowed by CORS"));
    },
    credentials:true
};

export default cors(corsOptions)

