import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Authentication helper functions
export const signUpWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  return { data, error };
};

export const signInWithEmail = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  return { data, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`,
    },
  });
  
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

// Cart management functions
export const getUserCart = async (userId: string) => {
  const { data, error } = await supabase
    .from('carts')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  return { data, error };
};

// Replace 'any' with a more specific type
type SupabaseData = {
  [key: string]: unknown;
};

// Then use this type instead of 'any'
export const updateUserCart = async (userId: string, cartItems: SupabaseData[]) => {
  const { data, error } = await supabase
    .from('carts')
    .upsert({ 
      user_id: userId, 
      items: cartItems,
      updated_at: new Date()
    })
    .select();
  
  return { data, error };
};

export const updateUserProfile = async (userId: string, data: SupabaseData) => {
  // ...existing code...
}; 