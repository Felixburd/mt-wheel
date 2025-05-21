import React, { useEffect } from 'react';

const App: React.FC = () => {
  useEffect(() => {
    // Check if the URL contains the OAuth error
    if (window.location.href.includes('error=invalid_request') && 
        window.location.href.includes('error_code=bad_oauth_state')) {
      
      // Log the error for debugging
      console.error('OAuth error detected in URL:', window.location.href);
      
      // Clean up the URL without triggering a page reload
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
      
      // Optionally show a user-friendly error message
      // setAuthError('There was an issue with authentication. Please try again.');
    }
  }, []);

  return (
    // Rest of the component code
  );
};

export default App; 