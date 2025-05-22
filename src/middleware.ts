import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if needed
  const { data: { session } } = await supabase.auth.getSession();
  
  // Log authentication state for debugging
  console.log('Middleware auth check:', {
    path: req.nextUrl.pathname,
    hasSession: !!session,
    cookies: req.cookies.getAll().map(c => c.name)
  });
  
  // Handle OAuth error parameters in URL
  if (req.nextUrl.searchParams.has('error') && 
      req.nextUrl.searchParams.get('error_code') === 'bad_oauth_state') {
    
    console.error('OAuth error detected in middleware:', {
      error: req.nextUrl.searchParams.get('error'),
      errorCode: req.nextUrl.searchParams.get('error_code'),
      errorDescription: req.nextUrl.searchParams.get('error_description')
    });
    
    // Clean the URL and redirect
    const url = req.nextUrl.clone();
    url.search = '';
    return NextResponse.redirect(url);
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 