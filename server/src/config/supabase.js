import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env.js";

let supabase = null;

if (ENV.SUPABASE_URL && ENV.SUPABASE_SERVICE_ROLE_KEY) {
  supabase = createClient(ENV.SUPABASE_URL, ENV.SUPABASE_SERVICE_ROLE_KEY);
}

export default supabase;
