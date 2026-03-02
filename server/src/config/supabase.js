import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env.js";

let supabase = null;
const supabaseKey = ENV.SUPABASE_SERVICE_ROLE_KEY;

if (ENV.SUPABASE_URL && supabaseKey) {
  supabase = createClient(ENV.SUPABASE_URL, supabaseKey);
}

export default supabase;
