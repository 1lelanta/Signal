import cors from 'cors'

import { ENV } from './env.js'

const allowedOrigins = [
  ENV.CLIENT_URL,
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5174",
].filter(Boolean);

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

