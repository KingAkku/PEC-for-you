import { createClient } from '@supabase/supabase-js';

// Helper to safely access env vars in various environments
const getEnvVar = (key: string) => {
  // 1. Check process.env (Standard Node/Next.js/CRA)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  
  // 2. Check import.meta.env (Vite)
  // We use a try-catch and type casting to avoid build errors in environments 
  // that don't support import.meta syntax or types.
  try {
    const meta = (import.meta as any);
    if (meta && meta.env && meta.env[key]) {
      return meta.env[key];
    }
  } catch (e) {
    // Ignore ReferenceErrors or other issues
  }
  
  return '';
};

// Attempt to get credentials from common environment variable names
const supabaseUrl = 
  getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || 
  getEnvVar('VITE_SUPABASE_URL');

const supabaseAnonKey = 
  getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || 
  getEnvVar('VITE_SUPABASE_ANON_KEY');

// Fallback values to prevent the build from crashing if variables are missing.
// This allows the UI to render (albeit with connection errors) even if the 
// Supabase integration failed to provision.
const finalUrl = supabaseUrl || 'https://placeholder.supabase.co';
const finalKey = supabaseAnonKey || 'placeholder';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing! Using placeholder values. Check your Vercel project settings.');
}

export const supabase = createClient(finalUrl, finalKey);