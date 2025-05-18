'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Session, User } from '@supabase/supabase-js';

type AuthError = {
  message: string;
  status?: number;
};

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  showError: (message: string) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setUser(session?.user ?? null);
      setIsLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setIsLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const showError = (message: string) => {
    setError(message);
    // Create a Windows 95 style error dialog
    alert(message); // For now, we'll use a simple alert
    // TODO: Replace with a proper Windows 95 style error dialog
  };

  const signUp = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({ email, password });
      
      if (error) {
        showError(error.message);
        return { error };
      }
      
      if (data?.user) {
        router.push('/');
      }
      
      return { error: null };
    } catch (error: unknown) {
      const authError = error as AuthError;
      showError(authError.message);
      return { error: authError };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        showError(error.message);
        return { error };
      }
      
      if (data?.user) {
        router.push('/');
      }
      
      return { error: null };
    } catch (error: unknown) {
      const authError = error as AuthError;
      showError(authError.message);
      return { error: authError };
    }
  };

  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google OAuth...');
      
      // Get the current origin dynamically
      const redirectUrl = typeof window !== 'undefined' 
        ? `${window.location.origin}/auth/callback`
        : process.env.NEXT_PUBLIC_SITE_URL + '/auth/callback';
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });
      
      console.log('OAuth response:', { data, error });
      
      if (error) {
        console.error('OAuth error:', error);
        showError(error.message);
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      console.error('Exception during OAuth:', authError);
      showError(authError.message);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        showError(error.message);
      } else {
        router.push('/');
      }
    } catch (error: unknown) {
      const authError = error as AuthError;
      showError(authError.message);
    }
  };

  const value = {
    user,
    session,
    isLoading,
    signUp,
    signIn,
    signInWithGoogle,
    signOut,
    showError,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
      {error && (
        <div className="win95-window fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-80">
          <div className="win95-title-bar">Error</div>
          <div className="p-4 bg-white">
            <p className="mb-4">{error}</p>
            <div className="flex justify-center">
              <button 
                className="win95-button px-4" 
                onClick={() => setError(null)}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 