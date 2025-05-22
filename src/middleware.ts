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
      req.nextUrl.searchParams.get('error') === 'OAuth callback with invalid state') {
    
    console.error('OAuth error detected in middleware:', {
      error: req.nextUrl.searchParams.get('error'),
      url: req.nextUrl.toString(),
      cookies: req.cookies.getAll().map(c => `${c.name}=${c.value.substring(0, 10)}...`)
    });
    
    // Clean the URL and redirect to home
    const url = new URL('/', req.url);
    return NextResponse.redirect(url);
  }
  
  return res;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}; 