import { createClient } from "@supabase/supabase-js";

// Initialize Supabase Admin Client (for DB writes & Storage uploads)
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);