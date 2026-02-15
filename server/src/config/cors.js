import cors from 'cors'

import { ENV } from './env.js'

const corsOptions = {
    origin:ENV.CLIENT_URL,
    credentials:true
};

export default cors(corsOptions)

