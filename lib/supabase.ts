import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

let supabaseInstance: SupabaseClient | null = null;

function getSupabaseClient() {
  if (supabaseInstance) {
    return supabaseInstance;
  }

  const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_URL environment variable');
  }

  if (!supabaseAnonKey) {
    throw new Error('Missing EXPO_PUBLIC_SUPABASE_ANON_KEY environment variable');
  }

  // Configurações específicas para diferentes plataformas
  const supabaseConfig = {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: Platform.OS === 'web',
    },
    global: {
      headers: {
        'X-Client-Info': `expo-${Platform.OS}`,
      },
    },
  };

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig);
  return supabaseInstance;
}

export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient();
    return (client as any)[prop];
  },
});