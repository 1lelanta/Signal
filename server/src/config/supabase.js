import { createClient } from "@supabase/supabase-js";
import { ENV } from "./env.js";

let supabase = null;
const supabaseKey = ENV.SUPABASE_SERVICE_ROLE_KEY;

if (ENV.SUPABASE_URL && supabaseKey) {
  supabase = createClient(ENV.SUPABASE_URL, supabaseKey);
}

export const ensureBucketExists = async (bucketName) => {
  if (!supabase || !bucketName) {
    throw new Error("Supabase storage is not configured");
  }

  const { data: bucket, error: getBucketError } = await supabase.storage.getBucket(bucketName);
  if (bucket && !getBucketError) {
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucketName, {
    public: true,
  });

  if (createError && !String(createError.message || "").toLowerCase().includes("already")) {
    throw createError;
  }
};

export default supabase;
