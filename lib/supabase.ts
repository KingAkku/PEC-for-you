import { createClient } from '@supabase/supabase-js';

// Access environment variables using Vite's import.meta.env
// We use a fallback to empty string to prevent crashes during build time,
// but the app will prompt for keys if they are missing at runtime.
// Cast import.meta to any to resolve TypeScript error regarding missing 'env' property
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing! Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env.local file.'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);