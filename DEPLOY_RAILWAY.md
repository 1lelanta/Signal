# Deploying Signal to Railway

This file describes a minimal, reproducible way to deploy the repository to Railway as two services: `server` (Node API) and `client` (static site served by Nginx).

Overview
- Create two Railway services: one for the `server` (use the `server` folder / Dockerfile) and one for the `client` (use the `client` folder / Dockerfile).

Server service
- Root: `server/` (use the included `server/Dockerfile`).
- Build: Railway will build the Dockerfile which runs `npm start`. The server reads `PORT` at runtime.
- Required environment variables (set these in Railway Settings → Variables):
  - `PORT` (e.g. `5000`) — Railway sets a runtime port automatically, but providing `5000` is fine.
  - `MONGO_URI` — connection string for your MongoDB instance (Railway addon, Atlas, or external). Example: `mongodb+srv://user:pass@cluster0.mongodb.net/dbname`
  - `JWT_SECRET` — secret for signing tokens
  - `CLIENT_URL` — the deployed client URL (e.g. `https://<your-client>.up.railway.app`) so CORS/socket origin works
  - Optional Supabase vars if you use Supabase storage: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `SUPABASE_ANON_KEY`, `SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_BUCKET`

Client service
- Root: `client/` (use the included `client/Dockerfile`). It builds the Vite app and serves it with Nginx.
- Important: the Vite build embeds the API URL at build time. Configure the build ARG / environment variable in Railway:
  - Build variable: `VITE_API_URL` set to the server's public URL (for example: `https://<your-server>.up.railway.app`).
  - Alternatively, you can set `CLIENT_URL` in the server to match the final client URL.

How to deploy
1. Create a new project on Railway.
2. Add a service and connect using the `server/` folder. Use Dockerfile or the Node template and point to `server`.
3. In the server service settings, add the required environment variables listed above.
4. Add a second service and connect using the `client/` folder. In the build settings for the client service, add the build ARG / environment variable `VITE_API_URL` with the server URL.
5. Trigger deploys from Railway UI or push to your Git repo branch connected to Railway.

Seeding data
- To seed test data you can run the `seed:test-data` script. Options:
  - Locally: set `MONGO_URI` in `server/.env` to point at the Railway MongoDB, then run from the `server/` folder:

```bash
cd server
npm run seed:test-data
```

  - On Railway: open the server service shell (Railway plugin / web shell) and run the same command inside the container. Ensure the runtime environment variables are set in Railway.

Notes and troubleshooting
- CORS: the server currently restricts origins to HTTP only (development) — update `server/src/config/cors.js` if you want to allow HTTPS origins for production.
- Socket.IO: server uses `ENV.CLIENT_URL` for socket CORS; make sure `CLIENT_URL` matches the deployed client address.
- Do NOT commit production secrets to the repo. Use Railway environment variables.

If you want, I can:
- create a Railway-specific example `railway.env.example` (without secrets),
- add a small script to perform Seeding from within a running container,
- or change CORS to allow HTTPS origins in production (recommended for public deployments).
