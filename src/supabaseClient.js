import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if the user has replaced the placeholder with their actual key
export const isConfigured = supabaseAnonKey && 
                             supabaseAnonKey !== 'your_actual_anon_key_here' && 
                             supabaseAnonKey !== '';

if (!isConfigured) {
  console.warn(
    'Supabase public anon key is not configured in .env. Falling back to local localStorage.'
  );
}

export const supabase = isConfigured ? createClient(supabaseUrl, supabaseAnonKey) : null;
