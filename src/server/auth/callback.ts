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
    cookies: req.cookies,
    headers: req.headers
  });

  try {
    // Verify the state parameter against the cookie
    const storedState = req.cookies.oauth_state;
    
    if (!state || state !== storedState) {
      console.error('State mismatch:', { receivedState: state, storedState });
      return res.redirect('/?error=state_mismatch');
    }
    
    // Exchange the code for a token
    const { data, error } = await supabase.auth.exchangeCodeForSession(code as string);
    
    if (error) {
      console.error('Token exchange error:', error);
      return res.redirect('/?error=token_exchange_failed');
    }
    
    // Clear the state cookie
    res.setHeader('Set-Cookie', 'oauth_state=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax');
    
    // Successful authentication
    return res.redirect('/');
  } catch (error) {
    console.error('Server-side auth error:', error);
    return res.redirect('/?error=server_error');
  }
} 