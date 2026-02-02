
import { createClient } from '@supabase/supabase-js';

// CLIENT-SIDE SINGLETON
// We initialize the Supabase client once here.

const getEnvVar = (key: string) => {
  // 1. Check for Vite-style env vars (import.meta.env)
  try {
    if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
      return (import.meta as any).env[key];
    }
  } catch (e) {}
  
  // 2. Check for Standard/Next.js-style env vars (process.env)
  try {
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

// Default fallback keys provided in prompt
const RAW_URL = "https://qmhrfcfnhsrpxbmdjbbo.supabase.co";
const RAW_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFtaHJmY2ZuaHNycHhibWRqYmJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MjU4MjEsImV4cCI6MjA4MzEwMTgyMX0.EMxOJ2VUzXlwb11kYfEadRGIKfmQes6lP6ASsiAxZb0";

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL') || RAW_URL;
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY') || RAW_KEY;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true
    }
  }
);
