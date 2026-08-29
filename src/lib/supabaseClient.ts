import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get Supabase credentials from env or localStorage
export const getSupabaseConfig = () => {
  const envUrl = import.meta.env.VITE_SUPABASE_URL;
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  const storedUrl = localStorage.getItem('vaney_supabase_url');
  const storedKey = localStorage.getItem('vaney_supabase_anon_key');

  const url = storedUrl || envUrl || '';
  const key = storedKey || envKey || '';

  return { url, key, isConfigured: Boolean(url && key && url !== 'https://your-project.supabase.co') };
};

let clientInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  const { url, key, isConfigured } = getSupabaseConfig();

  if (!isConfigured) {
    return null;
  }

  if (!clientInstance) {
    clientInstance = createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return clientInstance;
};

export const resetSupabaseClient = () => {
  clientInstance = null;
};
