// Server-side login initiator
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const supabase = createServerSupabaseClient({ req, res });
  
  // Generate a secure random state
  const state = crypto.randomBytes(16).toString('hex');
  
  // Store the state in a secure, HTTP-only cookie
  res.setHeader('Set-Cookie', `oauth_state=${state}; Path=/; Max-Age=3600; HttpOnly; Secure; SameSite=Lax`);
  
  // Get the provider from the query
  const { provider = 'google' } = req.query;
  
  // Generate the authorization URL
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: provider as any,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`,
      scopes: 'email profile',
      queryParams: {
        state
      }
    }
  });
  
  if (error) {
    console.error('Auth initialization error:', error);
    return res.redirect('/?error=auth_init_failed');
  }
  
  // Redirect to the provider's authorization URL
  return res.redirect(data.url);
} 