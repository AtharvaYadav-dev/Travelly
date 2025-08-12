import { createClient } from '@supabase/supabase-js';

// Read from Vite env variables. Ensure these are provided in .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Provide a safe fallback instead of throwing to keep the app booting
function createFallbackSupabase() {
  const warn = (method) => {
    console.error(
      `[Supabase] Not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env before using ${method}.`
    );
  };
  const noSession = async () => ({ data: { session: null }, error: null });
  const ok = async () => ({ data: null, error: null });
  const err = async (method) => {
    warn(method);
    return { data: null, error: new Error('Supabase not configured') };
  };
  return {
    auth: {
      getSession: noSession,
      onAuthStateChange: (_cb) => ({ data: { subscription: { unsubscribe() {} } } }),
      signInWithPassword: () => err('auth.signInWithPassword'),
      signOut: ok,
    },
    from: () => ({
      select: () => err('from().select'),
      insert: () => err('from().insert'),
      update: () => err('from().update'),
      delete: () => err('from().delete'),
      eq: () => ({ select: () => err('from().eq().select') }),
    }),
  };
}

export const supabase =
  isSupabaseConfigured
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createFallbackSupabase();
