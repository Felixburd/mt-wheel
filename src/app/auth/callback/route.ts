import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const error = requestUrl.searchParams.get('error');
  const error_description = requestUrl.searchParams.get('error_description');
  
  // Log all parameters for debugging
  console.log('Auth callback parameters:', {
    code: code ? 'present' : 'missing',
    error,
    error_description,
    url: request.url
  });
  
  if (error) {
    console.error('OAuth error:', error, error_description);
    // Redirect to error page or home with error parameter
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(error_description || error)}`, requestUrl.origin)
    );
  }
  
  if (code) {
    try {
      const cookieStore = cookies();
      const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
      
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Session exchange error:', error);
        return NextResponse.redirect(
          new URL(`/?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
        );
      }
      
      console.log('Auth successful, session established');
    } catch (err) {
      console.error('Exception during code exchange:', err);
      return NextResponse.redirect(
        new URL(`/?error=auth_exception`, requestUrl.origin)
      );
    }
  } else {
    console.error('No code parameter in callback URL');
  }
  
  // Redirect to the home page after authentication
  return NextResponse.redirect(new URL('/', requestUrl.origin));
} 