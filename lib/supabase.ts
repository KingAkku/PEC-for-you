import { createClient } from '@supabase/supabase-js';

// Robustly retrieve environment variables
const getEnvVar = (key: string) => {
  // 1. Check import.meta.env (Vite standard)
  if (import.meta && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  
  // 2. Check process.env (Next.js / Compatibility mode)
  // Wrapped in try-catch because accessing 'process' can throw in some strict browser environments
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore
  }

  return '';
};

// Use the specific keys requested by the user
const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing! Please check your .env.local file has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

// Initialize Supabase client
// We use fallback values ('https://placeholder.supabase.co') to prevent the app from crashing 
// immediately on load if keys are missing.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);