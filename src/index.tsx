// In your main entry file or App component
if (window.location.href.includes('error=invalid_request')) {
  // Clean the URL and reload the page
  window.history.replaceState({}, document.title, window.location.pathname);
  // Optional: reload to ensure a clean state
  // window.location.reload();
} 