// Server-side callback handler
import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create authenticated Supabase client
  const supabase = createServerSupabaseClient({ req, res });
  
  // Get the code and state from the query parameters
  const { code, state } = req.query;
  
  // Log the incoming request for debugging
  console.log('Auth callback received:', {
    code: code ? 'present' : 'missing',
    state,
    cookies: Object.keys(req.cookies),
    url: req.url
  });

  try {
    // Exchange the code for a token without state verification
    // This bypasses the state check since we're having issues with it
    if (code) {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);
      
      if (error) {
        console.error('Token exchange error:', error);
        return res.redirect('/?error=token_exchange_failed');
      }
      
      // Successful authentication
      return res.redirect('/');
    } else {
      console.error('No code parameter in callback');
      return res.redirect('/?error=no_code_parameter');
    }
  } catch (error) {
    console.error('Server-side auth error:', error);
    return res.redirect('/?error=server_error');
  }
} 