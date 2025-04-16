// Browser-specific entry point
document.addEventListener('DOMContentLoaded', () => {
  const rootElement = document.getElementById('app');
  
  if (rootElement) {
    // Import the App component and render it
    import('./App.tsx').then(({ App }) => {
      import('./jsx.ts').then(({ render }) => {
        render(App(), rootElement);
      });
    }).catch(error => {
      console.error('Error loading App component:', error);
      rootElement.innerHTML = '<div class="error">Error loading application. Please check the console for details.</div>';
    });
  } else {
    console.error('Root element not found');
  }
});
