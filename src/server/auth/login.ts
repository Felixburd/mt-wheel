// Server-side login initiator
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  
  // Get the host from the request
  const host = req.headers.host || 'localhost';
  const protocol = host.includes('localhost') ? 'http' : 'https';
  const siteUrl = `${protocol}://${host}`;
  
  // Generate the authorization URL
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${siteUrl}/api/auth/callback`,
      // Don't specify state - let Supabase handle it internally
    }
  });
  
  if (error) {
    console.error('Auth initialization error:', error);
    return res.redirect('/?error=auth_init_failed');
  }
  
  // Redirect to the provider's authorization URL
  return res.redirect(data.url);
} 