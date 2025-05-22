// Server-side Supabase client
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export const createServerSupabaseClient = () => {
  return createServerComponentClient({
    cookies,
  });
};

// Function to validate session on protected routes
export async function validateSession() {
  const supabase = createServerSupabaseClient();
  
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('Session validation error:', error);
      return { valid: false, error };
    }
    
    if (!session) {
      return { valid: false, error: 'No session found' };
    }
    
    return { valid: true, session };
  } catch (error) {
    console.error('Session validation exception:', error);
    return { valid: false, error };
  }
} 