'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { signIn, signInWithGoogle } = useAuth();

  // Handle hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await signIn(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    setIsLoading(true);
    
    try {
      console.log('Initiating Google login...');
      await signInWithGoogle();
    } catch (error) {
      console.error('Google login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Only render interactive elements after hydration
  if (!mounted) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-16 win95-window">
        <div className="win95-title-bar">Login</div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="win95-window p-4 w-full max-w-md">
          <div className="mb-4">
            <button 
              className="mt-3 w-full flex items-center justify-center win95-button mb-5"
              onClick={handleGoogleLogin}
              disabled={isLoading}
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png" 
                alt="Google logo" 
                className="h-4 mr-2" 
              />
              Login with Google
            </button>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or login with</span>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleEmailLogin}>
            <div className="mb-4">
              <label className="block mb-2">Email:</label>
              <input 
                type="email" 
                className="w-full" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2">Password:</label>
              <input 
                type="password" 
                className="w-full" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex justify-between">
              <button 
                type="submit" 
                className="win95-button"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Login'}
              </button>
              <button 
                type="button" 
                className="win95-button"
                onClick={() => window.location.href = '/Sign-up'}
              >
                Or create an account
              </button>
            </div>
          </form>
        </div>
      </main>
      
      {/* Footer */}
      <div className="h-12 win95-window mt-auto">
        <div className="text-center text-sm">© 2025 Mismatchtown</div>
      </div>
    </div>
  );
} 