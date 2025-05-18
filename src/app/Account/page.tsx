'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function Account() {
  const { user, isLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <div className="h-16 win95-window">
          <div className="win95-title-bar">Account</div>
        </div>
        <main className="flex-1 flex items-center justify-center">
          <div className="win95-window p-4">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <div className="h-16 win95-window">
        <div className="win95-title-bar">Account</div>
      </div>
      
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="win95-window p-4 w-full max-w-md">
          <div className="mb-4">
            <div className="win95-title-bar">User Information</div>
            <div className="p-2">
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>User ID:</strong> {user.id}</p>
              <p><strong>Member Since:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <div className="win95-title-bar">Account Settings</div>
            <div className="p-2">
              <button className="win95-button mb-2 w-full">Change Password</button>
              <button className="win95-button mb-2 w-full">Edit Profile</button>
              <button 
                className="win95-button w-full"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <div className="h-12 win95-window mt-auto">
        <div className="text-center text-sm">© 2023 Windows 95 Style</div>
      </div>
    </div>
  );
} 