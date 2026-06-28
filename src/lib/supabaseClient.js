import { createClient } from "@supabase/supabase-js";

// Publishable (anon) key — safe in the client by design; RLS is the boundary.
// Reads require an authenticated session (the /admin dashboard logs in).
export const supabase = createClient(
  "https://hzsilbjojgqxmzwehvrp.supabase.co",
  "sb_publishable_UHMPzEURH0mOSXucu5_AlA_ICJPkMaR",
);
