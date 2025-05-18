'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, signInWithGoogle } = useAuth();

  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert('You must agree to the Terms of Service and Privacy Policy');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await signUp(email, password);
      // Username will be stored in a separate profile table after signup
    } catch (error) {
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent any default behavior
    setIsLoading(true);
    
    try {
      console.log('Initiating Google sign up...');
      await signInWithGoogle();
    } catch (error) {
      console.error('Google signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-16 win95-window">
        <div className="win95-title-bar flex items-center justify-between">
          <span>Sign Up - New User Registration</span>
          <div className="flex">
            <button className="px-2 ml-1 border-2 border-win95-highlight border-r-win95-dark-border border-b-win95-dark-border">_</button>
            <button className="px-2 ml-1 border-2 border-win95-highlight border-r-win95-dark-border border-b-win95-dark-border">□</button>
            <button className="px-2 ml-1 border-2 border-win95-highlight border-r-win95-dark-border border-b-win95-dark-border">✕</button>
          </div>
        </div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="win95-window p-4 w-full max-w-md">
          <div className="mb-6">
            <div className="win95-title-bar">Create Your Account</div>
            <div className="mb-4">
              <button 
                className="mt-3 w-full flex items-center justify-center win95-button-white mb-5"
                onClick={handleGoogleSignUp}
                disabled={isLoading}
              >
                <img 
                  src="https://upload.wikimedia.org/wikipedia/commons/3/3e/Google_2011_logo.png" 
                  alt="Google logo" 
                  className="h-4 mr-2" 
                />
                Sign up with Google
              </button>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or sign up with email</span>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleEmailSignUp}>
              <div className="p-3 bg-white border-2 border-win95-dark-border border-r-win95-highlight border-b-win95-highlight">
                <p className="mb-3">Please fill out the form below to create your new account.</p>
                
                <div className="mb-4">
                  <label className="block mb-1">Username:</label>
                  <input 
                    type="text" 
                    className="w-full" 
                    placeholder="Choose a username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <p className="text-xs mt-1 text-gray-600">Must be 3-20 characters long</p>
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Email Address:</label>
                  <input 
                    type="email" 
                    className="w-full" 
                    placeholder="your@email.com" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label className="block mb-1">Password:</label>
                  <input 
                    type="password" 
                    className="w-full" 
                    placeholder="••••••••" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs mt-1 text-gray-600">Minimum 8 characters</p>
                </div>
                
                <div className="mb-4 flex items-center">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    className="mr-2"
                    checked={agreeToTerms}
                    onChange={(e) => setAgreeToTerms(e.target.checked)}
                  />
                  <label htmlFor="terms" className="text-sm">I agree to the Terms of Service and Privacy Policy</label>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <button 
                  type="submit" 
                  className="win95-button px-6"
                  disabled={isLoading || !agreeToTerms}
                >
                  {isLoading ? 'Creating...' : 'Create Account'}
                </button>
                <button 
                  type="button" 
                  className="win95-button"
                  onClick={() => window.location.href = '/'}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
          
          <div className="mt-4 text-center">
            <p className="text-sm">Already have an account? <a href="/Login" className="text-blue-800 underline">Log In</a></p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <div className="h-12 win95-window mt-auto">
        <div className="flex items-center justify-between px-2">
          <button className="win95-button px-4 py-1 text-sm">Start</button>
          <div className="text-xs border-2 border-win95-dark-border border-r-win95-highlight border-b-win95-highlight px-2 py-1 bg-white">
            © 2025 Mismatchtown
          </div>
        </div>
      </div>
    </div>
  );
} 