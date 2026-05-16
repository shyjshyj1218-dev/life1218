import { createClient } from "@supabase/supabase-js";

export function createSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    throw new Error(
      "SUPABASE_URL 또는 SUPABASE_SERVICE_ROLE_KEY가 .env.local에 설정되지 않았습니다."
    );
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
