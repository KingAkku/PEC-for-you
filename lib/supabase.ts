import { createClient } from '@supabase/supabase-js';

// Helper to safely access env vars in various environments (Vite, Next.js, CRA)
const getEnvVar = (key: string) => {
  // 1. Check process.env (Next.js / Node / Polyfilled environments)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // 2. Check import.meta.env (Vite standard)
  // Cast import.meta to any to avoid TS errors if types aren't set up
  const meta = import.meta as any;
  if (typeof meta !== 'undefined' && meta.env && meta.env[key]) {
    return meta.env[key];
  }
  return '';
};

// Vercel automatically injects NEXT_PUBLIC_ variables. 
// We check for those first, then fallback to VITE_ for local development.
const supabaseUrl = 
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 
  getEnvVar('VITE_SUPABASE_URL');

const supabaseAnonKey = 
  getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing! If you are on Vercel, ensure the project is connected to Supabase.'
  );
}

export const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '');