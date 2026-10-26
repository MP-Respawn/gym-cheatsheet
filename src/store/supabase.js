/*
 * supabase.js
 *
 * The one connection to the database (Supabase). Its address and public key
 * come from .env (VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY).
 *
 * The login is kept on the phone (persistSession) and renewed on its own
 * (autoRefreshToken). People sign in with a code typed into the app, never
 * by a link that comes back to the page, so the URL is not read for a login
 * (detectSessionInUrl: false); that also keeps it away from the #/ router.
 *
 * Only files in src/store/ import this.
 */
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: false } },
);
