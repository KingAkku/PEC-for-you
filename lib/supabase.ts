import { createClient } from '@supabase/supabase-js';

// Robustly retrieve environment variables in Vite
// We use (import.meta as any) to avoid TypeScript errors if the types aren't perfectly set up
const getEnvVar = (key: string) => {
  if (import.meta && (import.meta as any).env) {
    return (import.meta as any).env[key] || '';
  }
  return '';
};

const supabaseUrl = getEnvVar('VITE_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY');

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn(
    'Supabase credentials missing! Please check your .env.local file has VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.'
  );
}

// Initialize Supabase client
// We use fallback values ('https://placeholder.supabase.co') to prevent the app from crashing 
// immediately on load if keys are missing. This allows the UI to render and show specific 
// authentication errors to the user instead of a blank white screen.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder'
);