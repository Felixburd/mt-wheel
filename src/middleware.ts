import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  // Only apply middleware to specific paths
  if (req.nextUrl.pathname.startsWith('/Account')) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check if the user is trying to access a protected route
    if (!session) {
      const redirectUrl = req.nextUrl.clone();
      redirectUrl.pathname = '/Login';
      redirectUrl.searchParams.set(`redirectedFrom`, req.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }

    return res;
  }
  
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Refresh session if expired
  await supabase.auth.getSession();
  
  return res;
}

export const config = {
  matcher: ['/account/:path*'],
}; 