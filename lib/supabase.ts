import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';
import { EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY } from '@env';

const supabaseUrl = EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = EXPO_PUBLIC_SUPABASE_ANON_KEY;

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

export const supabase = createClient(supabaseUrl, supabaseAnonKey, supabaseConfig);