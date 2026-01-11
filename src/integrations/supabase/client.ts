import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://mvlgiqdwylzhiinqgxgs.supabase.co';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12bGdpcWR3eWx6aGlpbnFneGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgxMTQzMzQsImV4cCI6MjA4MzY5MDMzNH0.G6gEz7gmsKdFirAI9Na2U4-WHQXxg_4Gk9jbTOJHh8Q';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  },
});
